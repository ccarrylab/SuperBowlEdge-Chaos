import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Globe, Zap, Shield } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";

export function MetricsOverview() {
  const { cloudfront, alb, chaos, loading } = useRealTimeMetrics();

  const metrics = [
    {
      title: "Requests/sec",
      value: cloudfront?.requests || 0,
      change: "+12%",
      trend: "up",
      icon: Activity,
      color: "text-blue-500"
    },
    {
      title: "Edge Locations",
      value: "450+",
      change: "Global",
      trend: "neutral",
      icon: Globe,
      color: "text-green-500"
    },
    {
      title: "ALB Health",
      value: `${alb?.healthPercentage.toFixed(0) || 0}%`,
      change: `${alb?.healthyTargets || 0}/${alb?.totalTargets || 0} targets`,
      trend: alb?.healthPercentage === 100 ? "up" : "down",
      icon: Zap,
      color: "text-yellow-500"
    },
    {
      title: "Chaos Success",
      value: `${chaos?.successRate || 0}%`,
      change: `${chaos?.completed || 0} passed`,
      trend: (chaos?.successRate || 0) > 50 ? "up" : "down",
      icon: Shield,
      color: "text-purple-500"
    }
  ];

  if (loading && !cloudfront) {
    return (
      <div className="grid grid-cols-4 gap-4 animate-pulse">
        {[1,2,3,4].map(i => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="transition-all hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              {metric.trend === "up" && <TrendingUp className="w-3 h-3 text-green-500" />}
              {metric.trend === "down" && <TrendingDown className="w-3 h-3 text-red-500" />}
              {metric.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
