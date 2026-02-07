import { Bell, Settings, Search, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRealTimeMetrics } from '@/hooks/useRealTimeMetrics';
import { formatDistanceToNow } from 'date-fns';

export function Header() {
  const { lastUpdate, loading, refresh } = useRealTimeMetrics();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search metrics..."
              className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none w-64"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
            ● LIVE
          </Badge>
          
          <div className="text-sm text-gray-400">
            Updated {lastUpdate ? formatDistanceToNow(lastUpdate, { addSuffix: true }) : 'never'}
          </div>

          <button
            onClick={refresh}
            disabled={loading}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
