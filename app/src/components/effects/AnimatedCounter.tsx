import CountUp from 'react-countup';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 1, 
  decimals = 0,
  suffix = '',
  prefix = '',
  className = ''
}: AnimatedCounterProps) {
  return (
    <CountUp
      end={value}
      duration={duration}
      decimals={decimals}
      suffix={suffix}
      prefix={prefix}
      className={className}
      preserveValue
      useEasing
    />
  );
}
