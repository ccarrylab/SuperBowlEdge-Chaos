import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Square, 
  RotateCcw, 
  CheckCircle, 
  Clock,
  Activity,
  Cloud,
  Server,
  Shield,
  AlertTriangle,
  TrendingUp,
  Flame,
  Globe,
  Cpu,
  Wifi,
  XCircle,
  Loader2,
  RefreshCw,
  Heart
} from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'

const API_BASE = 'https://pa86b0v1ve.execute-api.us-east-1.amazonaws.com/prod'

interface ExperimentTemplate {
  id: string
  name: string
  description: string
  type: string
  impact: 'low' | 'medium' | 'high'
  duration: string
  icon: any
}

interface LiveStatus {
  overallStatus: 'healthy' | 'chaos-active' | 'recovering'
  runningExperiments: Array<{
    id: string
    status: string
    templateId: string
    startTime: string
  }>
  infrastructure: {
    asg: { healthy: number; total: number; desired: number }
    alb: { healthyTargets: number; totalTargets: number }
  }
}

interface ExperimentRun {
  id: string
  experimentName: string
  startTime: string
  duration: string
  result: 'success' | 'failure'
  impact: string
}

const EXPERIMENT_TEMPLATES: ExperimentTemplate[] = [
  {
    id: 'cpu-stress',
    name: 'CPU Stress Test',
    description: 'Stress CPU to 80% on one HAProxy instance to test auto-scaling triggers',
    type: 'cpu-stress',
    impact: 'medium',
    duration: '5 min',
    icon: Cpu
  },
  {
    id: 'ec2-stop',
    name: 'Instance Termination',
    description: 'Stop 50% of HAProxy instances to test failover and ASG recovery',
    type: 'ec2-stop',
    impact: 'high',
    duration: '5 min',
    icon: Server
  },
  {
    id: 'network-latency',
    name: 'Network Latency Injection',
    description: 'Inject 200ms latency on all HAProxy instances to test timeout handling',
    type: 'network-latency',
    impact: 'medium',
    duration: '5 min',
    icon: Wifi
  },
  {
    id: 'alb-blackout',
    name: 'Complete Origin Blackout',
    description: 'Stop ALL HAProxy instances to simulate complete origin failure',
    type: 'alb-blackout',
    impact: 'high',
    duration: '3 min',
    icon: Cloud
  }
]

const impactColors = {
  low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  high: 'text-red-400 bg-red-500/10 border-red-500/20',
}

const statusColors = {
  healthy: 'text-emerald-400',
  'chaos-active': 'text-red-400',
  recovering: 'text-amber-400'
}

