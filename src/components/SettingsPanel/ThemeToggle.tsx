import React, { useState } from 'react';
import styles from './ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div className={styles.themeToggle}>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={isDark}
          onChange={toggleTheme}
        />
        <span className={styles.slider}></span>
      </label>
      <span className={styles.label}>
        {isDark ? 'Тёмная тема' : 'Светлая тема'}
      </span>
    </div>
  );
};

export default ThemeToggle;
