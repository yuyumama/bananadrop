import { BANANA_TIERS } from './constants/bananaTiers';

// クリック強化（~3x ずつ）
const CLICK_DATA = [
  { cost: 25, clickPer: 2 },
  { cost: 75, clickPer: 3 },
  { cost: 225, clickPer: 4 },
  { cost: 675, clickPer: 5 },
  { cost: 2000, clickPer: 6 },
  { cost: 6000, clickPer: 7 },
  { cost: 18000, clickPer: 8 },
  { cost: 55000, clickPer: 9 },
  { cost: 165000, clickPer: 10 },
  { cost: 500000, clickPer: 11 },
  { cost: 1500000, clickPer: 12 },
  { cost: 4500000, clickPer: 13 },
  { cost: 13500000, clickPer: 14 },
  { cost: 40500000, clickPer: 15 },
];

// バナナ種解放
const BANANA_DATA = [
  { cost: 2000, tier: 2 }, // 完熟バナナ 10pt
  { cost: 8000, tier: 3 }, // 赤バナナ 30pt
  { cost: 30000, tier: 4 }, // 傷んだバナナ 70pt
  { cost: 100000, tier: 5 }, // 真っ黒バナナ 150pt
  { cost: 350000, tier: 6 }, // 銅バナナ 300pt
  { cost: 1200000, tier: 7 }, // 銀バナナ 600pt
  { cost: 4000000, tier: 8 }, // 金バナナ 1200pt
  { cost: 15000000, tier: 9 }, // 氷バナナ 2500pt
  { cost: 60000000, tier: 10 }, // 桜バナナ 5000pt
  { cost: 250000000, tier: 11 }, // 溶岩バナナ 10000pt
  { cost: 1000000000, tier: 12 }, // 伝説バナナ 20000pt
];

// オートスポーン（~1.16x ずつ、1〜100本/秒）
const AUTO_DATA = [
  { cost: 30, autoPer: 1 },
  { cost: 35, autoPer: 2 },
  { cost: 40, autoPer: 3 },
  { cost: 47, autoPer: 4 },
  { cost: 54, autoPer: 5 },
  { cost: 63, autoPer: 6 },
  { cost: 73, autoPer: 7 },
  { cost: 85, autoPer: 8 },
  { cost: 98, autoPer: 9 },
  { cost: 114, autoPer: 10 },
  { cost: 133, autoPer: 11 },
  { cost: 154, autoPer: 12 },
  { cost: 179, autoPer: 13 },
  { cost: 207, autoPer: 14 },
  { cost: 240, autoPer: 15 },
  { cost: 279, autoPer: 16 },
  { cost: 323, autoPer: 17 },
  { cost: 375, autoPer: 18 },
  { cost: 435, autoPer: 19 },
  { cost: 505, autoPer: 20 },
  { cost: 587, autoPer: 21 },
  { cost: 681, autoPer: 22 },
  { cost: 790, autoPer: 23 },
  { cost: 916, autoPer: 24 },
  { cost: 1063, autoPer: 25 },
  { cost: 1233, autoPer: 26 },
  { cost: 1430, autoPer: 27 },
  { cost: 1659, autoPer: 28 },
  { cost: 1924, autoPer: 29 },
  { cost: 2232, autoPer: 30 },
  { cost: 2589, autoPer: 31 },
  { cost: 3003, autoPer: 32 },
  { cost: 3484, autoPer: 33 },
  { cost: 4041, autoPer: 34 },
  { cost: 4688, autoPer: 35 },
  { cost: 5438, autoPer: 36 },
  { cost: 6308, autoPer: 37 },
  { cost: 7317, autoPer: 38 },
  { cost: 8488, autoPer: 39 },
  { cost: 9846, autoPer: 40 },
  { cost: 11421, autoPer: 41 },
  { cost: 13248, autoPer: 42 },
  { cost: 15368, autoPer: 43 },
  { cost: 17827, autoPer: 44 },
  { cost: 20679, autoPer: 45 },
  { cost: 23987, autoPer: 46 },
  { cost: 27825, autoPer: 47 },
  { cost: 32277, autoPer: 48 },
  { cost: 37441, autoPer: 49 },
  { cost: 43432, autoPer: 50 },
  { cost: 50381, autoPer: 51 },
  { cost: 58442, autoPer: 52 },
  { cost: 67793, autoPer: 53 },
  { cost: 78639, autoPer: 54 },
  { cost: 91221, autoPer: 55 },
  { cost: 105817, autoPer: 56 },
  { cost: 122748, autoPer: 57 },
  { cost: 142387, autoPer: 58 },
  { cost: 165169, autoPer: 59 },
  { cost: 191596, autoPer: 60 },
  { cost: 222251, autoPer: 61 },
  { cost: 257811, autoPer: 62 },
  { cost: 299061, autoPer: 63 },
  { cost: 346910, autoPer: 64 },
  { cost: 402416, autoPer: 65 },
  { cost: 466803, autoPer: 66 },
  { cost: 541492, autoPer: 67 },
  { cost: 628131, autoPer: 68 },
  { cost: 728632, autoPer: 69 },
  { cost: 845213, autoPer: 70 },
  { cost: 980447, autoPer: 71 },
  { cost: 1137319, autoPer: 72 },
  { cost: 1319290, autoPer: 73 },
  { cost: 1530376, autoPer: 74 },
  { cost: 1775236, autoPer: 75 },
  { cost: 2059274, autoPer: 76 },
  { cost: 2388758, autoPer: 77 },
  { cost: 2770960, autoPer: 78 },
  { cost: 3214314, autoPer: 79 },
  { cost: 3728604, autoPer: 80 },
  { cost: 4325181, autoPer: 81 },
  { cost: 5017210, autoPer: 82 },
  { cost: 5819963, autoPer: 83 },
  { cost: 6751157, autoPer: 84 },
  { cost: 7831342, autoPer: 85 },
  { cost: 9084357, autoPer: 86 },
  { cost: 10537854, autoPer: 87 },
  { cost: 12223911, autoPer: 88 },
  { cost: 14179737, autoPer: 89 },
  { cost: 16448495, autoPer: 90 },
  { cost: 19080254, autoPer: 91 },
  { cost: 22133095, autoPer: 92 },
  { cost: 25674390, autoPer: 93 },
  { cost: 29782292, autoPer: 94 },
  { cost: 34547459, autoPer: 95 },
  { cost: 40075053, autoPer: 96 },
  { cost: 46487061, autoPer: 97 },
  { cost: 53924991, autoPer: 98 },
  { cost: 62552990, autoPer: 99 },
  { cost: 72561469, autoPer: 100 },
];

