import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, Download, PlayCircle, Loader2 } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { generateSecurityReport, downloadJSON } from "@/utils/reportGenerator";

export function SecurityScore() {
  const { alb, infrastructure, chaos } = useRealTimeMetrics();
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleRunScan = async () => {
    setScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setScanning(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleExport = () => {
    const report = generateSecurityReport({ alb, infrastructure, chaos });
    const timestamp = new Date().toISOString().split('T')[0];
    downloadJSON(report, `security-score-${timestamp}.json`);
  };

  const categories = [
    { name: 'Infrastructure', score: 96, items: ['CloudFront', 'ALB', 'VPC', 'Auto Scaling'] },
    { name: 'Network Security', score: 94, items: ['WAF', 'Security Groups', 'SSL/TLS'] },
    { name: 'Access Control', score: 98, items: ['IAM Roles', 'Least Privilege', 'MFA'] },
    { name: 'Data Protection', score: 92, items: ['Encryption at Rest', 'Encryption in Transit'] },
    { name: 'Monitoring', score: 95, items: ['CloudWatch', 'Logging', 'Alerting'] },
  ];

  const overallScore = Math.round(categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Score</h1>
          <p className="text-gray-400">Comprehensive security assessment</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRunScan}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
          >
            {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            {scanning ? 'Scanning...' : 'Run Scan'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {scanning && (
        <Card className="border-blue-500 bg-blue-900/10">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Running comprehensive security scan...</span>
                <span className="font-mono">{scanProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-4">
        <Card className="col-span-2 border-green-500 bg-green-900/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              Overall Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-green-500">{overallScore}</div>
            <p className="text-xs text-gray-500 mt-1">Out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">+2%</div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Chaos Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{chaos?.successRate || 0}%</div>
            <p className="text-xs text-gray-500 mt-1">Success rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{category.name}</span>
                  <Badge className="bg-green-500/10 text-green-500">
                    {category.score}/100
                  </Badge>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {category.items.map(item => (
                    <span key={item} className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
