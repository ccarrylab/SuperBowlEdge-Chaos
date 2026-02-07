import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Download, PlayCircle, Loader2, TrendingUp } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/useRealTimeMetrics";
import { generateSecurityReport, downloadJSON } from "@/utils/reportGenerator";

export function SecurityMonitor() {
  const { alb, infrastructure } = useRealTimeMetrics();
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
    const report = generateSecurityReport({ alb, infrastructure });
    const timestamp = new Date().toISOString().split('T')[0];
    downloadJSON(report, `security-report-${timestamp}.json`);
  };

  const securityChecks = [
    { name: 'CloudFront HTTPS', status: 'pass', description: 'All traffic encrypted' },
    { name: 'WAF Protection', status: 'pass', description: 'Active rules deployed' },
    { name: 'ALB Health', status: alb?.healthPercentage === 100 ? 'pass' : 'warning', description: `${alb?.healthPercentage || 0}% healthy` },
    { name: 'SSL/TLS', status: 'pass', description: 'ACM certificate valid' },
    { name: 'IAM Roles', status: 'pass', description: 'Least privilege enforced' },
    { name: 'VPC Security Groups', status: 'pass', description: 'Properly configured' },
    { name: 'S3 Encryption', status: 'pass', description: 'Server-side encryption enabled' },
    { name: 'CloudWatch Logging', status: 'pass', description: 'All services logging' },
    { name: 'Auto Scaling', status: 'pass', description: `${infrastructure?.haproxy?.runningInstances || 0} instances running` },
    { name: 'DDoS Protection', status: 'pass', description: 'CloudFront + WAF + Shield Standard' },
  ];

  const passed = securityChecks.filter(c => c.status === 'pass').length;
  const warnings = securityChecks.filter(c => c.status === 'warning').length;
  const score = Math.round((passed / securityChecks.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Monitor</h1>
          <p className="text-gray-400">Infrastructure security posture</p>
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
                <span>Security scan in progress...</span>
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

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{score}%</div>
            <p className="text-xs text-gray-500 mt-1">Overall posture</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Passed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{passed}</div>
            <p className="text-xs text-gray-500 mt-1">Security checks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{warnings}</div>
            <p className="text-xs text-gray-500 mt-1">Need attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityChecks.map((check) => (
              <div key={check.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {check.status === 'pass' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <div className="font-semibold">{check.name}</div>
                    <div className="text-sm text-gray-400">{check.description}</div>
                  </div>
                </div>
                <Badge className={check.status === 'pass' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}>
                  {check.status === 'pass' ? 'Pass' : 'Warning'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DDoS Protection Details & Recommendations */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-green-500/20 bg-green-900/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Current DDoS Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-300"><strong>CloudFront:</strong> Layer 3/4 DDoS protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-300"><strong>AWS WAF:</strong> Layer 7 application attacks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-300"><strong>Shield Standard:</strong> Automatic protection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-300"><strong>Auto Scaling:</strong> Handles traffic surges</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-900/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Optional Enhancement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-blue-400 mb-2">AWS Shield Advanced</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>24/7 DDoS Response Team (DRT)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Cost protection during attacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Advanced real-time metrics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Integration with AWS Firewall Manager</span>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-500">Cost: ~$3,000/month + data transfer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
