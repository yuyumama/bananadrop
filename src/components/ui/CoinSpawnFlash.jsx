import { useState } from 'react';

function CoinSpawnFlash({ flash }) {
  // シュワっと弾ける小さな黄金の星屑（放射状に広がる）
  const [particles] = useState(() =>
    Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 360) / 12 + (Math.random() * 20 - 10);
      const dist = 60 + Math.random() * 50;
      return {
        id: i,
        tx: Math.cos((angle * Math.PI) / 180) * dist,
        ty: Math.sin((angle * Math.PI) / 180) * dist,
        size: 5 + Math.random() * 4,
        delay: Math.random() * 0.2,
      };
    }),
  );

  return (
    <>
      {/* ぽわっと広がるメインの輝き */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0, // スポーン位置 (上部)
          width: 180,
          height: 180,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(135, 140, 150, 0.7) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 19,
          transform: 'translate(-50%, -50%)',
          animation:
            'coinPopGlow 1.2s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
        }}
      />

      {/* キラッと光って回る四芒星または十字のスパークル */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 140,
          height: 140,
          background:
            'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255, 255, 255, 1) 4deg, transparent 8deg, transparent 82deg, rgba(255, 255, 255, 1) 86deg, transparent 90deg, transparent 172deg, rgba(255, 255, 255, 1) 176deg, transparent 180deg, transparent 262deg, rgba(255, 255, 255, 1) 266deg, transparent 270deg, transparent 360deg)',
          pointerEvents: 'none',
          zIndex: 22,
          transform: 'translate(-50%, -50%)',
          animation:
            'coinSparkleSpin 1.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        }}
      />

      {/* サッと広がる小さなリング */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 70,
          height: 70,
          borderRadius: '50%',
          border: '3px solid rgba(170, 175, 185, 0.8)',
          pointerEvents: 'none',
          zIndex: 20,
          transform: 'translate(-50%, -50%)',
          animation: 'coinRingExpand 1.0s ease-out forwards',
        }}
      />

      {/* プチプチ弾ける小さな光の粉 */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: flash.x,
            top: 0,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `rgba(255, 255, 255, 1)`,
            boxShadow: `0 0 ${p.size}px rgba(110, 115, 125, 0.9)`,
            pointerEvents: 'none',
            zIndex: 23,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animation: `coinMiniBurst 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) ${p.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </>
  );
}

export default CoinSpawnFlash;
