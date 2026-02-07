import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, TrendingUp } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { useState, useEffect } from "react";

export function RealTimeMetrics() {
  const { cloudfront, alb, loading } = useRealTimeMetrics();
  const [requestsHistory, setRequestsHistory] = useState<Array<{time: string, value: number}>>([]);
  const [bandwidthHistory, setBandwidthHistory] = useState<Array<{time: string, value: number}>>([]);

  // Update history arrays when new data arrives
  useEffect(() => {
    if (cloudfront) {
      const now = new Date().toLocaleTimeString();
      
      setRequestsHistory(prev => {
        const newHistory = [...prev, { time: now, value: cloudfront.requests }];
        return newHistory.slice(-20); // Keep last 20 points
      });

      setBandwidthHistory(prev => {
        const newHistory = [...prev, { time: now, value: cloudfront.bandwidth }];
        return newHistory.slice(-20);
      });
    }
  }, [cloudfront]);

  if (loading && !cloudfront) {
    return (
      <div className="grid grid-cols-2 gap-6 animate-pulse">
        <Card>
          <CardHeader><div className="h-6 bg-gray-700 rounded w-32"></div></CardHeader>
          <CardContent><div className="h-64 bg-gray-700 rounded"></div></CardContent>
        </Card>
        <Card>
          <CardHeader><div className="h-6 bg-gray-700 rounded w-32"></div></CardHeader>
          <CardContent><div className="h-64 bg-gray-700 rounded"></div></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Requests/sec
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cloudfront?.requests || 0}</div>
            <p className="text-xs text-gray-400 mt-1">Current rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Bandwidth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{cloudfront?.bandwidth || 0} MB/s</div>
            <p className="text-xs text-gray-400 mt-1">Current throughput</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alb?.averageResponseTime.toFixed(0) || 0}ms</div>
            <p className="text-xs text-gray-400 mt-1">ALB average</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Requests Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={requestsHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bandwidth Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={bandwidthHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#eab308" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
