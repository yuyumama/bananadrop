import { useState } from 'react';

const ITEM_COLORS = {
  banana_nui: { main: '255,140,0', light: '255,215,0', outer: '255,107,53' },
  banana_magic: {
    main: '168,85,247',
    light: '192,132,252',
    outer: '236,72,153',
  },
  banana_blackhole: {
    main: '59,130,246',
    light: '96,165,250',
    outer: '6,182,212',
  },
  banana_onekind: {
    main: '225,29,72',
    light: '251,113,133',
    outer: '251,146,60',
  },
};

const DEFAULT_COLOR = {
  main: '255,140,0',
  light: '255,215,0',
  outer: '255,107,53',
};

function FeverBurst({ burst }) {
  const color = ITEM_COLORS[burst.itemId] ?? DEFAULT_COLOR;
  const { main, light, outer } = color;

  // 放射状に広がるパーティクルを生成（初回のみ）
  const [particles] = useState(() =>
    Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 360) / 16 + (Math.random() * 20 - 10);
      const dist = 70 + Math.random() * 90;
      const size = 6 + Math.random() * 10;
      const delay = Math.random() * 0.15;
      return {
        id: i,
        angle,
        tx: Math.cos((angle * Math.PI) / 180) * dist,
        ty: Math.sin((angle * Math.PI) / 180) * dist,
        size,
        delay,
      };
    }),
  );

  return (
    <>
      {/* 画面全体の衝撃フラッシュ */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(ellipse at center 90%, rgba(${main},0.4) 0%, transparent 80%)`,
          pointerEvents: 'none',
          zIndex: 19,
          animation:
            'impactOverlay 0.8s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
        }}
      />

      {/* 衝撃波の中心コア（強烈な白抜け） */}
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: `rgba(255, 255, 255, 1)`,
          boxShadow: `0 0 50px 20px rgba(${light},1), 0 0 100px 40px rgba(${main},0.8)`,
          pointerEvents: 'none',
          zIndex: 22,
          animation: 'impactCore 0.6s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
        }}
      />

      {/* 大きな衝撃波（塗りつぶし） */}
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${main},0.6) 0%, rgba(${outer},0.2) 70%, transparent 100%)`,
          pointerEvents: 'none',
          zIndex: 21,
          animation:
            'impactShockwave 0.8s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
        }}
      />

      {/* 鋭い横方向の光（十字の横線） */}
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 600,
          height: 16,
          background: `radial-gradient(ellipse at center, rgba(${light},1) 0%, rgba(${main},0) 70%)`,
          pointerEvents: 'none',
          zIndex: 22,
          transform: 'translate(-50%, -50%)',
          animation:
            'horizontalFlash 0.6s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
        }}
      />

      {/* 鋭い縦方向の光（十字の縦線） */}
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 16,
          height: 600,
          background: `radial-gradient(ellipse at center, rgba(${light},1) 0%, rgba(${main},0) 70%)`,
          pointerEvents: 'none',
          zIndex: 22,
          transform: 'translate(-50%, -50%)',
          animation:
            'verticalFlash 0.6s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
        }}
      />

      {/* 弾け飛ぶパーティクル */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: burst.x,
            top: burst.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `rgba(255, 255, 255, 1)`,
            boxShadow: `0 0 ${p.size * 2}px rgba(${light},1), 0 0 ${p.size * 4}px rgba(${main},0.8)`,
            pointerEvents: 'none',
            zIndex: 23,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animation: `particleBurst 0.7s cubic-bezier(0.1, 0.8, 0.2, 1) ${p.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </>
  );
}

export default FeverBurst;
