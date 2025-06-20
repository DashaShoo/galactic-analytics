import styles from "./HistoryRow.module.css";

export const HistoryRow = ({ fileName, date, status }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    return (
        <div className={styles.row}>
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
    );
};