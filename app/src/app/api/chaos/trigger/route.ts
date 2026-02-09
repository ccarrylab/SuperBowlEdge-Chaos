import { NextRequest, NextResponse } from "next/server";
import { FISClient, StartExperimentCommand } from "@aws-sdk/client-fis";
import crypto from "crypto";

export const runtime = "nodejs";

const region = process.env.AWS_REGION || "us-east-1";
const fis = new FISClient({ region });

const TEMPLATE_MAP: Record<string, string | undefined> = {
  "cpu-stress": process.env.FIS_TEMPLATE_CPU_STRESS,
  "network-latency": process.env.FIS_TEMPLATE_NETWORK_LATENCY,
  "instance-termination": process.env.FIS_TEMPLATE_INSTANCE_TERMINATION,
  "disk-stress": process.env.FIS_TEMPLATE_DISK_STRESS,
};

function json(status: number, body: unknown) {
  return NextResponse.json(body, { status });
}

// In-memory rate limit: 1 per 5min per IP
const g = globalThis as any;
g.__chaosCooldowns ??= new Map<string, number>();

function rateLimit(key: string, cooldownMs = 5 * 60 * 1000) {
  const now = Date.now();
  const nextAllowed = g.__chaosCooldowns.get(key);
  
  if (nextAllowed && now < nextAllowed) {
    return { ok: false, retryAfterMs: nextAllowed - now };
  }
  
  g.__chaosCooldowns.set(key, now + cooldownMs);
  return { ok: true };
}

export async function POST(req: NextRequest) {
  const demoKey = req.headers.get("x-chaos-demo-key");
  if (!process.env.CHAOS_DEMO_KEY || demoKey !== process.env.CHAOS_DEMO_KEY) {
    return json(401, { error: "Unauthorized" });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

  const rl = rateLimit(ip, 5 * 60 * 1000); // 5 minutes
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Cooldown active", retryAfterMs: rl.retryAfterMs, retryAfterMinutes: Math.ceil(rl.retryAfterMs! / 60_000) },
      { 
        status: 429, 
        headers: { "Retry-After": "300" } // 5min
      }
    );
  }

  const body = await req.json().catch(() => ({} as any));
  const experimentId = String(body?.experimentId || "");
  const experimentTemplateId = TEMPLATE_MAP[experimentId];

  if (!experimentTemplateId) {
    return json(400, { error: "Invalid experimentId", allowed: Object.keys(TEMPLATE_MAP) });
  }

  const clientToken = crypto.randomUUID();

  try {
    const out = await fis.send(
      new StartExperimentCommand({
        experimentTemplateId,
        clientToken,
        tags: { source: "try-chaos-demo", experimentId, triggeredBy: ip },
      })
    );

    return json(200, {
      success: true,
      experimentId,
      fisExperimentId: out.experiment?.id,
      status: out.experiment?.state?.status,
      cooldownUntil: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });
  } catch (e: any) {
    console.error("FIS error:", e);
    return json(500, { 
      error: e?.name || "StartExperimentFailed", 
      message: e?.message || String(e) 
    });
  }
}
