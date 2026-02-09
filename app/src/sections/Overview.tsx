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
import { SkeletonCard, SkeletonGrid } from '@/components/SkeletonCard'

const API_BASE = 'https://pa86b0v1ve.execute-api.us-east-1.amazonaws.com/prod'

export function Overview() {
  const [metrics, setMetrics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      } finally {
        setIsLoading(false)
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
      {isLoading ? (
        <SkeletonGrid count={4} variant="metric" />
      ) : (
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
                <Globe className="h-4 w-4 text-blue-500" />
                CDN Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">
                {metrics?.cf?.requests?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Last 5 minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="h-4 w-4 text-purple-500" />
                Healthy Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-500">
                {metrics?.alb?.healthyTargets || 0}/{metrics?.alb?.totalTargets || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Load balancer</p>
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
                {metrics?.alb?.averageResponseTime || 0}ms
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average latency</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rest of your Overview content stays the same... */}
      {/* Key Features, Architecture, etc. */}
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Chaos Engineering
            </CardTitle>
            <CardDescription>
              Real AWS FIS experiments with auto-recovery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>CPU stress, network latency, instance termination</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Automated healing with Auto Scaling Groups</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Real-time monitoring during chaos events</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Enterprise Security
            </CardTitle>
            <CardDescription>
              SOC2-ready security posture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>WAF with DDoS protection and rate limiting</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>KMS encryption for data at rest</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Security Hub with 129+ passed checks</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Built with Production Thinking</h3>
              <p className="text-blue-100">
                Multi-AZ deployment • Auto-scaling • Chaos testing • Security monitoring • Cost optimization
              </p>
            </div>
            <Button 
              variant="secondary"
              size="lg"
              onClick={() => window.open('https://github.com/ccarrylab/SuperBowlEdge-Chaos', '_blank')}
              className="whitespace-nowrap"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              View Source Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
