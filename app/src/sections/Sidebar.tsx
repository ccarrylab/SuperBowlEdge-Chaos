import { 
  Home,
  Trophy, 
  Globe, 
  Zap, 
  Server, 
  Shield, 
  Video, 
  DollarSign,
  Radio
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { ViewType } from '@/App'

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'scoreboard', label: 'Scoreboard', icon: Trophy },
  { id: 'cdn', label: 'CDN Metrics', icon: Globe },
  { id: 'chaos', label: 'Chaos Experiments', icon: Zap },
  { id: 'infrastructure', label: 'Edge Infrastructure', icon: Server },
  { id: 'security', label: 'Security Monitor', icon: Shield },
  { id: 'stream', label: 'Live Stream', icon: Video },
  { id: 'cost', label: 'Cost Analysis', icon: DollarSign }
]

export function Sidebar({ currentView, onViewChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-amber-500 to-red-500 flex items-center justify-center animate-pulse-glow">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg gradient-text">SuperBowl</span>
                <span className="text-xs text-muted-foreground block -mt-1">Edge Chaos</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-amber-500 to-red-500 flex items-center justify-center mx-auto animate-pulse-glow">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Live Indicator */}
        {!isCollapsed && (
          <div className="flex justify-center py-2 border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <Radio className="w-3 h-3 text-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-500">LIVE</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-2 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {navItems.map((item) => (
            isCollapsed ? (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={`w-full p-3 rounded-lg transition-all flex items-center justify-center ${
                      currentView === item.id
                        ? 'bg-accent text-accent-foreground shadow-lg'
                        : 'hover:bg-accent/50 text-muted-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full p-3 rounded-lg transition-all flex items-center gap-3 ${
                  currentView === item.id
                    ? 'bg-accent text-accent-foreground shadow-lg'
                    : 'hover:bg-accent/50 text-muted-foreground'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          {!isCollapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full status-online animate-pulse" />
                <span>All Systems Operational</span>
              </div>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center">
                  <div className="w-2 h-2 rounded-full status-online animate-pulse" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>All Systems Operational</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
