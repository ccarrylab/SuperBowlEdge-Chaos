import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface NeonCardProps {
  children: ReactNode;
  glowColor?: string;
  className?: string;
}

export function NeonCard({ children, glowColor = 'blue', className = '' }: NeonCardProps) {
  const glowColors = {
    blue: 'shadow-blue-500/50 hover:shadow-blue-500/80',
    green: 'shadow-green-500/50 hover:shadow-green-500/80',
    purple: 'shadow-purple-500/50 hover:shadow-purple-500/80',
    red: 'shadow-red-500/50 hover:shadow-red-500/80',
    yellow: 'shadow-yellow-500/50 hover:shadow-yellow-500/80',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`rounded-lg border border-gray-700 bg-gray-900/50 backdrop-blur-sm shadow-lg ${glowColors[glowColor as keyof typeof glowColors]} transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}
