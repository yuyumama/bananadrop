import { useState } from 'react';

const ITEM_COLORS = {
  banana_nui: {
    main: '255, 185, 80',
    light: '255, 245, 200',
    core: '255, 140, 0',
  },
  banana_magic: {
    main: '200, 140, 255',
    light: '250, 235, 255',
    core: '150, 80, 255',
  },
  banana_blackhole: {
    main: '130, 180, 255',
    light: '230, 245, 255',
    core: '80, 120, 255',
  },
  banana_onekind: {
    main: '255, 120, 140',
    light: '255, 230, 235',
    core: '255, 60, 90',
  },
};

const DEFAULT_COLOR = {
  main: '240, 210, 130',
  light: '255, 250, 230',
  core: '220, 160, 60',
};

function SpawnFlash({ flash }) {
  const color = ITEM_COLORS[flash.itemId] ?? DEFAULT_COLOR;
  const { main, light, core } = color;

  // 上品ながらも派手に広がる多めのパーティクル
  const [particles] = useState(() =>
    Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      ox: (Math.random() - 0.5) * 80,
      oy: Math.random() * 80 + 20,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 0.2,
      sway: (Math.random() - 0.5) * 35,
      duration: 1.0 + Math.random() * 0.5,
    })),
  );

  return (
    <>
      {/* より明るい背景の灯り */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `radial-gradient(circle at 50% 20%, rgba(${main},0.3) 0%, transparent 75%)`,
          pointerEvents: 'none',
          zIndex: 19,
          animation:
            'elegantFade 1.0s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        }}
      />
      {/* より太く輝く光の線 */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 6, // 中心部を少し太めにして色を出す
          height: '100%',
          background: `linear-gradient(to bottom, rgba(${core},1) 0%, rgba(${main},0.9) 20%, rgba(${light},0.4) 60%, transparent)`,
          pointerEvents: 'none',
          zIndex: 22,
          animation:
            'elegantFlareVertical 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        }}
      />
      {/* 繊細な後光 (縦ラインのぼかし) */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 40,
          height: '100%',
          background: `linear-gradient(to bottom, rgba(${main},0.6) 0%, transparent 60%)`,
          filter: 'blur(8px)',
          pointerEvents: 'none',
          zIndex: 21,
          transform: 'translateX(-50%)',
          animation:
            'elegantFade 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        }}
      />
      {/* スポーン元（上部）の強烈でエレガントな横閃光 */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 500,
          height: 8,
          background: `radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(${light},0.8) 20%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 23,
          transform: 'translate(-50%, -50%)',
          animation:
            'elegantFlareHorizontal 1.0s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        }}
      />
      {/* 確かな存在感を示す強烈な出現コア */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: 0,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(${light},0.9) 30%, rgba(${core},0.6) 60%, transparent 80%)`,
          pointerEvents: 'none',
          zIndex: 24,
          transform: 'translate(-50%, -50%)',
          animation:
            'elegantCore 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        }}
      />
      {/* 大きくふんわりとした中心の灯り */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: -100,
          width: 300, // 大きく
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${core},0.95) 0%, rgba(${main},0.7) 20%, rgba(${light},0.3) 50%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 20,
          transform: 'translateX(-50%)',
          animation:
            'elegantGlow 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        }}
      />
      {/* スラリと広がるリング */}
      <div
        style={{
          position: 'fixed',
          left: flash.x,
          top: -40,
          width: 100, // 大きく
          height: 100,
          borderRadius: '50%',
          border: `2px solid rgba(${light},1)`, // くっきり
          boxShadow: `0 0 20px rgba(${main},0.8), inset 0 0 10px rgba(${main},0.4)`, // 輝きを強く
          pointerEvents: 'none',
          zIndex: 20,
          transform: 'translateX(-50%)',
          animation:
            'elegantRing 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        }}
      />
      {/* 優雅に派手に舞うパーティクル */}
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
            background: `rgba(255, 255, 255, 1)`,
            boxShadow: `0 0 ${p.size * 2}px rgba(${light}, 1), 0 0 ${p.size * 4}px rgba(${main}, 0.8)`,
            pointerEvents: 'none',
            zIndex: 23,
            '--ox': `${p.ox}px`,
            '--oy': `${p.oy}px`,
            '--sway': `${p.sway}px`,
            animation: `elegantRise ${p.duration}s cubic-bezier(0.4, 0, 0.2, 1) ${p.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </>
  );
}

export default SpawnFlash;
