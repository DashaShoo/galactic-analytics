import styles from "./AnalyticsTable.module.css"
import { AnalyticsRow } from '../AnalyticsRow/AnalyticsRow';

export const AnalyticsTable = ({ data }) => {
  if (!data) return (
  <div className={styles.container_empty}>
    <p className={styles.placeholder}>Здесь<br></br>появятся хайлайты</p>
  </div>);

  return (
    <div className={styles.container}>
      <AnalyticsRow 
        title="общие расходы в галактических кредитах" 
        value={Math.round(data.total_spend_galactic)} 
      />
      <AnalyticsRow 
        title="количество обработанных записей" 
        value={data.rows_affected} 
      />
      <AnalyticsRow 
        title="день года с минимальными расходами" 
        value={data.less_spent_at} 
        isDay
      />
      <AnalyticsRow 
        title="цивилизация с максимальными расходами" 
        value={data.big_spent_civ} 
      />
      <AnalyticsRow 
        title="цивилизация с минимальными расходами" 
        value={data.less_spent_civ} 
      />
      <AnalyticsRow 
        title="день года с максимальными расходами" 
        value={data.big_spent_at} 
        isDay
      />
      <AnalyticsRow 
        title="максимальная сумма расходов за день" 
        value={Math.round(data.big_spent_value)} 
      />
      <AnalyticsRow 
        title="средние расходы в галактических кредитах" 
        value={Math.round(data.average_spend_galactic)} 
      />
    </div>
  );
};