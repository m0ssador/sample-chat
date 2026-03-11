import React, { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  // Проверяем сохранённую тему при загрузке компонента
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDark(false);
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('app-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('app-theme', 'light');
    }
  };

  return (
    <div className={styles.themeToggle}>
      <span className={`${styles.icon} ${isDark ? styles.dark : ''}`}>
        {isDark ? '🌙' : '☀️'}
      </span>
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
