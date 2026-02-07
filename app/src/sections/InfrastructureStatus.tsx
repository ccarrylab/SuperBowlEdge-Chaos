import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, CheckCircle } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { Badge } from "@/components/ui/badge";

export function InfrastructureStatus() {
  const { infrastructure, alb, loading } = useRealTimeMetrics();

  if (loading && !infrastructure) {
    return (
      <Card className="animate-pulse">
        <CardHeader><div className="h-6 bg-gray-700 rounded w-48"></div></CardHeader>
        <CardContent><div className="h-64 bg-gray-700 rounded"></div></CardContent>
      </Card>
    );
  }

  const haproxy = infrastructure?.haproxy;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Infrastructure Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ALB Status */}
        <div className="border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Application Load Balancer</h3>
            </div>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              ● Healthy
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Health</div>
              <div className="font-semibold text-green-500 mt-1">
                {alb?.healthyTargets}/{alb?.totalTargets} ({alb?.healthPercentage}%)
              </div>
            </div>
            <div>
              <div className="text-gray-400">Response Time</div>
              <div className="font-semibold mt-1">{alb?.averageResponseTime.toFixed(0)}ms</div>
            </div>
            <div>
              <div className="text-gray-400">Requests</div>
              <div className="font-semibold mt-1">{alb?.requestCount || 0}</div>
            </div>
          </div>
        </div>

        {/* HAProxy Instances */}
        <div className="border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">HAProxy Auto Scaling Group</h3>
            </div>
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              {haproxy?.runningInstances}/{haproxy?.totalInstances} Running
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div>
              <div className="text-gray-400">Desired</div>
              <div className="font-semibold mt-1">{haproxy?.desiredCapacity}</div>
            </div>
            <div>
              <div className="text-gray-400">Min / Max</div>
              <div className="font-semibold mt-1">{haproxy?.minSize} / {haproxy?.maxSize}</div>
            </div>
            <div>
              <div className="text-gray-400">Healthy</div>
              <div className="font-semibold text-green-500 mt-1">{haproxy?.healthyInstances}</div>
            </div>
          </div>

          <div className="space-y-2">
            {haproxy?.instances.map((instance) => (
              <div key={instance.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    instance.health === 'Healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}></div>
                  <code className="text-sm">{instance.id}</code>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">{instance.az}</span>
                  <Badge className={
                    instance.state === 'InService'
                      ? 'bg-green-500/10 text-green-500 border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }>
                    {instance.state}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
