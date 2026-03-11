import React from 'react';
import ThemeToggle from './ThemeToggle';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Настройки</h2>
        
        <div className={styles.setting}>
          <label>Модель</label>
          <select>
            <option>GigaChat</option>
            <option>GigaChat-Plus</option>
            <option>GigaChat-Pro</option>
            <option>GigaChat-Max</option>
          </select>
        </div>

        <div className={styles.setting}>
          <label>Temperature (0–2)</label>
          <input type="range" min="0" max="2" step="0.1" />
        </div>

        <div className={styles.setting}>
          <label>Top-P (0–1)</label>
          <input type="range" min="0" max="1" step="0.05" />
        </div>

        <div className={styles.setting}>
          <label>Max Tokens</label>
          <input type="number" min="1" max="4096" value="2048" />
        </div>

        <div className={styles.setting}>
          <label>System Prompt</label>
          <textarea rows={4} placeholder="Введите системный промпт..." />
        </div>

        <ThemeToggle />

        <div className={styles.buttons}>
          <button className={styles.resetButton}>Сбросить</button>
          <button className={styles.saveButton}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
