import styles from './Alert.module.css';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export function Alert({ type = 'info', message, onClose }: AlertProps) {
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button onClick={onClose} className={styles.closeBtn}>
          ×
        </button>
      )}
    </div>
  );
}
