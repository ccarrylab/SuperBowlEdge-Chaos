import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github } from 'lucide-react'

export function Architecture() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Architecture</h2>
          <p className="text-muted-foreground">AWS infrastructure design and data flow</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => window.open('https://github.com/ccarrylab/SuperBowlEdge-Chaos', '_blank')}
        >
          <Github className="w-4 h-4 mr-2" />
          View Source
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <img 
            src="/architecture.png" 
            alt="AWS Architecture Diagram" 
            className="w-full rounded-lg border border-border"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Edge Layer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• CloudFront CDN (Global Distribution)</li>
              <li>• AWS WAF (DDoS Protection)</li>
              <li>• Route53 (DNS + SSL/TLS)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compute Layer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• Application Load Balancer</li>
              <li>• HAProxy Auto Scaling Group</li>
              <li>• Lambda (Metrics API)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Observability</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• CloudWatch Metrics & Logs</li>
              <li>• AWS FIS (Chaos Engineering)</li>
              <li>• SNS Alerting</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
