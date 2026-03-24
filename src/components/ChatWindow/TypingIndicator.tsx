import React from 'react';
import styles from './TypingIndicator.module.css';

interface TypingIndicatorProps {
  isVisible?: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.typingContainer}>
      <span className={styles.typingDot}></span>
      <span className={styles.typingDot}></span>
      <span className={styles.typingDot}></span>
    </div>
  );
};

export default TypingIndicator;