// レアバナナ確率UP（0.1%ずつ、~1.65x ずつ、初期500）
const RARE_DATA = [
  { cost: 500, giantChance: 0.001 },
  { cost: 820, giantChance: 0.002 },
  { cost: 1360, giantChance: 0.003 },
  { cost: 2250, giantChance: 0.004 },
  { cost: 3700, giantChance: 0.005 },
  { cost: 6100, giantChance: 0.006 },
  { cost: 10000, giantChance: 0.007 },
  { cost: 16500, giantChance: 0.008 },
  { cost: 27000, giantChance: 0.009 },
  { cost: 44500, giantChance: 0.01 },
  { cost: 73500, giantChance: 0.011 },
  { cost: 121000, giantChance: 0.012 },
  { cost: 200000, giantChance: 0.013 },
  { cost: 330000, giantChance: 0.014 },
  { cost: 545000, giantChance: 0.015 },
  { cost: 900000, giantChance: 0.016 },
  { cost: 1480000, giantChance: 0.017 },
  { cost: 2450000, giantChance: 0.018 },
  { cost: 4040000, giantChance: 0.019 },
  { cost: 6670000, giantChance: 0.02 },
  { cost: 11000000, giantChance: 0.021 },
  { cost: 18150000, giantChance: 0.022 },
  { cost: 29950000, giantChance: 0.023 },
  { cost: 49400000, giantChance: 0.024 },
  { cost: 81500000, giantChance: 0.025 },
];

function buildClickUpgrades(data) {
  return data.map((item, i) => ({
    ...item,
    id: `click${i}`,
    label: `${item.clickPer}本/クリック`,
    group: 'click',
    requires: i === 0 ? null : `click${i - 1}`,
  }));
}

function buildAutoUpgrades(data) {
  return data.map((item, i) => ({
    ...item,
    id: `auto${i}`,
    label: `${item.autoPer}本/秒`,
    group: 'auto',
    requires: i === 0 ? null : `auto${i - 1}`,
  }));
}

function buildRareUpgrades(data) {
  return data.map((item, i) => ({
    ...item,
    id: `rare${i}`,
    label: `レア${(item.giantChance * 100).toFixed(1)}%`,
    group: 'rare',
    requires: i === 0 ? null : `rare${i - 1}`,
  }));
}

function buildBananaUpgrades(data) {
  return data.map((item, i) => ({
    ...item,
    id: `banana${i}`,
    label: BANANA_TIERS.find((t) => t.tier === item.tier)?.name ?? '',
    group: 'banana',
    requires: i === 0 ? null : `banana${i - 1}`,
  }));
}

export const CLICK_UPGRADES = buildClickUpgrades(CLICK_DATA);
export const BANANA_UPGRADES = buildBananaUpgrades(BANANA_DATA);
export const AUTO_UPGRADES = buildAutoUpgrades(AUTO_DATA);
export const RARE_UPGRADES = buildRareUpgrades(RARE_DATA);
