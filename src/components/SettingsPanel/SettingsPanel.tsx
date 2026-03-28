import React from 'react';
import ThemeToggle from './ThemeToggle';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onToggle }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onToggle}>
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.panelTitle}>Настройки</h2>

        <ThemeToggle />

      </div>
    </div>
  );
};

export default SettingsPanel;
