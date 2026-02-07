import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, TrendingUp, Zap, AlertCircle } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { AnimatedCounter } from "@/components/effects/AnimatedCounter";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function CDNMetrics() {
  const { cloudfront, regions, loading, error } = useRealTimeMetrics();
  const [historicalData, setHistoricalData] = useState<Array<{time: string, requests: number, bandwidth: number}>>([]);

  // Build historical chart data
  useEffect(() => {
    if (cloudfront) {
      const now = new Date().toLocaleTimeString();
      setHistoricalData(prev => {
        const newData = [...prev, { 
          time: now, 
          requests: cloudfront.requests,
          bandwidth: cloudfront.bandwidth 
        }];
        return newData.slice(-20); // Keep last 20 points
      });
    }
  }, [cloudfront]);

  if (loading && !cloudfront) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
          />
          <p className="mt-4 text-gray-400">Loading CDN metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-xl font-semibold">Failed to load metrics</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const totalErrorRate = (cloudfront?.errorRate4xx || 0) + (cloudfront?.errorRate5xx || 0);
  const avgLatency = (regions?.regions.reduce((sum, loc) => sum + loc.latency, 0) || 0) / (regions?.regions.length || 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">CDN Metrics</h1>
          <p className="text-gray-400">CloudFront performance and edge locations</p>
        </div>
        <div className="bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
          <span className="text-green-500 font-semibold">● 450+ Edge Locations</span>
        </div>
      </motion.div>

      {/* Top Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                Requests/sec
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={regions?.totalRequests || 0} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Current rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-500" />
                Bandwidth (MB/s)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={regions?.totalBandwidth || 0} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Current throughput</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-green-500" />
                Error Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                <AnimatedCounter value={totalErrorRate} decimals={2} suffix="%" />
              </div>
              <p className="text-xs text-gray-500 mt-1">4xx + 5xx errors</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Requests Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
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
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bandwidth" 
                  stroke="#eab308" 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Edge Location Status - REAL DATA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Edge Location Status (Live)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regions?.regions.map((location, index) => (
              <motion.div
                key={location.region}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                    <h3 className="font-semibold">{location.region}</h3>
                  </div>
                  <div className="text-sm text-gray-400">
                    <AnimatedCounter value={location.requests} /> req/s
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Latency</div>
                    <div className="font-semibold mt-1">
                      <AnimatedCounter value={location.latency} suffix="ms" />
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Hit Rate</div>
                    <div className="font-semibold mt-1 text-green-500">
                      <AnimatedCounter value={location.hitRate} decimals={1} suffix="%" />
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Bandwidth</div>
                    <div className="font-semibold mt-1">
                      <AnimatedCounter value={location.bandwidth} suffix=" MB/s" />
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Traffic Share</div>
                    <div className="font-semibold mt-1">
                      <AnimatedCounter 
                        value={(location.requests / (regions.totalRequests || 1)) * 100} 
                        decimals={1}
                        suffix="%"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error & Performance Summary */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Error Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">4xx Errors (Client)</span>
                <span className="font-semibold">
                  <AnimatedCounter value={cloudfront?.errorRate4xx || 0} decimals={2} suffix="%" />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">5xx Errors (Server)</span>
                <span className="font-semibold">
                  <AnimatedCounter value={cloudfront?.errorRate5xx || 0} decimals={2} suffix="%" />
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                <span className="text-sm font-semibold">Total Error Rate</span>
                <span className="font-bold text-green-500">
                  <AnimatedCounter value={totalErrorRate} decimals={2} suffix="%" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Avg Latency</span>
                <span className="font-semibold">
                  <AnimatedCounter value={avgLatency} decimals={0} suffix="ms" />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Avg Cache Hit Rate</span>
                <span className="font-semibold text-green-500">
                  <AnimatedCounter 
                    value={(regions?.regions.reduce((sum, r) => sum + r.hitRate, 0) || 0) / (regions?.regions.length || 1)} 
                    decimals={1}
                    suffix="%"
                  />
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                <span className="text-sm font-semibold">Uptime</span>
                <span className="font-bold text-green-500">99.99%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
