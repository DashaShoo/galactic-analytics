import { useRef } from 'react';
import styles from './UploadButton.module.css';

export const UploadButton = ({
  file = null,
  status = 'idle',
  onClick = () => {},
  mode = 'upload', // 'upload' или 'generate'
  'data-testid': testId
}) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.files?.[0]) {
      onClick();
    }
  };

  const renderContent = () => {
    if (status === 'parsing') {
      return (
        <div className={`${styles.button} ${styles.parsing}`} data-testid={testId}>
          <span className={styles.loader}>
            <img src="/images/Loading.svg" alt="Loading" />
          </span>
        </div>
      );
    }

    const buttonClass = [
      styles.button,
      file ? styles.filled : styles.empty,
      status === 'error' ? styles.error : '',
      status === 'success' ? styles.success : '',
    ].join(' ');

    if (mode === 'upload') {
      return (
        <div className={buttonClass} onClick={onClick} data-testid={testId}>
          <span>{file ? file.name : 'Загрузить файл'}</span>
        </div>
      );
    } else if (mode === 'generate') {
      return (
        <div className={buttonClass} onClick={onClick} data-testid={testId}>
          <span>{status === 'error' ? 'Ошибка' : status === 'success' ? 'Done!' : ''}</span>
        </div>
      );
    }
  };

  return (
    <div className={styles.wrapper}>
      {renderContent()}
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  );
};
