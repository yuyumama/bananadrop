// ショップアイテム定義
// cost: 初回購入コスト（バナコイン）
// costMultiplier: 購入ごとの価格倍率（指数関数的値上がり）
// maxCount: 最大購入回数
// spawnChancePerBanana: 通常バナナ1体出るごとの出現確率（購入1体あたり）
// effect: 着地したときに発動する効果

// 購入数に応じた現在のコストを返す
export const getShopItemCost = (item, count) =>
  Math.round(item.cost * Math.pow(item.costMultiplier ?? 1, count));

// 購入数に応じた効果時間を返す（durations 配列があればそれを優先）
export const getEffectDuration = (effect, count) => {
  if (Array.isArray(effect.durations)) {
    return effect.durations[Math.min(count, effect.durations.length) - 1] ?? 0;
  }
  return Math.min(effect.maxDuration ?? Infinity, effect.duration * count);
};

export const SHOP_ITEMS = [
  {
    id: 'banana_nui',
    label: 'ぬいバナナ',
    description: 'オートスポーンが一定時間3倍になる。',
    icon: 'banana_nui.png',
    iconSize: 1024,
    cost: 10,
    costMultiplier: 1.5,
    maxCount: 5,
    spawnChancePerBanana: 0.001, // 確率
    effect: {
      type: 'feverTime',
      duration: 4,
      maxDuration: 20,
      autoMultiplier: 3,
    },
  },
  {
    id: 'banana_magic',
    label: 'マジックバナナ',
    description: '一定時間すべてのバナナがレアバナナになる。',
    icon: 'banana_magic.png',
    iconSize: 1024,
    cost: 10,
    costMultiplier: 1.5,
    maxCount: 5,
    spawnChancePerBanana: 0.001, // 確立
    effect: {
      type: 'allGiant',
      durations: [3, 4, 6, 7, 10],
    },
  },
  {
    id: 'banana_onekind',
    label: 'oneバナナ',
    description:
      '一定時間スポーンするバナナが1種類に統一される。',
    icon: 'banana_onekind.png',
    iconSize: 500,
    cost: 10,
    costMultiplier: 1.5,
    maxCount: 5,
    spawnChancePerBanana: 0.001,
    effect: {
      type: 'oneKind',
      durations: [5, 10, 15, 20, 25],
    },
  },
  {
    id: 'banana_blackhole',
    label: 'ブラックホールバナナ',
    description: '周囲のバナナを引き寄せる。',
    icon: 'banana_blackhole.png',
    iconSize: 1024,
    cost: 10,
    costMultiplier: 1.5,
    maxCount: 5,
    spawnChancePerBanana: 0.001, // 確率
    spawnChanceStacks: true, // 購入数に比例して出現確率が上がる
    // 効果はフィジックスレベルで処理（引力）
  },
];
