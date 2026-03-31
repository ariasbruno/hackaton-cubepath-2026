import React, { useEffect, useState, useRef } from 'react';

interface TimerProps {
  /** Duration in seconds */
  duration: number;
  /** Optional: externally synced seconds left (from WS TIMER_TICK) */
  secondsLeft?: number;
  onExpire?: () => void;
  color?: string;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  secondsLeft: externalSeconds,
  onExpire,
  color = 'bg-white',
  className = '',
}) => {
  const [seconds, setSeconds] = useState(externalSeconds ?? duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (externalSeconds !== undefined) {
      setSeconds(externalSeconds);
    }
  }, [externalSeconds]);

  useEffect(() => {
    if (externalSeconds !== undefined) return; // externally controlled

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration, externalSeconds, onExpire]);

  const percentage = (seconds / duration) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-linear`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
