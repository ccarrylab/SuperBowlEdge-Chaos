import { useState, useEffect } from 'react'
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
import { PublicChaosDemo } from './sections/PublicChaosDemo'
import { Footer } from './components/Footer'

export type ViewType = 'overview' | 'scoreboard' | 'cdn' | 'chaos' | 'infrastructure' | 'security' | 'stream' | 'cost' | 'try'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('overview')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Sync URL hash with state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '') || 'overview'
      if (['overview', 'scoreboard', 'cdn', 'chaos', 'infrastructure', 'security', 'stream', 'cost', 'try'].includes(hash)) {
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
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <div className="p-6">
          {currentView === 'overview' && <Overview />}
          {currentView === 'scoreboard' && <Scoreboard />}
          {currentView === 'cdn' && <CDNMetrics />}
          {currentView === 'chaos' && <ChaosExperiments />}
          {currentView === 'infrastructure' && <EdgeInfrastructure />}
          {currentView === 'security' && <SecurityMonitor />}
          {currentView === 'stream' && <LiveStream />}
          {currentView === 'cost' && <CostAnalysis />}
          {currentView === 'architecture' && <Architecture />}
          {currentView === 'try' && <PublicChaosDemo />}
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default App