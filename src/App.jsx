import { useState, useCallback, useRef, useEffect } from 'react'
import BananaWorld from './components/BananaWorld'

export const BANANA_TIERS = [
  { tier: 1, name: '普通バナナ', score: 1,   texture: 'banana_green.png' },
  { tier: 2, name: '熟バナナ',   score: 3,   texture: 'banana_rembg.png' },
  { tier: 3, name: '完熟バナナ', score: 12,  texture: 'banana_ripe.png' },
  { tier: 4, name: '銀バナナ',   score: 30,  texture: 'banana_silver.png' },
  { tier: 5, name: '金バナナ',   score: 100, texture: 'banana_gold.png' },
  { tier: 6, name: '伝説バナナ', score: 500, texture: 'banana_legend.png' },
]

const TIER_COLORS = ['#888', '#c8a000', '#cd7f32', '#c0c0c0', '#ffd700', '#ff00ff']

const UPGRADES = [
  // クリック強化
  { id: 'click2', label: '2本/クリック', cost: 10, group: 'click', requires: null },
  { id: 'click5', label: '5本/クリック', cost: 100, group: 'click', requires: 'click2' },
  { id: 'click10', label: '10本/クリック', cost: 500, group: 'click', requires: 'click5' },
  { id: 'click20', label: '20本/クリック', cost: 2000, group: 'click', requires: 'click10' },
  { id: 'click50', label: '50本/クリック', cost: 10000, group: 'click', requires: 'click20' },
  // バナナ種解放
  { id: 'tier2', label: '熟バナナ解放', cost: 50, group: 'banana', requires: null, tier: 2 },
  { id: 'tier3', label: '完熟バナナ解放', cost: 300, group: 'banana', requires: 'tier2', tier: 3 },
  { id: 'tier4', label: '銀バナナ解放', cost: 1500, group: 'banana', requires: 'tier3', tier: 4 },
  { id: 'tier5', label: '金バナナ解放', cost: 8000, group: 'banana', requires: 'tier4', tier: 5 },
  { id: 'tier6', label: '伝説バナナ解放', cost: 50000, group: 'banana', requires: 'tier5', tier: 6 },
  // オートスポーン
  { id: 'auto1', label: '1本/秒', cost: 30, group: 'auto', requires: null },
  { id: 'auto5', label: '5本/秒', cost: 200, group: 'auto', requires: 'auto1' },
  { id: 'auto20', label: '20本/秒', cost: 1500, group: 'auto', requires: 'auto5' },
  { id: 'auto60', label: '60本/秒', cost: 10000, group: 'auto', requires: 'auto20' },
  { id: 'auto200', label: '200本/秒', cost: 50000, group: 'auto', requires: 'auto60' },
  // 物理強化
  { id: 'gravity', label: '重力2倍', cost: 80, group: 'physics', requires: null },
  { id: 'bounce', label: '超バウンド', cost: 120, group: 'physics', requires: null },
  { id: 'gravity5', label: '重力5倍', cost: 500, group: 'physics', requires: 'gravity' },
  { id: 'bounce2', label: '爆バウンド', cost: 800, group: 'physics', requires: 'bounce' },
]

const GROUPS = [
  { key: 'click', label: '🍌 クリック' },
  { key: 'banana', label: '🌟 バナナ種' },
  { key: 'auto', label: '⏰ オート' },
  { key: 'physics', label: '🌍 物理' },
]

let _textId = 0