export function ChaosExperiments() {
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null)
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null)
  const [experimentId, setExperimentId] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null)
  const [experimentHistory, setExperimentHistory] = useState<any[]>([])
  const [pollCount, setPollCount] = useState(0)

  const fetchLiveStatus = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/chaos/live`)
      if (response.ok) {
        const data = await response.json()
        setLiveStatus(data)
        
        if (data.runningExperiments?.length > 0) {
          const running = data.runningExperiments[0]
          setExperimentId(running.id)
          const template = EXPERIMENT_TEMPLATES.find(t => 
            running.templateId?.toLowerCase().includes(t.type.replace('-', ''))
          )
          if (template) {
            setActiveExperiment(template.id)
          }
        } else if (activeExperiment && !isStarting) {
          setActiveExperiment(null)
          setExperimentId(null)
        }
      }
    } catch (err) {
      console.error('Failed to fetch live status:', err)
    }
  }, [activeExperiment, isStarting])

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/chaos/experiments`)
      if (response.ok) {
        const data = await response.json()
        setExperimentHistory(data.experiments || [])
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }, [])

  useEffect(() => {
    fetchLiveStatus()
    fetchHistory()
    
    const interval = setInterval(() => {
      fetchLiveStatus()
      setPollCount(c => c + 1)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [fetchLiveStatus, fetchHistory])

  const startExperiment = async (templateId: string) => {
    setIsStarting(true)
    setError(null)
    setShowConfirmDialog(null)
    
    try {
      const response = await fetch(`${API_BASE}/chaos/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experimentType: templateId })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start experiment')
      }
      
      setActiveExperiment(templateId)
      setExperimentId(data.experimentId)
      
      setTimeout(fetchLiveStatus, 1000)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsStarting(false)
    }
  }

  const stopExperiment = async () => {
    if (!experimentId) return
    
    setIsStopping(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE}/chaos/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experimentId })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to stop experiment')
      }
      
      setActiveExperiment(null)
      setExperimentId(null)
      
      setTimeout(fetchLiveStatus, 1000)
      setTimeout(fetchHistory, 2000)
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsStopping(false)
    }
  }

  const ExperimentCard = ({ template }: { template: ExperimentTemplate }) => {
    const Icon = template.icon
    const isActive = activeExperiment === template.id
    const isAnyRunning = !!activeExperiment || (liveStatus?.runningExperiments?.length ?? 0) > 0

    return (
      <Card className={`overflow-hidden transition-all duration-300 ${isActive ? 'border-red-500 ring-2 ring-red-500/20' : ''}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${impactColors[template.impact]} ${isActive ? 'animate-pulse' : ''}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  {template.name}
                  {isActive && (
                    <Badge variant="destructive" className="animate-pulse">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      RUNNING
                    </Badge>
                  )}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {template.duration}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${impactColors[template.impact]}`}>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {template.impact} impact
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isActive ? (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={stopExperiment}
                  disabled={isStopping}
                >
                  {isStopping ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Square className="w-4 h-4 mr-1" />
                  )}
                  Stop
                </Button>
              ) : (
                <Dialog open={showConfirmDialog === template.id} onOpenChange={(open) => setShowConfirmDialog(open ? template.id : null)}>
                  <DialogTrigger asChild>
                    <Button size="sm" disabled={isAnyRunning || isStarting}>
                      {isStarting && showConfirmDialog === template.id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-1" />
                      )}
                      Run
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-red-500" />
                        Run Chaos Experiment
                      </DialogTitle>
                      <DialogDescription>
                        You are about to run <strong>{template.name}</strong> using AWS Fault Injection Simulator (FIS).
                        This will affect your <strong>live production infrastructure</strong>.
                      </DialogDescription>
                    </DialogHeader>
                    <Alert className={impactColors[template.impact]}>
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        <strong>{template.impact.toUpperCase()} IMPACT</strong> - {template.description}
                        <br />
                        <span className="text-xs mt-1 block">Duration: {template.duration}</span>
                      </AlertDescription>
                    </Alert>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowConfirmDialog(null)}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => startExperiment(template.id)}
                        disabled={isStarting}
                      >
                        {isStarting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Flame className="w-4 h-4 mr-2" />
                        )}
                        Start Chaos
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {isActive && experimentId && (
            <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" />
                  Experiment in progress...
                </span>
                <span className="text-muted-foreground font-mono text-xs">
                  ID: {experimentId}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const InfrastructureHealth = () => {
    if (!liveStatus) return null
    
    const { asg, alb } = liveStatus.infrastructure
    const isHealthy = asg.healthy === asg.total && alb.healthyTargets === alb.totalTargets
    const isRecovering = liveStatus.overallStatus === 'recovering'
    
    return (
      <Card className={`${isRecovering ? 'border-amber-500/50' : isHealthy ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart className={`w-4 h-4 ${isHealthy ? 'text-emerald-400' : isRecovering ? 'text-amber-400 animate-pulse' : 'text-red-400 animate-pulse'}`} />
              Infrastructure Health
            </span>
            <Badge variant="outline" className={statusColors[liveStatus.overallStatus]}>
              {liveStatus.overallStatus === 'healthy' && 'Healthy'}
              {liveStatus.overallStatus === 'chaos-active' && 'Chaos Active'}
              {liveStatus.overallStatus === 'recovering' && 'Recovering...'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">ASG Instances</p>
              <p className={`text-2xl font-bold ${asg.healthy === asg.total ? 'text-emerald-400' : 'text-amber-400'}`}>
                {asg.healthy}/{asg.total}
              </p>
              <Progress 
                value={(asg.healthy / Math.max(asg.total, 1)) * 100} 
                className="h-1 mt-1"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ALB Targets</p>
              <p className={`text-2xl font-bold ${alb.healthyTargets === alb.totalTargets ? 'text-emerald-400' : 'text-amber-400'}`}>
                {alb.healthyTargets}/{alb.totalTargets}
              </p>
              <Progress 
                value={(alb.healthyTargets / Math.max(alb.totalTargets, 1)) * 100} 
                className="h-1 mt-1"
              />
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
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Chaos Engineering
            <Badge variant="outline" className="text-xs font-normal">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
              Live
            </Badge>
          </h2>
          <p className="text-muted-foreground">AWS FIS experiments for edge resilience - Real infrastructure testing</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { fetchLiveStatus(); fetchHistory(); }}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <XCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InfrastructureHealth />
        
        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Experiments</p>
                <p className="text-2xl font-bold text-emerald-400">{experimentHistory.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-primary">
                  {experimentHistory.length > 0 
                    ? Math.round((experimentHistory.filter(e => e.status === 'completed').length / experimentHistory.length) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className={`bg-gradient-to-br ${activeExperiment ? 'from-red-500/20 to-red-500/5 border-red-500/40' : 'from-red-500/10 to-transparent border-red-500/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Chaos</p>
                <p className={`text-2xl font-bold ${activeExperiment ? 'text-red-400 animate-pulse' : 'text-red-400'}`}>
                  {liveStatus?.runningExperiments?.length || 0}
                </p>
              </div>
              <Flame className={`w-8 h-8 text-red-400 ${activeExperiment ? 'animate-pulse' : ''}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="experiments" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="experiments">Run Experiments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="experiments" className="space-y-4">
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              These experiments run against <strong>real AWS infrastructure</strong>. 
              The system is designed to auto-recover, but use with caution.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 gap-4">
            {EXPERIMENT_TEMPLATES.map(template => (
              <ExperimentCard key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Experiment Runs</CardTitle>
              <CardDescription>Actual AWS FIS experiments from your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experimentHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No experiments run yet. Start your first chaos experiment above!
                  </p>
                ) : (
                  experimentHistory.map((run) => (
                    <div key={run.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          run.status === 'completed' ? 'bg-emerald-500/20' : 
                          run.status === 'failed' ? 'bg-red-500/20' : 
                          run.status === 'running' ? 'bg-amber-500/20' : 'bg-gray-500/20'
                        }`}>
                          {run.status === 'completed' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                          {run.status === 'failed' && <XCircle className="w-5 h-5 text-red-400" />}
                          {run.status === 'running' && <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />}
                          {!['completed', 'failed', 'running'].includes(run.status) && <Clock className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div>
                          <p className="font-medium font-mono text-sm">{run.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(run.creationTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={run.status === 'completed' ? 'default' : run.status === 'failed' ? 'destructive' : 'secondary'}>
                          {run.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
