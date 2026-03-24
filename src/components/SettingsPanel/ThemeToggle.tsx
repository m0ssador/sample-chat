import React, { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('app-theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('app-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('app-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((v) => !v);
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
        Тёмная тема
      </span>
    </div>
  );
};

export default ThemeToggle;
