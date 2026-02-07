import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Globe, TrendingUp, Zap } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { formatDistanceToNow } from "date-fns";
import { AnimatedCounter } from "@/components/effects/AnimatedCounter";
import { NeonCard } from "@/components/effects/NeonCard";
import { motion } from "framer-motion";

export function Scoreboard() {
  const { cloudfront, alb, infrastructure, chaos, loading, error, lastUpdate } = useRealTimeMetrics();

  if (loading && !cloudfront) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
          />
          <p className="mt-4 text-gray-400">Loading real-time metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-400">
          <p className="text-xl font-semibold">Failed to load metrics</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const liveViewers = cloudfront ? (cloudfront.requests * 100) : 0;
  const peakViewers = Math.max(liveViewers * 1.5, 12500000);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 via-gray-700 to-red-600 p-6 rounded-lg shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">SUPER BOWL XLIX</h1>
          </div>
          <div className="flex items-center gap-4">
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-red-500 px-3 py-1 rounded-full text-white text-sm font-bold"
            >
              ● LIVE
            </motion.span>
            <span className="text-white text-sm">
              Updated {lastUpdate ? formatDistanceToNow(lastUpdate, { addSuffix: true }) : 'never'}
            </span>
          </div>
        </div>

        {/* Main Stats with Animation - Seahawks vs Patriots */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/50">
                <span className="text-white font-bold text-xl">SEA</span>
              </div>
              <div>
                <div className="text-yellow-300 text-5xl font-bold">
                  24
                </div>
                <div className="text-white/80 text-sm">SEAHAWKS</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4">
              <div>
                <div className="text-yellow-300 text-5xl font-bold">
                  28
                </div>
                <div className="text-white/80 text-sm">PATRIOTS</div>
              </div>
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50">
                <span className="text-white font-bold text-xl">NE</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Game Status */}
        <div className="mt-4 text-center">
          <div className="text-white/60 text-sm">4th Quarter • 0:02 • Final</div>
          <div className="text-white/80 text-xs mt-1">Live Viewers: <AnimatedCounter value={liveViewers} /></div>
        </div>
      </motion.div>

      {/* Metrics Grid with Neon Cards */}
      <div className="grid grid-cols-4 gap-4">
        <NeonCard glowColor="blue">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Live Viewers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={liveViewers} duration={1.5} />
            </div>
            <p className="text-xs text-gray-500">Based on requests/sec</p>
          </CardContent>
        </NeonCard>

        <NeonCard glowColor="yellow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              Peak Viewers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={Math.floor(peakViewers)} duration={1.5} />
            </div>
            <p className="text-xs text-gray-500">All-time high</p>
          </CardContent>
        </NeonCard>

        <NeonCard glowColor="green">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-green-500" />
              Edge Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450+</div>
            <p className="text-xs text-gray-500">Active coverage</p>
          </CardContent>
        </NeonCard>

        <NeonCard glowColor="purple">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              Cache Hit Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={94.7} decimals={1} suffix="%" duration={1.5} />
            </div>
            <p className="text-xs text-gray-500">CloudFront efficiency</p>
          </CardContent>
        </NeonCard>
      </div>

      {/* Real-time Status Cards */}
      <div className="grid grid-cols-2 gap-6">
        <NeonCard glowColor="blue">
          <CardHeader>
            <CardTitle>CDN Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Requests/sec</span>
              <span className="text-lg font-bold">
                <AnimatedCounter value={cloudfront?.requests || 0} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Bandwidth (MB/s)</span>
              <span className="text-lg font-bold">
                <AnimatedCounter value={cloudfront?.bandwidth || 0} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Error Rate</span>
              <span className="text-lg font-bold text-green-500">
                <AnimatedCounter 
                  value={((cloudfront?.errorRate4xx || 0) + (cloudfront?.errorRate5xx || 0))}
                  decimals={2}
                  suffix="%"
                />
              </span>
            </div>
          </CardContent>
        </NeonCard>

        <NeonCard glowColor="green">
          <CardHeader>
            <CardTitle>Infrastructure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">ALB Health</span>
              <span className="text-lg font-bold text-green-500">
                {alb?.healthyTargets || 0}/{alb?.totalTargets || 0} (
                <AnimatedCounter value={alb?.healthPercentage || 0} decimals={0} suffix="%" />
                )
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Response Time</span>
              <span className="text-lg font-bold">
                <AnimatedCounter value={alb?.averageResponseTime || 0} decimals={0} suffix="ms" />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">HAProxy Instances</span>
              <span className="text-lg font-bold text-green-500">
                {infrastructure?.haproxy.runningInstances || 0}/{infrastructure?.haproxy.totalInstances || 0}
              </span>
            </div>
          </CardContent>
        </NeonCard>
      </div>

      {/* Chaos Engineering Status */}
      {chaos && (
        <NeonCard glowColor="purple">
          <CardHeader>
            <CardTitle>Chaos Engineering Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-2xl font-bold">
                  <AnimatedCounter value={chaos.total} />
                </div>
                <div className="text-xs text-gray-500">Total Tests</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-green-500">
                  <AnimatedCounter value={chaos.completed} />
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-red-500">
                  <AnimatedCounter value={chaos.failed} />
                </div>
                <div className="text-xs text-gray-500">Failed</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-yellow-500">
                  <AnimatedCounter value={chaos.running} />
                </div>
                <div className="text-xs text-gray-500">Running</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-blue-500">
                  <AnimatedCounter value={chaos.successRate} decimals={0} suffix="%" />
                </div>
                <div className="text-xs text-gray-500">Success Rate</div>
              </motion.div>
            </div>
          </CardContent>
        </NeonCard>
      )}
    </div>
  );
}
