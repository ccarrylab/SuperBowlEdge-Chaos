import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Activity, Globe, Shield, RefreshCw } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { Badge } from "@/components/ui/badge";

export default function EdgeInfrastructure() {
  const { infrastructure, alb, loading, error, refresh } = useRealTimeMetrics();

  if (loading && !infrastructure) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading infrastructure status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-400">
          <p className="text-xl font-semibold">Failed to load infrastructure</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const haproxy = infrastructure?.haproxy;
  const healthPercentage = haproxy 
    ? ((haproxy.healthyInstances / haproxy.totalInstances) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edge Infrastructure</h1>
          <p className="text-gray-400">AWS edge tier components</p>
        </div>
        <button 
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-500" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">4/4</div>
            <p className="text-xs text-gray-500 mt-1">Operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Instances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {haproxy?.runningInstances || 0}/{haproxy?.totalInstances || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-yellow-500" />
              Edge Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">450+</div>
            <p className="text-xs text-gray-500 mt-1">Global</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-500" />
              Avg Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alb?.averageResponseTime.toFixed(0) || 0}ms</div>
            <p className="text-xs text-gray-500 mt-1">Edge origin</p>
          </CardContent>
        </Card>
      </div>

      {/* Core Services */}
      <Card>
        <CardHeader>
          <CardTitle>Core Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* CloudFront */}
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">CloudFront</h3>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  ● Operational
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-400">Latency</div>
                  <div className="font-semibold mt-1">23ms</div>
                </div>
                <div>
                  <div className="text-gray-400">Uptime</div>
                  <div className="font-semibold text-green-500 mt-1">99.99%</div>
                </div>
              </div>
            </div>

            {/* Application Load Balancer */}
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-semibold">Application Load Balancer</h3>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  ● Operational
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-400">Latency</div>
                  <div className="font-semibold mt-1">{alb?.averageResponseTime.toFixed(0) || 0}ms</div>
                </div>
                <div>
                  <div className="text-gray-400">Uptime</div>
                  <div className="font-semibold text-green-500 mt-1">99.95%</div>
                </div>
              </div>
            </div>

            {/* HAProxy Origin */}
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">HAProxy Origin</h3>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  ● Operational
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-400">Latency</div>
                  <div className="font-semibold mt-1">8ms</div>
                </div>
                <div>
                  <div className="text-gray-400">Uptime</div>
                  <div className="font-semibold text-green-500 mt-1">99.9%</div>
                </div>
              </div>
            </div>

            {/* AWS WAF */}
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold">AWS WAF</h3>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                  ● Operational
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-400">Latency</div>
                  <div className="font-semibold mt-1">2ms</div>
                </div>
                <div>
                  <div className="text-gray-400">Uptime</div>
                  <div className="font-semibold text-green-500 mt-1">100%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HAProxy Origin Instances */}
      <Card>
        <CardHeader>
          <CardTitle>HAProxy Origin Instances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Running Instances</div>
                <div className="text-xl font-bold text-green-500 mt-1">
                  {haproxy?.runningInstances || 0}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Healthy Instances</div>
                <div className="text-xl font-bold text-green-500 mt-1">
                  {haproxy?.healthyInstances || 0}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Desired Capacity</div>
                <div className="text-xl font-bold mt-1">
                  {haproxy?.desiredCapacity || 0}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Health</div>
                <div className="text-xl font-bold text-green-500 mt-1">
                  {healthPercentage}%
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {haproxy?.instances.map((instance) => (
              <div key={instance.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      instance.health === 'Healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`}></div>
                    <code className="text-sm font-mono">{instance.id}</code>
                  </div>
                  <Badge className={
                    instance.state === 'InService' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                  }>
                    {instance.state}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">CPU</span>
                    <span className="font-semibold">
                      {instance.id.endsWith('5') ? '42' : '38'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Memory</span>
                    <span className="font-semibold">
                      {instance.id.endsWith('5') ? '58' : '52'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network</span>
                    <span className="font-semibold">
                      {instance.id.endsWith('5') ? '234' : '198'} MB/s
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-700">
                    <span className="text-gray-400">AZ</span>
                    <span className="font-semibold">{instance.az}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Auto Scaling Configuration</div>
                <div className="text-sm text-gray-400 mt-1">
                  Min: {haproxy?.minSize} | Max: {haproxy?.maxSize} | Current: {haproxy?.desiredCapacity}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Scale-out triggers</div>
                <div className="text-sm font-semibold mt-1">CPU &gt; 70% | Requests &gt; 1000/s</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
