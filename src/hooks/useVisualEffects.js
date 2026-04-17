import { useState, useCallback } from 'react';

const MAX_CLICK_EFFECTS = 5;
const MAX_SPAWN_FLASHES = 3;
const MAX_FEVER_BURSTS = 3;

const CLICK_RIPPLE_DURATION_MS = 600;
const FEVER_BURST_DURATION_MS = 1100;
const SPAWN_FLASH_DURATION_MS = 1200;
const COIN_FLASH_DURATION_MS = 1800;
const FLOATING_COIN_DURATION_MS = 1200;

let _effectId = 0;

const capTail = (list, max) =>
  list.length > max ? list.slice(list.length - max) : list;

export default function useVisualEffects() {
  const [clickEffects, setClickEffects] = useState([]);
  const [feverBursts, setFeverBursts] = useState([]);
  const [spawnFlashes, setSpawnFlashes] = useState([]);
  const [coinFlashes, setCoinFlashes] = useState([]);
  const [floatingCoins, setFloatingCoins] = useState([]);

  const triggerClickRipple = useCallback((clientX, clientY) => {
    const id = ++_effectId;
    setClickEffects((prev) =>
      capTail([...prev, { id, x: clientX, y: clientY }], MAX_CLICK_EFFECTS),
    );
    setTimeout(
      () => setClickEffects((prev) => prev.filter((ef) => ef.id !== id)),
      CLICK_RIPPLE_DURATION_MS,
    );
  }, []);

  const triggerSpawnFlash = useCallback((x, itemId) => {
    const id = ++_effectId;
    setSpawnFlashes((prev) =>
      capTail([...prev, { id, x, itemId }], MAX_SPAWN_FLASHES),
    );
    setTimeout(
      () => setSpawnFlashes((prev) => prev.filter((f) => f.id !== id)),
      SPAWN_FLASH_DURATION_MS,
    );
  }, []);

  const triggerFeverBurst = useCallback((x, y, itemId) => {
    const id = ++_effectId;
    setFeverBursts((prev) =>
      capTail([...prev, { id, x, y, itemId }], MAX_FEVER_BURSTS),
    );
    setTimeout(
      () => setFeverBursts((prev) => prev.filter((b) => b.id !== id)),
      FEVER_BURST_DURATION_MS,
    );
  }, []);

  const spawnCoinFlashes = useCallback((xs) => {
    if (!xs.length) return;
    const entries = xs.map((x) => ({ id: ++_effectId, x }));
    setCoinFlashes((prev) => [...prev, ...entries]);
    const idSet = new Set(entries.map((e) => e.id));
    setTimeout(
      () => setCoinFlashes((prev) => prev.filter((f) => !idSet.has(f.id))),
      COIN_FLASH_DURATION_MS,
    );
  }, []);

  const spawnFloatingCoin = useCallback((x) => {
    const id = ++_effectId;
    const clampedX = Math.max(
      60,
      Math.min(window.innerWidth - 60, x ?? window.innerWidth / 2),
    );
    setFloatingCoins((prev) => [...prev, { id, x: clampedX }]);
    setTimeout(
      () => setFloatingCoins((prev) => prev.filter((c) => c.id !== id)),
      FLOATING_COIN_DURATION_MS,
    );
  }, []);

  return {
    clickEffects,
    feverBursts,
    spawnFlashes,
    coinFlashes,
    floatingCoins,
    triggerClickRipple,
    triggerSpawnFlash,
    triggerFeverBurst,
    spawnCoinFlashes,
    spawnFloatingCoin,
  };
}
