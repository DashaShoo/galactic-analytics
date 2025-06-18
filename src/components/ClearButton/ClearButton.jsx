import styles from './ClearButton.module.css';

export const ClearButton = ({ onClick }) => {
  return (
    <button className={styles.clearButton} onClick={onClick}>
      <img src='/images/Cancel.svg'></img>
    </button>
  );
};