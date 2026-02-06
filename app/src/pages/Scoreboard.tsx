import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Globe, TrendingUp, Zap } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { formatDistanceToNow } from "date-fns";

export default function Scoreboard() {
  const { cloudfront, alb, infrastructure, chaos, loading, error, lastUpdate } = useRealTimeMetrics();

  if (loading && !cloudfront) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
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

  // Calculate live viewers (simulated based on requests)
  const liveViewers = cloudfront ? (cloudfront.requests * 100) : 0;
  const peakViewers = Math.max(liveViewers * 1.5, 12500000);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">SUPER BOWL LVIII</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-red-500 px-3 py-1 rounded-full text-white text-sm font-bold animate-pulse">
              ● LIVE
            </span>
            <span className="text-white text-sm">
              Updated {lastUpdate ? formatDistanceToNow(lastUpdate, { addSuffix: true }) : 'never'}
            </span>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div>
                <div className="text-yellow-300 text-5xl font-bold">
                  {liveViewers.toLocaleString()}
                </div>
                <div className="text-white/80 text-sm">EAGLES</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <div>
                <div className="text-yellow-300 text-5xl font-bold">
                  {Math.floor(peakViewers).toLocaleString()}
                </div>
                <div className="text-white/80 text-sm">CHIEFS</div>
              </div>
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Live Viewers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveViewers.toLocaleString()}</div>
            <p className="text-xs text-gray-500">Based on requests/sec</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              Peak Viewers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(peakViewers).toLocaleString()}</div>
            <p className="text-xs text-gray-500">All-time high</p>
          </CardContent>
        </Card>

        <Card>
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
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              Cache Hit Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.7%</div>
            <p className="text-xs text-gray-500">CloudFront efficiency</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status Cards */}
      <div className="grid grid-cols-2 gap-6">
        {/* CDN Performance */}
        <Card>
          <CardHeader>
            <CardTitle>CDN Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Requests/sec</span>
              <span className="text-lg font-bold">{cloudfront?.requests || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Bandwidth (MB/s)</span>
              <span className="text-lg font-bold">{cloudfront?.bandwidth || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Error Rate</span>
              <span className="text-lg font-bold text-green-500">
                {((cloudfront?.errorRate4xx || 0) + (cloudfront?.errorRate5xx || 0)).toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Health */}
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">ALB Health</span>
              <span className="text-lg font-bold text-green-500">
                {alb?.healthyTargets || 0}/{alb?.totalTargets || 0} ({alb?.healthPercentage || 0}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Response Time</span>
              <span className="text-lg font-bold">{alb?.averageResponseTime || 0}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">HAProxy Instances</span>
              <span className="text-lg font-bold text-green-500">
                {infrastructure?.haproxy.runningInstances || 0}/{infrastructure?.haproxy.totalInstances || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chaos Engineering Status */}
      {chaos && (
        <Card>
          <CardHeader>
            <CardTitle>Chaos Engineering Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{chaos.total}</div>
                <div className="text-xs text-gray-500">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{chaos.completed}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{chaos.failed}</div>
                <div className="text-xs text-gray-500">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{chaos.running}</div>
                <div className="text-xs text-gray-500">Running</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{chaos.successRate}%</div>
                <div className="text-xs text-gray-500">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
