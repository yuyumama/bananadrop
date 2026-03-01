import { useState } from 'react';

const ITEM_COLORS = {
  banana_nui: { main: '255,140,0', light: '255,180,50' },
  banana_magic: { main: '168,85,247', light: '192,132,252' },
  banana_blackhole: { main: '59,130,246', light: '96,165,250' },
  banana_onekind: { main: '225,29,72', light: '251,113,133' },
};

const DEFAULT_COLOR = { main: '255,215,0', light: '255,170,0' };

function SpawnFlash({ flash }) {
  const color = ITEM_COLORS[flash.itemId] ?? DEFAULT_COLOR;
  const { main, light } = color;

  // 立ち上る光のパーティクル（初回のみ）
  const [particles] = useState(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      ox: (Math.random() - 0.5) * 60,
      oy: Math.random() * 100,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.2,
    })),
  );

  return (
    <>
      {/* 画面全体のフラッシュオーバーレイ */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(circle at 50% 10%, rgba(${main},0.4) 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 19,
          animation:
            'spawnFlashOverlay 0.8s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
        }}
      />
      {/* 縦の柱の中心（強烈な光） */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 8,
          height: '100%',
          background: `linear-gradient(to bottom, rgba(255,255,255,1), rgba(${light},0.8) 20%, rgba(${main},0.2) 80%, transparent)`,
          pointerEvents: 'none',
          zIndex: 22,
          animation: 'pillarGlow 0.8s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
        }}
      />
      {/* 縦の柱の外側 */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 60,
          height: '100%',
          background: `linear-gradient(to bottom, rgba(${main},0.6), rgba(${main},0.3) 50%, transparent)`,
          pointerEvents: 'none',
          zIndex: 21,
          filter: 'blur(12px)',
          animation:
            'spawnFlashLine 1.0s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
        }}
      />
      {/* 横方向の閃光 */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0, // スポーン位置
          width: 400,
          height: 12,
          background: `radial-gradient(ellipse at center, rgba(${light},1) 0%, rgba(${main},0) 70%)`,
          pointerEvents: 'none',
          zIndex: 22,
          transform: 'translate(-50%, -50%)',
          animation:
            'horizontalFlash 0.7s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
        }}
      />
      {/* 中央強烈グロー */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: -20,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${light},1) 0%, rgba(${main},0.6) 30%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'spawnFlashGlow 1.0s ease-out forwards',
        }}
      />
      {/* リング1 */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          border: `6px solid rgba(${main},1)`,
          boxShadow: `0 0 25px rgba(${main},0.8), inset 0 0 15px rgba(${main},0.5)`,
          pointerEvents: 'none',
          zIndex: 20,
          animation:
            'spawnFlashRing 0.8s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
        }}
      />
      {/* 上るパーティクル */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: flash.x,
            top: p.oy,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `rgba(${light}, 1)`,
            boxShadow: `0 0 ${p.size * 2}px rgba(${main}, 1)`,
            pointerEvents: 'none',
            zIndex: 23,
            '--ox': `${p.ox}px`,
            '--oy': `${p.oy}px`,
            animation: `riseParticle 0.9s cubic-bezier(0.1, 0.8, 0.2, 1) ${p.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </>
  );
}

export default SpawnFlash;
