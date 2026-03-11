import styles from './EmptyState.module.css';

export const EmptyState: React.FC = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>💬</div>
      <h3>Начните новый диалог</h3>
      <p>Нажмите «Новый чат» для начала общения</p>
    </div>
  );
};