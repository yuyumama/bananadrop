import { useEffect } from 'react';

export default function useAutoSpawn({ autoSpawnRate, spawnBanana }) {
  useEffect(() => {
    if (autoSpawnRate <= 0) return;

    const interval = setInterval(() => {
      spawnBanana(Math.random() * window.innerWidth);
    }, 1000 / autoSpawnRate);

    return () => clearInterval(interval);
  }, [autoSpawnRate, spawnBanana]);
}
