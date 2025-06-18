import { useRef } from 'react';
import styles from './UploadButton.module.css';

export const UploadButton = ({ file, status, onClick }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.files?.[0]) {
      onClick();
    }
  };

  const renderContent = () => {
    if (status === 'parsing') {
      return (
        <div className={`${styles.button} ${styles.parsing}`}>
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
      status === 'success' ? styles.success : ''
    ].join(' ');

    return (
      <div className={buttonClass} onClick={onClick}>
        <span>{file ? file.name : 'Загрузить файл'}</span>
      </div>
    );
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
