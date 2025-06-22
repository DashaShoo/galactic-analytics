import { useState, useEffect } from 'react';
import { getHistory, removeFromHistory, clearHistory } from '../../services/history';
import { HistoryRow } from '../../components/HistoryRow/HistoryRow';
import { ClearButton } from '../../components/ClearButton/ClearButton';
import styles from './History.module.css';
import { Button } from '../Button/Button';
import { Link } from 'react-router-dom';

export const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDelete = (id) => {
    const updatedHistory = removeFromHistory(id);
    setHistory(updatedHistory);
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className={styles.section}>
      {history.length > 0 && (
        <div className={styles.history}>
          {history.map((item) => (
            <div className={styles.row} key={item.id}>
              <HistoryRow
                fileName={item.fileName}
                date={item.date}
                status={item.status}
                data={item.analyticsData}
              />
              <ClearButton mode="delete" onClick={() => handleDelete(item.id)} />
            </div>
          ))}
        </div>
      )}

      <div className={styles.buttons}>
        <Link to="/generate">
          <Button variant="default">Сгенерировать больше</Button>
        </Link>

        {history.length > 0 && (
          <Button variant="primary" onClick={handleClearAll}>
            Очистить всё
          </Button>
        )}
      </div>
    </div>
  );
};
