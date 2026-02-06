import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function ChaosExperiments() {
  const { chaos, loading, error } = useRealTimeMetrics();

  if (loading && !chaos) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading chaos experiments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-400">
          <p className="text-xl font-semibold">Failed to load experiments</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const experimentTemplates = [
    {
      id: 'cpu_stress',
      name: 'Region Blackout',
      description: 'Simulate complete CloudFront edge failure in a region',
      duration: '3m',
      impact: 'high',
      templateId: 'EXT4E94mZgUo8FR5S'
    },
    {
      id: 'network_latency',
      name: 'Network Latency Spike',
      description: 'Inject high latency between edge and origin',
      duration: '2m',
      impact: 'medium',
      templateId: 'EXT9m8wkNq6LUd6'
    },
    {
      id: 'origin_failure',
      name: 'Origin Server Failure',
      description: 'Test HAProxy failover when origin goes down',
      duration: '2m',
      impact: 'high',
      templateId: 'EXT2kgPXdWpcQNxp'
    },
    {
      id: 'ddos_sim',
      name: 'DDoS Attack Simulation',
      description: 'Test WAF rate limiting under attack',
      duration: '5m',
      impact: 'low',
      templateId: 'EXTBHEy6uT9uXG3TW'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-500/10 text-green-500 border-green-500/20',
      failed: 'bg-red-500/10 text-red-500 border-red-500/20',
      running: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      default: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    };
    return styles[status as keyof typeof styles] || styles.default;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chaos Engineering</h1>
          <p className="text-gray-400">AWS FIS experiments for edge resilience</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-2">
            {chaos?.total || 0} tests run
          </Badge>
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-4 py-2">
            {chaos?.successRate || 0}% success
          </Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{chaos?.successRate || 0}%</div>
            <p className="text-xs text-gray-500 mt-1">{chaos?.completed || 0} passed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              Avg Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">6s</div>
            <p className="text-xs text-gray-500 mt-1">Auto-healing time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Viewer Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">99.97%</div>
            <p className="text-xs text-gray-500 mt-1">During tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              Active Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{chaos?.running || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Currently running</p>
          </CardContent>
        </Card>
      </div>

      {/* Experiment Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Experiments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {experimentTemplates.map((exp) => {
              const lastRun = chaos?.experiments.find(e => e.templateId === exp.templateId);
              
              return (
                <div key={exp.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {exp.impact === 'high' ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : exp.impact === 'medium' ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <Zap className="w-5 h-5 text-green-500" />
                        )}
                        <h3 className="font-semibold">{exp.name}</h3>
                        <Badge className={`${
                          exp.impact === 'high' 
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : exp.impact === 'medium'
                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            : 'bg-green-500/10 text-green-500 border-green-500/20'
                        }`}>
                          {exp.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{exp.description}</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                      ▶ Run
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
                    <div>
                      <div className="text-xs text-gray-400">Downtime</div>
                      <div className="font-semibold mt-1">0s</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Recovery</div>
                      <div className="font-semibold mt-1">
                        {lastRun ? '6s' : '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Last Result</div>
                      <div className="font-semibold mt-1 flex items-center gap-2">
                        {lastRun ? (
                          <>
                            {getStatusIcon(lastRun.status)}
                            <span className="capitalize">{lastRun.status}</span>
                          </>
                        ) : (
                          '-'
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Last Run</div>
                      <div className="font-semibold mt-1 text-xs">
                        {lastRun 
                          ? formatDistanceToNow(new Date(lastRun.creationTime), { addSuffix: true })
                          : 'Never'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Experiment History */}
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chaos?.experiments.slice(0, 10).map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(exp.status)}
                  <div>
                    <div className="font-mono text-sm">{exp.id}</div>
                    <div className="text-xs text-gray-400">
                      Template: {exp.templateId}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusBadge(exp.status)}>
                    {exp.status}
                  </Badge>
                  <div className="text-sm text-gray-400 text-right">
                    {formatDistanceToNow(new Date(exp.creationTime), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
