// size: 画像ピクセルサイズ（スケール正規化用、基準=2048）
export const BANANA_TIERS = [
  {
    tier: 1,
    name: '青バナナ',
    score: 1,
    icon: 'banana_green_02.png',
    textures: [
      { file: 'banana_green_01.png', size: 1024 },
      { file: 'banana_green_02.png', size: 1024 },
      { file: 'banana_green_03.png', size: 1000 },
    ],
  },
  {
    tier: 2,
    name: '完熟バナナ',
    score: 3,
    icon: 'banana_rembg_01.png',
    textures: [
      { file: 'banana_rembg_01.png', size: 2048 },
      { file: 'banana_rembg_02.png', size: 1024 },
      { file: 'banana_rembg_03.png', size: 1280 },
    ],
  },
  {
    tier: 3,
    name: '真っ黒バナナ',
    score: 12,
    icon: 'banana_ripe_01.png',
    textures: [
      { file: 'banana_ripe_01.png', size: 1024 },
      { file: 'banana_ripe_02.png', size: 1024 },
      { file: 'banana_ripe_03.png', size: 1280 },
    ],
  },
  {
    tier: 4,
    name: '銀バナナ',
    score: 30,
    icon: 'banana_silver_01.png',
    textures: [
      { file: 'banana_silver_01.png', size: 1024 },
      { file: 'banana_silver_02.png', size: 1024 },
      { file: 'banana_silver_03.png', size: 1000 },
    ],
  },
  {
    tier: 5,
    name: '金バナナ',
    score: 100,
    icon: 'banana_gold_02.png',
    textures: [
      { file: 'banana_gold_01.png', size: 1024 },
      { file: 'banana_gold_02.png', size: 2048 },
      { file: 'banana_gold_03.png', size: 1024 },
    ],
  },
  {
    tier: 6,
    name: '伝説バナナ',
    score: 500,
    icon: 'banana_legend.png',
    textures: [{ file: 'banana_legend.png', size: 1024 }],
  },
];
