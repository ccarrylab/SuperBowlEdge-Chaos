import { useEffect, useState } from 'react'
import { Eye, TrendingUp, Users } from 'lucide-react'

const API_BASE = 'https://pa86b0v1ve.execute-api.us-east-1.amazonaws.com/prod'

interface VisitorStats {
  total: number
  today: number
  thisWeek: number
  uniqueToday: number
}

export function VisitorCounter() {
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/metrics/visitor`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ 
        page: window.location.hash || '#/overview', 
        referrer: document.referrer 
      }) 
    }).catch(console.error)
    
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/metrics/visitors`)
        if (response.ok) setStats(await response.json())
      } catch (error) {
        console.error('Failed to fetch visitor stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-wrap gap-6 justify-center text-sm">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4 text-blue-400" />
        <span className="text-gray-400">
          <span className="text-white font-semibold">
            {isLoading ? '...' : (stats?.total || 0).toLocaleString()}
          </span> total visits
        </span>
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <span className="text-gray-400">
          <span className="text-white font-semibold">
            {isLoading ? '...' : stats?.today || 0}
          </span> today
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-purple-400" />
        <span className="text-gray-400">
          <span className="text-white font-semibold">
            {isLoading ? '...' : stats?.uniqueToday || 0}
          </span> unique today
        </span>
      </div>
    </div>
  )
}