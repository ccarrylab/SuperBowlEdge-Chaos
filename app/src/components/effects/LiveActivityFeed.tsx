import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Activity, Zap, Shield, AlertCircle } from 'lucide-react';

interface ActivityEvent {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  timestamp: Date;
}

export function LiveActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    // Simulate live events
    const interval = setInterval(() => {
      const eventTypes = [
        { type: 'success' as const, messages: ['Health check passed', 'Chaos experiment completed', 'Auto-scaling triggered'] },
        { type: 'info' as const, messages: ['Metrics updated', 'Cache invalidated', 'New instance launched'] },
        { type: 'warning' as const, messages: ['High latency detected', 'CPU spike detected', 'Memory usage high'] },
      ];

      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)];

      const newEvent: ActivityEvent = {
        id: Date.now().toString(),
        type: randomType.type,
        message: randomMessage,
        timestamp: new Date(),
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Shield className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <Zap className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="h-96 overflow-hidden rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur-sm p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        Live Activity
      </h3>
      <div className="space-y-2">
        <AnimatePresence>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
            >
              {getIcon(event.type)}
              <div className="flex-1">
                <p className="text-sm">{event.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {event.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
