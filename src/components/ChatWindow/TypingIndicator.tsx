import React from 'react';
import styles from './TypingIndicator.module.css';

interface TypingIndicatorProps {
  isVisible?: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.indicator}>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
      <span className={styles.dot}></span>
    </div>
  );
};

export default TypingIndicator;
