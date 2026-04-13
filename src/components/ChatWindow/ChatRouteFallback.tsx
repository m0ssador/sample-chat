import React from 'react';
import styles from './ChatRouteFallback.module.css';

export default function ChatRouteFallback() {
  return (
    <div className={styles.root} role="status" aria-live="polite">
      Загрузка окна чата…
    </div>
  );
}
