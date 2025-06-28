import styles from './AnalyticsRow.module.css';

const dayToDate = (day) => {
  const date = new Date(2023, 0);
  date.setDate(date.getDate() + day);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
};

export const AnalyticsRow = ({ title, value, isDay = false, mode = 'table', 'data-testid': testId }) => {
  const displayValue = isDay ? dayToDate(value) : value;
  if (mode === 'table') {
    return (
      <div className={styles.row} data-testid={testId}>
        <div className={styles.value}>{displayValue}</div>
        <div className={styles.title}>{title}</div>
      </div>
    );
  } else if (mode === 'history') {
    return (
      <div className={styles.historyRow} data-testid={testId}>
        <div className={styles.value}>{displayValue}</div>
        <div className={styles.title}>{title}</div>
      </div>
    );
  }
};
