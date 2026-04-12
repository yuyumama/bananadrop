import { Store } from 'lucide-react';
import styles from './ShopButton.module.css';

export default function ShopButton({ banaCoins, onOpen }) {
  return (
    <button
      className={`glass-panel shop-button ${styles.root}`}
      aria-label={`ショップを開く。バナコイン残高: ${banaCoins}`}
      onClick={onOpen}
    >
      <img
        className={`shop-coin-icon ${styles.coinIcon}`}
        src={`${import.meta.env.BASE_URL}coin.png`}
        alt=""
      />

      <div className={styles.balanceColumn}>
        <span className={styles.balanceLabel}>バナコイン</span>
        <span className={`shop-coin-balance ${styles.balanceValue}`}>
          {banaCoins.toLocaleString()}
        </span>
      </div>

      <div className={`shop-divider ${styles.divider}`} aria-hidden="true" />

      <div className={`shop-label ${styles.shopIcon}`} aria-hidden="true">
        <Store size={18} strokeWidth={2} />
        <span className={styles.shopIconLabel}>Shop</span>
      </div>
    </button>
  );
}
