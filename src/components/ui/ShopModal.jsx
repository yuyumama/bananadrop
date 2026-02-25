import { X } from 'lucide-react';
import {
  SHOP_ITEMS,
  getShopItemCost,
  getEffectDuration,
} from '../../data/shopItems';

export default function ShopModal({
  banaCoins,
  shopPurchases,
  onBuy,
  onClose,
  treeLevel,
  treeGrowth,
}) {
  const stageIndex = Math.min(Math.floor(treeLevel / 5), 6);
  const imgSrc = `${import.meta.env.BASE_URL}tree_stage${String(stageIndex).padStart(2, '0')}.png`;
  const progress = Math.min(100, Math.max(0, treeGrowth ?? 0));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: 'min(420px, 92vw)',
          borderRadius: '28px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          background: 'rgba(255,255,255,0.94)',
          border: '1px solid var(--accent-gold-soft)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          animation: 'slideInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 900,
              color: 'var(--text-main)',
              letterSpacing: '0.04em',
            }}
          >
            🛒 SHOP
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid var(--glass-border)',
              background: 'rgba(0,0,0,0.04)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.08)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tree section */}
        <div
          style={{
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #f6fef0, #fffde7)',
            border: '1px solid rgba(139,195,74,0.25)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <img
            src={imgSrc}
            alt="tree"
            style={{
              width: 64,
              height: 64,
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  color: 'var(--text-main)',
                }}
              >
                バナナツリー
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#8bc34a',
                  background: 'rgba(139,195,74,0.12)',
                  padding: '1px 8px',
                  borderRadius: 8,
                }}
              >
                LV.{treeLevel}
              </span>
            </div>

            {/* Growth bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                }}
              >
                <span>次のバナコインまで</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div
                style={{
                  height: 5,
                  background: 'rgba(0,0,0,0.07)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #8bc34a, #c6e05a)',
                    borderRadius: 3,
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
            </div>

            {/* BanaCoins balance */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--accent-gold)',
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}coin.png`}
                alt="coin"
                style={{ width: 16, height: 16, objectFit: 'contain' }}
              />
              <span>{banaCoins} バナコイン</span>
            </div>
          </div>
        </div>

        <div
          style={{
            height: 1,
            background: 'rgba(0,0,0,0.06)',
            margin: '0',
          }}
        />

        {/* Section label */}
        <div
          style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: -4,
          }}
        >
          Items
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SHOP_ITEMS.map((item) => {
            const count = shopPurchases[item.id] ?? 0;
            const isMaxed = count >= item.maxCount;
            const currentCost = getShopItemCost(item, count);
            const canAfford = banaCoins >= currentCost;

            const isFeverItem = item.effect?.type === 'feverTime';
            const baseDuration = item.effect?.duration ?? 0;
            const currentDuration = baseDuration * count;
            const nextDuration = baseDuration * (count + 1);

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  background: isMaxed
                    ? 'linear-gradient(135deg, #f0fae8, #e8f5e0)'
                    : 'linear-gradient(135deg, #fffef5, #fffbe8)',
                  border: `1.5px solid ${isMaxed ? 'rgba(76,175,80,0.25)' : 'var(--accent-gold-soft)'}`,
                }}
              >
                {/* Item image */}
                <img
                  src={`${import.meta.env.BASE_URL}${item.icon}`}
                  alt={item.label}
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: 'contain',
                    flexShrink: 0,
                    filter: isMaxed
                      ? 'drop-shadow(0 0 8px rgba(76,175,80,0.4))'
                      : 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))',
                    transform: item.id === 'banana_blackhole' ? 'rotate(70deg)' : undefined,
                  }}
                />

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Title row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                      }}
                    >
                      {item.label}
                    </span>
                    {isMaxed && (
                      <span
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          color: '#4caf50',
                          background: 'rgba(76,175,80,0.1)',
                          padding: '1px 7px',
                          borderRadius: 8,
                          letterSpacing: '0.04em',
                        }}
                      >
                        MAXED
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      color: 'var(--text-muted)',
                      marginBottom: 6,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.description}
                  </div>

                  {/* spawnChanceStacks: 出現確率表示 */}
                  {item.spawnChanceStacks && (
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#1e3a5f',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        flexWrap: 'wrap',
                      }}
                    >
                      {count === 0 ? (
                        <span
                          style={{
                            color: 'var(--text-muted)',
                            fontWeight: 500,
                          }}
                        >
                          購入で 🌀 出現率{' '}
                          {(item.spawnChancePerBanana * 100).toFixed(1)}%
                        </span>
                      ) : (
                        <>
                          <span>
                            🌀 出現率{' '}
                            {(item.spawnChancePerBanana * count * 100).toFixed(
                              1,
                            )}
                            %
                          </span>
                          {!isMaxed && (
                            <span style={{ color: '#3b82f6', fontWeight: 600 }}>
                              → 次購入で{' '}
                              {(
                                item.spawnChancePerBanana *
                                (count + 1) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* allGiant: 効果時間表示 */}
                  {item.effect?.type === 'allGiant' && (
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#9333ea',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        flexWrap: 'wrap',
                      }}
                    >
                      {count === 0 ? (
                        <span
                          style={{
                            color: 'var(--text-muted)',
                            fontWeight: 500,
                          }}
                        >
                          購入で ✨ {getEffectDuration(item.effect, 1)}s 巨大化
                        </span>
                      ) : (
                        <>
                          <span>
                            ✨ 現在 {getEffectDuration(item.effect, count)}s
                            効果
                          </span>
                          {!isMaxed && (
                            <span style={{ color: '#a855f7', fontWeight: 600 }}>
                              → 次購入で{' '}
                              {getEffectDuration(item.effect, count + 1)}s
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* feverTime: 効果時間表示 */}
                  {isFeverItem && (
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: '#ff8c00',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        flexWrap: 'wrap',
                      }}
                    >
                      {count === 0 ? (
                        <span
                          style={{
                            color: 'var(--text-muted)',
                            fontWeight: 500,
                          }}
                        >
                          購入で 🔥 {baseDuration}s 効果
                        </span>
                      ) : (
                        <>
                          <span>🔥 現在 {currentDuration}s 効果</span>
                          {!isMaxed && (
                            <span
                              style={{
                                color: 'var(--accent-gold)',
                                fontWeight: 600,
                              }}
                            >
                              → 次購入で {nextDuration}s
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Count dots + buy button */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 4 }}>
                      {Array.from({ length: item.maxCount }, (_, i) => (
                        <div
                          key={i}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background:
                              i < count
                                ? 'var(--accent-gold)'
                                : 'rgba(0,0,0,0.1)',
                            border:
                              i < count
                                ? '1.5px solid var(--accent-gold)'
                                : '1.5px solid rgba(0,0,0,0.15)',
                            transition: 'all 0.3s',
                          }}
                        />
                      ))}
                    </div>

                    {!isMaxed && (
                      <button
                        className="premium-button"
                        onClick={() => onBuy(item)}
                        disabled={!canAfford}
                        style={{
                          padding: '5px 14px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          borderRadius: '20px',
                          height: 'auto',
                        }}
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}coin.png`}
                          alt="coin"
                          style={{
                            width: 14,
                            height: 14,
                            objectFit: 'contain',
                            opacity: 0.9,
                          }}
                        />
                        <span>{currentCost}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
