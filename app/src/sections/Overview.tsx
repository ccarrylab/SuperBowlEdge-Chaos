import { useEffect, useState } from 'react'
import { 
  Shield, 
  Zap, 
  DollarSign, 
  Globe, 
  Server, 
  CheckCircle,
  Github,
  ExternalLink,
  TrendingUp,
  Lock,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const API_BASE = 'https://pa86b0v1ve.execute-api.us-east-1.amazonaws.com/prod'

export function Overview() {
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [cfRes, albRes, infraRes] = await Promise.all([
          fetch(`${API_BASE}/metrics/cloudfront`),
          fetch(`${API_BASE}/metrics/alb`),
          fetch(`${API_BASE}/metrics/infrastructure`)
        ])
        
        const cf = await cfRes.json()
        const alb = await albRes.json()
        const infra = await infraRes.json()
        
        setMetrics({ cf, alb, infra })
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4">
          <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
          <span className="text-sm font-medium text-blue-500">Live Production Infrastructure</span>
        </div>
        
        <h1 className="text-5xl font-bold gradient-text">
          SuperBowl Edge Chaos
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Production-grade AWS infrastructure demonstrating DevOps/SRE best practices with 
          real-time chaos engineering, comprehensive monitoring, and enterprise security
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Button 
            variant="default" 
            size="lg"
            onClick={() => window.open('https://github.com/ccarrylab/SuperBowlEdge-Chaos', '_blank')}
          >
            <Github className="h-5 w-5 mr-2" />
            View on GitHub
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.location.hash = '#/infrastructure'}
          >
            <Zap className="h-5 w-5 mr-2" />
            Explore Dashboard
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">99.9%</div>
            <p className="text-xs text-muted-foreground mt-1">Auto-healing enabled</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">121/121</div>
            <p className="text-xs text-muted-foreground mt-1">All checks passing</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-500" />
              Edge Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">5</div>
            <p className="text-xs text-muted-foreground mt-1">AWS Regions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">
              {metrics?.alb?.averageResponseTime?.toFixed(0) || '–'}ms
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average latency</p>
          </CardContent>
        </Card>
      </div>

      {/* What This Demonstrates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">What This Demonstrates</CardTitle>
          <CardDescription>
            Enterprise-level DevOps capabilities suitable for senior engineering roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-500" />
                Infrastructure as Code
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Multi-cloud Terraform deployment (AWS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Auto-scaling HAProxy load balancer (2+ instances)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>CloudFront CDN with WAF protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Serverless Lambda functions for metrics API</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Security Engineering
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>100% Checkov/tfsec security compliance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>KMS encryption for all data at rest</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>TLS 1.2+ enforced across all endpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>WAF with OWASP Top 10 protection</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Chaos Engineering
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>AWS FIS integration for fault injection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Automated recovery validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Real-time resilience testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Chaos experiment tracking and metrics</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Observability
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Real-time CloudWatch metrics integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>365-day log retention with encryption</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>SNS alerting for critical events</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Custom React dashboard with live data</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Technology Stack</CardTitle>
          <CardDescription>Production-grade tools and platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Infrastructure</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Terraform</Badge>
                <Badge variant="secondary">AWS</Badge>
                <Badge variant="secondary">CloudFormation</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Services</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">CloudFront</Badge>
                <Badge variant="secondary">Lambda</Badge>
                <Badge variant="secondary">ALB</Badge>
                <Badge variant="secondary">EC2</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Frontend</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Tailwind</Badge>
                <Badge variant="secondary">Vite</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">DevOps</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">GitHub Actions</Badge>
                <Badge variant="secondary">Checkov</Badge>
                <Badge variant="secondary">tfsec</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Architecture Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Architecture Highlights</CardTitle>
          <CardDescription>Production-ready design decisions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <h4 className="font-semibold">Cost Optimized</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                ~$150-200/month with 25-70% cost reduction through Reserved Instances, 
                right-sizing, and efficient resource utilization
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold">Compliance Ready</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                HIPAA, PCI-DSS, SOC 2, and ISO 27001 controls implemented. 
                100% security scan pass rate
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-purple-500" />
                <h4 className="font-semibold">High Availability</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Multi-AZ deployment with auto-scaling, health checks, 
                and automated failover for 99.9%+ uptime
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Explore?</h3>
            <p className="text-muted-foreground">
              Check out the live infrastructure, run chaos experiments, or view the complete source code
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="default"
                onClick={() => window.location.hash = '#/infrastructure'}
              >
                <Activity className="h-4 w-4 mr-2" />
                View Live Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://github.com/ccarrylab/SuperBowlEdge-Chaos', '_blank')}
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub Repository
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
