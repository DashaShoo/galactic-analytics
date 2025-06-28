import styles from './ClearButton.module.css';

export const ClearButton = ({ mode = 'clear', onClick, 'data-testid': testId}) => {
  if (mode === 'clear') {
    return (
      <button className={styles.clearButton} onClick={onClick} data-testid={testId}>
        <img src="/images/Cancel.svg"></img>
      </button>
    );
  } else if (mode === 'delete') {
    return (
      <button className={styles.deleteButton} onClick={onClick} data-testid={testId}>
        <img src="/images/Trash.svg"></img>
      </button>
    );
  }
};
