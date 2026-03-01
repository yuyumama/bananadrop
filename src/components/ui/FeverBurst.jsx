import { useState } from 'react';

const ITEM_COLORS = {
  banana_nui: {
    main: '255, 185, 80',
    light: '255, 245, 200',
    outer: '230, 140, 50',
    core: '255, 140, 0',
  },
  banana_magic: {
    main: '200, 140, 255',
    light: '250, 235, 255',
    outer: '170, 100, 220',
    core: '150, 80, 255',
  },
  banana_blackhole: {
    main: '130, 180, 255',
    light: '230, 245, 255',
    outer: '90, 140, 220',
    core: '80, 120, 255',
  },
  banana_onekind: {
    main: '255, 120, 140',
    light: '255, 230, 235',
    outer: '220, 80, 100',
    core: '255, 60, 90',
  },
};

const DEFAULT_COLOR = {
  main: '240, 210, 130',
  light: '255, 250, 230',
  outer: '210, 170, 90',
  core: '220, 160, 60',
};

function FeverBurst({ burst }) {
  const color = ITEM_COLORS[burst.itemId] ?? DEFAULT_COLOR;
  const { main, light, core } = color;

  // ティーカップに砂糖を落としたようなどこか上品な波紋と舞い散る細かい光
  // ただし、より華やかで派手に
  const [particles] = useState(() =>
    Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 360) / 24 + (Math.random() * 30 - 15);
      const dist = 60 + Math.random() * 80;
      const size = 4 + Math.random() * 6;
      const delay = Math.random() * 0.15;
      return {
        id: i,
        angle,
        tx: Math.cos((angle * Math.PI) / 180) * dist,
        ty: Math.sin((angle * Math.PI) / 180) * dist - 20,
        size,
        delay,
      };
    }),
  );

  return (
    <>
      {/* 画面全体のより明るいインパクトフラッシュ */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(ellipse at center 90%, rgba(${main},0.25) 0%, transparent 80%)`,
          pointerEvents: 'none',
          zIndex: 19,
          animation:
            'elegantFade 1.0s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        }}
      />

      {/* 中心から滲むより鮮やかで強い光 */}
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 120, // 大幅に拡大
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${core},1) 0%, rgba(${main},0.8) 20%, rgba(${light},0.4) 50%, transparent 80%)`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 22,
          animation:
            'elegantCore 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        }}
      />

      {/* 水面のような静かだがくっきりした波紋 1 */}
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 120, // 拡大
          height: 60,
          borderRadius: '50%',
          border: `2.5px solid rgba(${light},1)`, // 太く・くっきり
          boxShadow: `0 0 15px rgba(${main}, 0.8), inset 0 0 10px rgba(${main}, 0.5)`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 21,
          animation:
            'elegantRipple 1.0s cubic-bezier(0.25, 0.1, 0.2, 1) forwards',
        }}
      />

      {/* 水面のような静かな波紋 2 (少し遅れて) */}
      <div
        style={{
          position: 'fixed',
          left: burst.x,
          top: burst.y,
          width: 120, // 拡大
          height: 60,
          borderRadius: '50%',
          border: `1.5px solid rgba(${main},0.7)`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 21,
          animation:
            'elegantRipple 1.2s cubic-bezier(0.25, 0.1, 0.2, 1) 0.08s forwards',
          opacity: 0,
        }}
      />

      {/* 煌めきながらふわりと散る光の粉 */}
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
            boxShadow: `0 0 ${p.size * 2}px rgba(${light}, 1), 0 0 ${p.size * 4}px rgba(${main}, 0.8)`,
            pointerEvents: 'none',
            zIndex: 23,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animation: `elegantDrift 1.0s cubic-bezier(0.2, 0.6, 0.3, 1) ${p.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </>
  );
}

export default FeverBurst;
