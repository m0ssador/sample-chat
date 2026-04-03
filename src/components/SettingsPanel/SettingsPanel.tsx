import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import styles from './SettingsPanel.module.css';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/authSlice';

interface SettingsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onToggle }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    onToggle();
    navigate('/login', { replace: true });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onToggle}>
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.panelTitle}>Настройки</h2>

        <ThemeToggle />

        <div className={styles.logoutRow}>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
