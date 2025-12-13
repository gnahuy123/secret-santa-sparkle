import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 1 + 0.5,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}rem`,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
}
