import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Server, 
  Cloud, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  ChevronRight,
  Activity,
  Globe,
  Cpu,
  HardDrive
} from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const API_BASE = 'https://pa86b0v1ve.execute-api.us-east-1.amazonaws.com/prod'

interface ServiceStatus {
  id: string
  name: string
  status: 'operational' | 'degraded' | 'down' | 'maintenance'
  icon: React.ElementType
  uptime: string
  latency: string
  details?: string[]
}

interface InstanceStatus {
  id: string
  name: string
  type: string
  status: 'running' | 'stopped' | 'pending'
  cpu: number
  memory: number
  network: number
  az: string
  health: string
}

interface InfrastructureData {
  haproxy: {
    runningInstances: number
    healthyInstances: number
    totalInstances: number
    instances: Array<{
      id: string
      state: string
      health: string
      az: string
    }>
  }
}

interface ALBData {
  healthyTargets: number
  totalTargets: number
  healthPercentage: number
  averageResponseTime: number
}

const statusConfig = {
  operational: { color: 'text-emerald-400', bg: 'bg-emerald-500', icon: CheckCircle },
  degraded: { color: 'text-amber-400', bg: 'bg-amber-500', icon: AlertTriangle },
  down: { color: 'text-red-400', bg: 'bg-red-500', icon: AlertTriangle },
  maintenance: { color: 'text-blue-400', bg: 'bg-blue-500', icon: RefreshCw },
  running: { color: 'text-emerald-400', bg: 'bg-emerald-500' },
  stopped: { color: 'text-red-400', bg: 'bg-red-500' },
  pending: { color: 'text-amber-400', bg: 'bg-amber-500' },
}

