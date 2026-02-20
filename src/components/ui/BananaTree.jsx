import { useState, useEffect, useRef } from 'react';
import { Droplets, Sprout, TreeDeciduous, TreePine, Sparkles, RefreshCw } from 'lucide-react';

const TREE_STAGES = [
    { level: 0, label: 'シード', Icon: Sprout, color: '#8bc34a' },
    { level: 1, label: '若葉', Icon: TreeDeciduous, color: '#4caf50' },
    { level: 2, label: '成長期', Icon: TreePine, color: '#388e3c' },
    { level: 3, label: '成熟', Icon: Sparkles, color: '#d4af37' },
];

export default function BananaTree({ score, treeLevel, treeGrowth, onWater, devMode }) {
    const [showSeedEffect, setShowSeedEffect] = useState(false);
    const prevLevelRef = useRef(treeLevel);

    const currentStageIndex = Math.min(Math.floor(treeLevel / 3), TREE_STAGES.length - 1);
    const currentStage = TREE_STAGES[currentStageIndex];

    const cost = 100 + treeLevel * 50;
    const canAfford = score >= cost || devMode;

    // レベルアップ時のエフェクトトリガー
    useEffect(() => {
        if (treeLevel > prevLevelRef.current) {
            setShowSeedEffect(true);
            const timer = setTimeout(() => setShowSeedEffect(false), 2000);
            prevLevelRef.current = treeLevel;
            return () => clearTimeout(timer);
        }
        prevLevelRef.current = treeLevel;
    }, [treeLevel]);

    const handleWaterClick = () => {
        if (canAfford) {
            onWater();
        }
    };

    const Icon = currentStage.Icon;

    // 成長度合い (0-100)
    const progress = Math.min(100, Math.max(0, treeGrowth));

    return (
        <div
            className="glass-panel"
            style={{
                position: 'fixed',
                top: 130, // スコアUIと被らないように下に移動
                left: 24,
                zIndex: 10,
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                userSelect: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: '68px',
                borderRadius: '34px',
                border: treeLevel >= 5 ? '1px solid var(--accent-gold-soft)' : '1px solid var(--glass-border)',
                animation: showSeedEffect ? 'levelUpFlash 0.8s ease-out' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {/* Seed Pop-up Effect */}
            {showSeedEffect && (
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    color: 'var(--accent-gold)',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 20,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    animation: 'seedPopUp 2s ease-out forwards',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                }}>
                    <span>+1 Seed</span>
                    <span style={{ fontSize: '1rem' }}>🌱</span>
                </div>
            )}

            {/* Level Badge */}
            <div style={{
                fontSize: '0.6rem',
                fontWeight: 900,
                color: currentStage.color,
                background: `rgba(${currentStage.color === '#d4af37' ? '212, 175, 55' : '76, 175, 80'}, 0.1)`,
                padding: '2px 8px',
                borderRadius: '10px',
                letterSpacing: '0.05em',
            }}>
                LV.{treeLevel}
            </div>

            {/* Tree Icon & Progress Ring */}
            <div
                style={{
                    position: 'relative',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{
                    color: currentStage.color,
                    filter: treeLevel >= 3 ? `drop-shadow(0 0 8px ${currentStage.color}44)` : 'none',
                }}>
                    <Icon size={28} strokeWidth={2.5} />
                </div>
                <svg
                    style={{
                        position: 'absolute',
                        top: -4,
                        left: -4,
                        width: 56,
                        height: 56,
                        transform: 'rotate(-90deg)',
                    }}
                >
                    <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="3" />
                    <circle
                        cx="28"
                        cy="28"
                        r="26"
                        fill="none"
                        stroke={currentStage.color}
                        strokeWidth="3"
                        strokeDasharray={`${26 * 2 * Math.PI}`}
                        strokeDashoffset={`${26 * 2 * Math.PI * (1 - progress / 100)}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                </svg>
            </div>

            {/* Stylish Water Button & Cost Label */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <button
                    onClick={handleWaterClick}
                    disabled={!canAfford}
                    title={`Watering (+20%)`}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        border: 'none',
                        background: canAfford
                            ? 'linear-gradient(135deg, #64B5F6 0%, #1E88E5 100%)'
                            : '#ececec',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                        boxShadow: canAfford ? '0 4px 12px rgba(30, 136, 229, 0.3)' : 'none',
                        transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                        if (canAfford) {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(30, 136, 229, 0.4)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = canAfford ? '0 4px 12px rgba(30, 136, 229, 0.3)' : 'none';
                    }}
                    onMouseDown={(e) => {
                        if (canAfford) e.currentTarget.style.transform = 'scale(0.9)';
                    }}
                    onMouseUp={(e) => {
                        if (canAfford) e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                >
                    <Droplets size={20} fill={canAfford ? "rgba(255,255,255,0.2)" : "none"} />
                </button>
                <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: canAfford ? 'var(--text-main)' : 'var(--text-muted)',
                    opacity: canAfford ? 0.8 : 0.4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    background: 'rgba(0,0,0,0.03)',
                    padding: '2px 8px',
                    borderRadius: '10px'
                }}>
                    <span style={{ fontSize: '0.7rem' }}>💧</span>
                    <span>-{cost}</span>
                </div>
            </div>
        </div>
    );
}

