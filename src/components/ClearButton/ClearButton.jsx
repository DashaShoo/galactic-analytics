import styles from './ClearButton.module.css';

export const ClearButton = ({ mode = 'clear', onClick }) => {
  if (mode === 'clear') {
    return (
      <button className={styles.clearButton} onClick={onClick}>
        <img src="/images/Cancel.svg"></img>
      </button>
    );
  } else if (mode === 'delete') {
    return (
      <button className={styles.deleteButton} onClick={onClick}>
        <img src="/images/Trash.svg"></img>
      </button>
    );
  }
};