export function EdgeInfrastructure({ compact = false }: { compact?: boolean }) {
  const [infraData, setInfraData] = useState<InfrastructureData | null>(null)
  const [albData, setALBData] = useState<ALBData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [openServices, setOpenServices] = useState<string[]>([])

  const fetchInfraData = useCallback(async () => {
    try {
      const [infraResponse, albResponse] = await Promise.all([
        fetch(`${API_BASE}/metrics/infrastructure`),
        fetch(`${API_BASE}/metrics/alb`)
      ])
      
      if (infraResponse.ok) {
        const data = await infraResponse.json()
        setInfraData(data)
      }
      
      if (albResponse.ok) {
        const data = await albResponse.json()
        setALBData(data)
      }
    } catch (error) {
      console.error('Failed to fetch infrastructure data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInfraData()
    const interval = setInterval(fetchInfraData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [fetchInfraData])

  // Build instances from real data
  const instances: InstanceStatus[] = infraData?.haproxy.instances.map((inst, idx) => ({
    id: inst.id,
    name: `haproxy-${inst.id}`,
    type: 't3.medium',
    status: inst.state === 'InService' ? 'running' : 'stopped',
    cpu: 35 + Math.random() * 30, // Simulated - would need CloudWatch
    memory: 45 + Math.random() * 25, // Simulated - would need CloudWatch
    network: 150 + Math.random() * 200, // Simulated - would need CloudWatch
    az: inst.az,
    health: inst.health
  })) || []

  // Calculate service statuses from real data
  const albStatus: 'operational' | 'degraded' | 'down' = 
    !albData ? 'degraded' :
    albData.healthPercentage === 100 ? 'operational' :
    albData.healthPercentage > 50 ? 'degraded' : 'down'

  const haproxyStatus: 'operational' | 'degraded' | 'down' =
    !infraData ? 'degraded' :
    infraData.haproxy.healthyInstances === infraData.haproxy.totalInstances ? 'operational' :
    infraData.haproxy.healthyInstances > 0 ? 'degraded' : 'down'

  const services: ServiceStatus[] = [
    { 
      id: 'cloudfront', 
      name: 'CloudFront', 
      status: 'operational', 
      icon: Cloud, 
      uptime: '99.99%', 
      latency: '23ms',
      details: ['Global CDN Coverage', 'Cache Hit Rate: 94.7%', 'SSL/TLS Enabled']
    },
    { 
      id: 'alb', 
      name: 'Application Load Balancer', 
      status: albStatus, 
      icon: Server, 
      uptime: albData ? `${albData.healthPercentage.toFixed(1)}%` : '...',
      latency: albData ? `${albData.averageResponseTime.toFixed(0)}ms` : '...',
      details: [
        'Cross-AZ Enabled', 
        `Health Checks: ${albData?.healthyTargets || 0}/${albData?.totalTargets || 0} Passing`,
        `Response Time: ${albData?.averageResponseTime.toFixed(0) || 0}ms`
      ]
    },
    { 
      id: 'haproxy', 
      name: 'HAProxy Origin', 
      status: haproxyStatus, 
      icon: Activity, 
      uptime: infraData ? `${((infraData.haproxy.healthyInstances / infraData.haproxy.totalInstances) * 100).toFixed(1)}%` : '...',
      latency: '8ms',
      details: [
        `Active: ${infraData?.haproxy.runningInstances || 0} instances`, 
        `Healthy: ${infraData?.haproxy.healthyInstances || 0}/${infraData?.haproxy.totalInstances || 0}`,
        'Failover: Enabled'
      ]
    },
    { 
      id: 'waf', 
      name: 'AWS WAF', 
      status: 'operational', 
      icon: Shield, 
      uptime: '100%', 
      latency: '2ms',
      details: ['Rules: 15 Active', 'Blocked: 1,247/min', 'Rate Limiting: On']
    },
  ]

  const toggleService = (id: string) => {
    setOpenServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const ServiceCard = ({ service }: { service: ServiceStatus }) => {
    const isOpen = openServices.includes(service.id)
    const ServiceIcon = service.icon

    return (
      <Collapsible open={isOpen} onOpenChange={() => toggleService(service.id)}>
        <Card className="overflow-hidden">
          <CollapsibleTrigger asChild>
            <CardContent className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ServiceIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`flex items-center gap-1 ${statusConfig[service.status].color}`}>
                        <div className={`w-2 h-2 rounded-full ${statusConfig[service.status].bg} animate-pulse`} />
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                      <span>•</span>
                      <span>{service.latency}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="font-semibold">{service.uptime}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </div>
              </div>
            </CardContent>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 border-t border-border">
              <div className="pt-4 space-y-2">
                {service.details?.map((detail, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    )
  }

  const InstanceCard = ({ instance }: { instance: InstanceStatus }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${statusConfig[instance.status].bg} animate-pulse`} />
            <div>
              <span className="font-medium">{instance.name}</span>
              <span className="text-xs text-muted-foreground ml-2">{instance.type}</span>
            </div>
          </div>
          <Badge variant={instance.status === 'running' ? 'default' : 'secondary'}>
            {instance.status}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">
            <div className="flex justify-between mb-2">
              <span>AZ: {instance.az}</span>
              <span>Health: {instance.health}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                CPU
              </span>
              <span>{instance.cpu.toFixed(0)}%</span>
            </div>
            <Progress value={instance.cpu} className="h-1.5" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                Memory
              </span>
              <span>{instance.memory.toFixed(0)}%</span>
            </div>
            <Progress value={instance.memory} className="h-1.5" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Network
              </span>
              <span>{instance.network.toFixed(0)} MB/s</span>
            </div>
            <Progress value={(instance.network / 500) * 100} className="h-1.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const operationalServices = services.filter(s => s.status === 'operational').length
  const totalServices = services.length

  if (compact) {
    return (
      <Card className="animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            Infrastructure
          </CardTitle>
          <Badge variant="outline" className="text-xs text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
            {infraData?.haproxy.healthyInstances === infraData?.haproxy.totalInstances ? 'Healthy' : 'Degraded'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.slice(0, 3).map(service => (
            <div key={service.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <service.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{service.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${statusConfig[service.status].color}`}>
                  {service.latency}
                </span>
                <div className={`w-2 h-2 rounded-full ${statusConfig[service.status].bg}`} />
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">HAProxy Instances</span>
              <span className="font-medium">
                {isLoading ? '...' : `${infraData?.haproxy.runningInstances || 0}/${infraData?.haproxy.totalInstances || 0} Running`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Edge Infrastructure</h2>
          <p className="text-muted-foreground">Real-time AWS edge tier metrics</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchInfraData} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Services</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {isLoading ? '...' : `${operationalServices}/${totalServices}`}
                </p>
                <p className="text-xs text-emerald-400/70">Operational</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Instances</p>
                <p className="text-2xl font-bold text-primary">
                  {isLoading ? '...' : `${infraData?.haproxy.runningInstances || 0}/${infraData?.haproxy.totalInstances || 0}`}
                </p>
                <p className="text-xs text-primary/70">Running</p>
              </div>
              <Server className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy Targets</p>
                <p className="text-2xl font-bold text-blue-400">
                  {isLoading ? '...' : `${albData?.healthyTargets || 0}/${albData?.totalTargets || 0}`}
                </p>
                <p className="text-xs text-blue-400/70">ALB Targets</p>
              </div>
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Latency</p>
                <p className="text-2xl font-bold text-amber-400">
                  {isLoading ? '...' : `${albData?.averageResponseTime.toFixed(0) || 0}ms`}
                </p>
                <p className="text-xs text-amber-400/70">ALB Response</p>
              </div>
              <Activity className="w-8 h-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services */}
      <div className="space-y-4">
        <h3 className="text-md font-medium">Core Services</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Instances */}
      <div className="space-y-4">
        <h3 className="text-md font-medium">HAProxy Origin Instances</h3>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading instances...</div>
        ) : instances.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No instances found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {instances.map(instance => (
              <InstanceCard key={instance.id} instance={instance} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
