import styles from './Button.module.css';

export const Button = ({ children, variant = 'default', disabled = false, onClick }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${disabled ? styles.disabled : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
