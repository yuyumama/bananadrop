import { useState, useCallback, useRef, useEffect } from 'react';
import BananaWorld from './components/BananaWorld';
import ClickRipple from './components/ui/ClickRipple';
import FloatingScoreText from './components/ui/FloatingScoreText';
import ScoreDisplay from './components/ui/ScoreDisplay';
import UnlockedBananaTiers from './components/ui/UnlockedBananaTiers';
import UpgradePanel from './components/ui/UpgradePanel';

import { TIER_COLORS } from './data/constants/tierColors';
import { UPGRADE_GROUPS } from './data/constants/upgradeGroups';
import { PANEL_HEIGHT } from './data/constants/layout';
import useUpgradeState from './hooks/useUpgradeState';

let _textId = 0;

function App() {
  const [score, setScore] = useState(0);
  const {
    bananaPerClick,
    autoSpawnRate,
    giantChance,
    unlockedTiers,
    purchased,
    buyUpgrade,
  } = useUpgradeState();
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [clickEffects, setClickEffects] = useState([]);
  const [scoreBump, setScoreBump] = useState(false);
  const [perSecond, setPerSecond] = useState(0);
  const [devMode, setDevMode] = useState(false);

  // 開発者モード: Ctrl+Shift+D で切り替え
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDevMode((prev) => {
          const next = !prev;
          if (next) {
            setScore(99999999);
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 実測ローリング平均（5秒間の実スコア履歴から計算）
  const scoreHistoryRef = useRef([]);
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const cutoff = now - 5000;
      scoreHistoryRef.current = scoreHistoryRef.current.filter(
        (e) => e.time > cutoff,
      );
      const total = scoreHistoryRef.current.reduce((s, e) => s + e.score, 0);
      setPerSecond(Math.round(total / 5));
    }, 500);
    return () => clearInterval(id);
  }, []);

  const handleScore = useCallback((scoreItems) => {
    const total = scoreItems.reduce((sum, item) => sum + item.score, 0);
    setScore((s) => s + total);
    scoreHistoryRef.current.push({ time: Date.now(), score: total });
    setScoreBump(true);
    setTimeout(() => setScoreBump(false), 300);

    const newTexts = scoreItems.map((item) => ({
      id: ++_textId,
      value: item.score,
      x: Math.max(40, Math.min(window.innerWidth - 40, item.x)),
    }));
    setFloatingTexts((prev) => [...prev, ...newTexts]);
    setTimeout(() => {
      const ids = new Set(newTexts.map((t) => t.id));
      setFloatingTexts((prev) => prev.filter((t) => !ids.has(t.id)));
    }, 1200);
  }, []);

  const handleClick = useCallback((e) => {
    const id = ++_textId;
    setClickEffects((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(
      () => setClickEffects((prev) => prev.filter((ef) => ef.id !== id)),
      600,
    );
  }, []);

  const handleBuyUpgrade = useCallback(
    (upgrade) => {
      const purchasedSuccess = buyUpgrade(upgrade, score);
      if (!purchasedSuccess) return;
      if (!devMode) {
        setScore((currentScore) => currentScore - upgrade.cost);
      }
    },
    [buyUpgrade, score, devMode],
  );

  const scoreColor = (score) => {
    if (score >= 500) return '#ff00ff';
    if (score >= 100) return '#ffd700';
    if (score >= 30) return '#c0c0c0';
    if (score >= 12) return '#cd7f32';
    if (score >= 3) return '#c8a000';
    return '#555';
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
      onClick={handleClick}
    >
      <ScoreDisplay
        score={score}
        perSecond={perSecond}
        scoreBump={scoreBump}
        devMode={devMode}
      />
      <UnlockedBananaTiers
        unlockedTiers={unlockedTiers}
        tierColors={TIER_COLORS}
      />
      {floatingTexts.map((text) => (
        <FloatingScoreText
          key={text.id}
          text={text}
          color={scoreColor(text.value)}
        />
      ))}

      {/* クリックリップル */}
      {clickEffects.map((effect) => (
        <ClickRipple key={effect.id} effect={effect} />
      ))}

      <UpgradePanel
        groups={UPGRADE_GROUPS}
        purchased={purchased}
        score={score}
        onBuy={handleBuyUpgrade}
      />

      <BananaWorld
        bananaPerClick={bananaPerClick}
        autoSpawnRate={autoSpawnRate}
        panelHeight={PANEL_HEIGHT}
        unlockedTiers={unlockedTiers}
        giantChance={giantChance}
        onScore={handleScore}
      />
    </div>
  );
}

export default App;