function App() {
  const [score, setScore] = useState(0)
  const [bananaPerClick, setBananaPerClick] = useState(1)
  const [autoSpawnRate, setAutoSpawnRate] = useState(0)
  const [gravityScale, setGravityScale] = useState(1)
  const [bounceMultiplier, setBounceMultiplier] = useState(1)
  const [unlockedTiers, setUnlockedTiers] = useState([BANANA_TIERS[0]])
  const [purchased, setPurchased] = useState(new Set())
  const [floatingTexts, setFloatingTexts] = useState([])
  const [clickEffects, setClickEffects] = useState([])
  const [scoreBump, setScoreBump] = useState(false)

  const unlockedTiersRef = useRef(unlockedTiers)
  useEffect(() => { unlockedTiersRef.current = unlockedTiers }, [unlockedTiers])

  // /秒あたりの期待スコア
  const avgScore = unlockedTiers.reduce((s, t) => s + t.score, 0) / unlockedTiers.length
  const perSecond = autoSpawnRate > 0 ? Math.round(autoSpawnRate * avgScore) : 0

  const handleScore = useCallback((scoreItems) => {
    const total = scoreItems.reduce((sum, item) => sum + item.score, 0)
    setScore(s => s + total)
    setScoreBump(true)
    setTimeout(() => setScoreBump(false), 300)

    const newTexts = scoreItems.map((item) => ({
      id: ++_textId,
      value: item.score,
      x: Math.max(40, Math.min(window.innerWidth - 40, item.x)),
    }))
    setFloatingTexts(prev => [...prev, ...newTexts])
    setTimeout(() => {
      const ids = new Set(newTexts.map(t => t.id))
      setFloatingTexts(prev => prev.filter(t => !ids.has(t.id)))
    }, 1200)
  }, [])

  const handleClick = useCallback((e) => {
    const id = ++_textId
    setClickEffects(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
    setTimeout(() => setClickEffects(prev => prev.filter(ef => ef.id !== id)), 600)
  }, [])

  const buyUpgrade = (upgrade) => {
    if (score < upgrade.cost) return
    if (purchased.has(upgrade.id)) return
    if (upgrade.requires && !purchased.has(upgrade.requires)) return

    setScore(s => s - upgrade.cost)
    setPurchased(p => new Set([...p, upgrade.id]))

    switch (upgrade.id) {
      case 'click2': setBananaPerClick(2); break
      case 'click5': setBananaPerClick(5); break
      case 'click10': setBananaPerClick(10); break
      case 'click20': setBananaPerClick(20); break
      case 'click50': setBananaPerClick(50); break
      case 'tier2': case 'tier3': case 'tier4': case 'tier5': case 'tier6': {
        const newTier = BANANA_TIERS.find(t => t.tier === upgrade.tier)
        setUnlockedTiers(prev => [...prev, newTier])
        break
      }
      case 'auto1': setAutoSpawnRate(1); break
      case 'auto5': setAutoSpawnRate(5); break
      case 'auto20': setAutoSpawnRate(20); break
      case 'auto60': setAutoSpawnRate(60); break
      case 'auto200': setAutoSpawnRate(200); break
      case 'gravity': setGravityScale(2); break
      case 'gravity5': setGravityScale(5); break
      case 'bounce': setBounceMultiplier(3); break
      case 'bounce2': setBounceMultiplier(6); break
    }
  }

  const scoreColor = (score) => {
    if (score >= 500) return '#ff00ff'
    if (score >= 100) return '#ffd700'
    if (score >= 30) return '#c0c0c0'
    if (score >= 12) return '#cd7f32'
    if (score >= 3) return '#c8a000'
    return '#555'
  }

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}
      onClick={handleClick}
    >
      {/* スコア表示 */}
      <div style={{
        position: 'fixed', top: 16, left: 16, zIndex: 10,
        background: 'rgba(255,255,255,0.92)', borderRadius: 16,
        padding: '10px 20px', fontWeight: 'bold',
        boxShadow: '0 4px 14px rgba(0,0,0,0.18)', userSelect: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
        animation: scoreBump ? 'scoreBump 0.3s ease-out' : 'none',
      }}>
        <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>🍌 {score.toLocaleString()}</span>
        {perSecond > 0 && (
          <span style={{ fontSize: '0.72rem', color: '#888' }}>+{perSecond.toLocaleString()}/秒</span>
        )}
      </div>

      {/* 解放中のバナナ種 */}
      <div style={{
        position: 'fixed', top: 16, right: 16, zIndex: 10,
        display: 'flex', gap: 4,
      }}>
        {unlockedTiers.map(t => (
          <div key={t.tier} style={{
            background: 'rgba(255,255,255,0.88)',
            borderRadius: 10, padding: '5px 9px',
            fontSize: '0.72rem', fontWeight: 'bold',
            color: TIER_COLORS[t.tier - 1],
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            userSelect: 'none',
          }}>
            {t.name}<br />
            <span style={{ fontSize: '0.65rem' }}>+{t.score}pt</span>
          </div>
        ))}
      </div>

      {/* 浮き上がりテキスト */}
      {floatingTexts.map(t => (
        <div key={t.id} style={{
          position: 'fixed', left: t.x, bottom: 100, zIndex: 20,
          fontSize: t.value >= 500 ? '2.5rem' : t.value >= 100 ? '2.2rem' : t.value >= 30 ? '1.8rem' : t.value >= 12 ? '1.4rem' : '1.1rem',
          fontWeight: 'bold',
          color: scoreColor(t.value),
          pointerEvents: 'none',
          animation: 'floatUp 1.2s ease-out forwards',
          textShadow: '0 1px 4px rgba(255,255,255,0.9)',
          whiteSpace: 'nowrap',
        }}>
          +{t.value}🍌
        </div>
      ))}

      {/* クリックリップル */}
      {clickEffects.map(ef => (
        <div key={ef.id} style={{
          position: 'fixed', left: ef.x, top: ef.y,
          width: 50, height: 50, borderRadius: '50%',
          border: '3px solid rgba(255, 200, 0, 0.9)',
          pointerEvents: 'none', zIndex: 20,
          animation: 'ripple 0.6s ease-out forwards',
        }} />
      ))}

      {/* アップグレードパネル */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10,
        background: 'rgba(255,255,255,0.93)',
        borderTop: '1.5px solid rgba(0,0,0,0.08)',
        padding: '8px 12px 12px',
        display: 'flex', gap: 14, overflowX: 'auto',
        backdropFilter: 'blur(10px)',
      }}>
        {GROUPS.map(group => {
          const items = UPGRADES.filter(u => u.group === group.key)
          return (
            <div key={group.key} style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 'fit-content' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 'bold', color: '#777', whiteSpace: 'nowrap', paddingLeft: 2 }}>
                {group.label}
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {items.map(u => {
                  const bought = purchased.has(u.id)
                  const locked = u.requires && !purchased.has(u.requires)
                  const affordable = score >= u.cost
                  const glowing = !bought && !locked && affordable
                  const tierData = u.tier ? BANANA_TIERS.find(t => t.tier === u.tier) : null

                  return (
                    <button
                      key={u.id}
                      onClick={(e) => { e.stopPropagation(); buyUpgrade(u) }}
                      disabled={bought || locked}
                      style={{
                        padding: '6px 10px', borderRadius: 9, border: 'none',
                        cursor: bought || locked ? 'default' : affordable ? 'pointer' : 'not-allowed',
                        background: bought ? '#b0e0a0' : locked ? '#e0e0e0' : affordable ? '#ffd700' : '#eeeeee',
                        fontWeight: 'bold', fontSize: '0.78rem', whiteSpace: 'nowrap',
                        boxShadow: glowing
                          ? '0 2px 10px rgba(255,190,0,0.6), 0 0 0 1.5px rgba(255,180,0,0.4)'
                          : '0 1px 3px rgba(0,0,0,0.1)',
                        opacity: locked ? 0.38 : 1,
                        transform: glowing ? 'translateY(-1px)' : 'none',
                        transition: 'all 0.15s',
                        minWidth: 80,
                      }}
                    >
                      <div>{bought ? '✓ ' : ''}{u.label}</div>
                      <div style={{ fontSize: '0.66rem', marginTop: 2, fontWeight: 'normal', opacity: 0.85 }}>
                        {bought
                          ? '解放済み'
                          : locked
                            ? '🔒'
                            : tierData
                              ? `+${tierData.score}pt / 🍌${u.cost.toLocaleString()}`
                              : `🍌 ${u.cost.toLocaleString()}`}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <BananaWorld
        bananaPerClick={bananaPerClick}
        autoSpawnRate={autoSpawnRate}
        gravityScale={gravityScale}
        bounceMultiplier={bounceMultiplier}
        unlockedTiers={unlockedTiers}
        onScore={handleScore}
      />
    </div>
  )
}

export default App
