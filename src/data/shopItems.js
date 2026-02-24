// ショップアイテム定義
// cost: 初回購入コスト（Seeds）
// costMultiplier: 購入ごとの価格倍率（指数関数的値上がり）
// maxCount: 最大購入回数
// spawnChancePerSecond: 特殊バナナとして降ってくる確率（1体ごと・1秒ごと）
// effect: 着地したときに発動する効果

// 購入数に応じた現在のコストを返す
export const getShopItemCost = (item, count) =>
  Math.round(item.cost * Math.pow(item.costMultiplier ?? 1, count));

export const SHOP_ITEMS = [
  {
    id: 'banana_nui',
    label: 'ぬいバナナ',
    description: 'オートスポーンが一定時間3倍になる。',
    icon: 'banana_nui.png',
    cost: 3,
    costMultiplier: 2,
    maxCount: 5,
    spawnChancePerSecond: 0.01, // 1体あたり。5体で0.02/秒 ≈ 平均50秒に1回
    effect: {
      type: 'feverTime',
      duration: 4, // 秒（1体あたり。5体で20s上限）
      maxDuration: 20, // 秒（スタック上限）
      autoMultiplier: 3, // オートスポーン倍率
    },
  },
];
