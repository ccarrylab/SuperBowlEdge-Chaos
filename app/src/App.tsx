import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from './sections/Sidebar'
import { Overview } from './sections/Overview'
import { Scoreboard } from './sections/Scoreboard'
import { CDNMetrics } from './sections/CDNMetrics'
import { ChaosExperiments } from './sections/ChaosExperiments'
import { EdgeInfrastructure } from './sections/EdgeInfrastructure'
import { SecurityMonitor } from './sections/SecurityMonitor'
import { LiveStream } from './sections/LiveStream'
import { CostAnalysis } from './sections/CostAnalysis'
import { Architecture } from './sections/Architecture'
import TryChaos from './sections/TryChaos'
import { Footer } from './components/Footer'

export type ViewType = 'overview' | 'scoreboard' | 'cdn' | 'chaos' | 'infrastructure' | 'security' | 'stream' | 'cost' | 'try' | 'architecture'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('overview')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Detect if we're on mobile
  const isMobile = () => window.innerWidth < 1024

  // Sync URL hash with state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') || 'overview'
      if (['overview', 'scoreboard', 'cdn', 'chaos', 'infrastructure', 'security', 'stream', 'cost', 'try', 'architecture'].includes(hash)) {
        setCurrentView(hash as ViewType)
      }
    }
    // Set initial view from URL
    handleHashChange()
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Update URL when view changes
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
    window.location.hash = `#/${view}`
    
    // Auto-close mobile sidebar after navigation
    if (isMobile()) {
      setIsMobileSidebarOpen(false)
    }
  }

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border z-40 flex items-center px-4">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 hover:bg-accent/50 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileSidebarOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
        
        <div className="flex items-center gap-3 ml-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-amber-500 to-red-500 flex items-center justify-center animate-pulse-glow">
            <span className="text-xl">🏆</span>
          </div>
          <div>
            <span className="font-bold text-lg gradient-text">SuperBowl</span>
            <span className="text-xs text-muted-foreground block -mt-1">Edge Chaos</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-500">LIVE</span>
        </div>
      </div>

      {/* Backdrop Overlay - Mobile Only */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={`
        fixed lg:static
        inset-y-0 left-0
        transform transition-transform duration-300 ease-in-out
        z-50
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Main Content */}
      <main className={`
        transition-all duration-300
        pt-16 lg:pt-0
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="p-4 sm:p-6">
          {currentView === 'overview' && <Overview />}
          {currentView === 'scoreboard' && <Scoreboard />}
          {currentView === 'cdn' && <CDNMetrics />}
          {currentView === 'chaos' && <ChaosExperiments />}
          {currentView === 'infrastructure' && <EdgeInfrastructure />}
          {currentView === 'security' && <SecurityMonitor />}
          {currentView === 'stream' && <LiveStream />}
          {currentView === 'cost' && <CostAnalysis />}
          {currentView === 'architecture' && <Architecture />}
          {currentView === 'try' && <TryChaos />}
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default App
