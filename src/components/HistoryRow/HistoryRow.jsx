import { Modal } from "../Modal/Modal";
import { useState} from 'react';
import styles from "./HistoryRow.module.css";
import { AnalyticsRow } from "../AnalyticsRow/AnalyticsRow";

export const HistoryRow = ({ fileName, date, status, data=null }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className={styles.row} onClick={() => setIsModalOpen(true)}>
                <div className={styles.container}>
                    <img className={styles.fileIcon} src="/images/File.svg" alt="File icon" />
                    <div className={styles.fileName}>{fileName}</div>
                </div>
                <div className={styles.fileDate}>{formatDate(date)}</div>
                <div className={`${styles.container} ${status !== 'success' ? styles.opacity : ''}`}>
                    Обработан успешно <img className={styles.smile} src="/images/Success.svg" alt="Success" />
                </div>
                <div className={`${styles.container} ${status === 'success' ? styles.opacity : ''}`}>
                    Не удалось обработать <img className={styles.smile} src="/images/Sad.svg" alt="Error" />
                </div>
            </div>
            {status === 'success' && data && 
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div>
                    <div className={styles.modalContainer}>
                          <AnalyticsRow mode="history"
                            title="общие расходы в галактических кредитах" 
                            value={Math.round(data.total_spend_galactic)} 
                          />
                          <AnalyticsRow mode="history"
                            title="количество обработанных записей" 
                            value={data.rows_affected} 
                          />
                          <AnalyticsRow mode="history"
                            title="день года с минимальными расходами" 
                            value={data.less_spent_at} 
                            isDay
                          />
                          <AnalyticsRow mode="history"
                            title="цивилизация с максимальными расходами" 
                            value={data.big_spent_civ} 
                          />
                          <AnalyticsRow mode="history"
                            title="цивилизация с минимальными расходами" 
                            value={data.less_spent_civ} 
                          />
                          <AnalyticsRow mode="history"
                            title="день года с максимальными расходами" 
                            value={data.big_spent_at} 
                            isDay
                          />
                          <AnalyticsRow mode="history"
                            title="максимальная сумма расходов за день" 
                            value={Math.round(data.big_spent_value)} 
                          />
                          <AnalyticsRow mode="history"
                            title="средние расходы в галактических кредитах" 
                            value={Math.round(data.average_spend_galactic)} 
                          />
                    </div>
                </div>
            </Modal>}
        </>
    );
};