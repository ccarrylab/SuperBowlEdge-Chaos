import { Map, 
  Home,
  Trophy, 
  Globe, 
  Zap, 
  Server, 
  Shield, 
  Video, 
  DollarSign,
  Radio,
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
  { id: 'cost', label: 'Cost Analysis', icon: DollarSign },
  { id: 'architecture', label: 'Architecture', icon: Map }
]

export function Sidebar({ currentView, onViewChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header - Hidden on mobile (shown in mobile header instead) */}
        <div className="hidden lg:flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
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

        {/* Live Indicator - Hidden on mobile */}
        {!isCollapsed && (
          <div className="hidden lg:flex justify-center py-2 border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <Radio className="w-3 h-3 text-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-500">LIVE</span>
            </div>
          </div>
        )}

        {/* Mobile Top Spacing */}
        <div className="lg:hidden h-4"></div>

        {/* Navigation */}
        <nav className="p-2 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {navItems.map((item) => (
            isCollapsed ? (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={`w-full p-3 rounded-lg transition-all flex items-center justify-center min-h-[44px] ${
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
                className={`w-full p-3 rounded-lg transition-all flex items-center gap-3 min-h-[44px] ${
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar">
          {!isCollapsed ? (
            <div className="space-y-3">
              {/* Profile Card - Added for mobile */}
              <div className="bg-accent/30 rounded-lg p-3 space-y-2">
                <div className="text-sm font-semibold text-foreground">Cohen Carryl</div>
                <div className="text-xs text-muted-foreground">Senior DevOps Engineer</div>
                <a
                  href="https://www.linkedin.com/in/cohen-h-carryl-3538b614/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-xs font-medium transition-colors min-h-[44px]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
              
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
