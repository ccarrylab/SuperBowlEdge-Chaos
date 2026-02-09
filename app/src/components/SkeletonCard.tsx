import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface SkeletonCardProps {
  variant?: 'default' | 'metric' | 'chart' | 'list'
}

export function SkeletonCard({ variant = 'default' }: SkeletonCardProps) {
  if (variant === 'metric') {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-700 rounded w-32"></div>
            </div>
            <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-3 bg-gray-700 rounded w-full"></div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'chart') {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-64"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-end justify-between h-32">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-700 rounded-t w-8"
                  style={{ height: `${Math.random() * 100 + 20}px` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-700 rounded w-6"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'list') {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-64"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-64"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
      </CardContent>
    </Card>
  )
}

// Grid of skeleton cards
export function SkeletonGrid({ count = 4, variant = 'metric' }: { count?: number; variant?: 'metric' | 'chart' | 'list' | 'default' }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  )
}
