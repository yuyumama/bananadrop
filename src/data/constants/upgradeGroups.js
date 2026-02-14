import {
  CLICK_UPGRADES,
  BANANA_UPGRADES,
  AUTO_UPGRADES,
  RARE_UPGRADES,
} from '../upgrades';

export const UPGRADE_GROUPS = [
  {
    key: 'click',
    label: '🍌 クリック',
    defaultLabel: '1本/クリック',
    items: CLICK_UPGRADES,
  },
  {
    key: 'banana',
    label: '🌟 バナナ種',
    defaultLabel: '普通バナナのみ',
    items: BANANA_UPGRADES,
  },
  {
    key: 'auto',
    label: '⏰ オート',
    defaultLabel: '手動のみ',
    items: AUTO_UPGRADES,
  },
  {
    key: 'rare',
    label: '💫 レア',
    defaultLabel: 'レアなし',
    items: RARE_UPGRADES,
  },
];
