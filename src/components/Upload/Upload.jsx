import { useRef, useState } from "react";
import styles from "./Upload.module.css";
import { UploadButton } from "../UploadButton/UploadButton";
import { Button } from "../Button/Button";
import { ClearButton } from '../ClearButton/ClearButton';

export const Upload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'parsing', 'success', 'error'
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setStatus('idle');
      } else {
        setStatus('error');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy"; // Показываем, что можно кинуть файл
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Чтобы не убирать подсветку, когда мышь на вложенных элементах, проверим:
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setStatus('idle');
      } else {
        setStatus('error');
      }
    }
  };

  const handleUploadClick = () => {
    inputRef.current.value = '';
    inputRef.current?.click();
  };

  const handleClearFile = () => {
    setFile(null);
    setStatus('idle');
  };

  const handleSubmit = async () => {
    if (!file) return;

    setStatus('parsing');

    try {
      // Эмуляция запроса к API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Сохраняем в историю
      const historyItem = {
        id: Date.now(),
        filename: file.name,
        date: new Date().toISOString(),
        status: 'success'
      };

      const history = JSON.parse(localStorage.getItem('uploadHistory') || '[]');
      localStorage.setItem('uploadHistory', JSON.stringify([...history, historyItem]));

      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  const getStatusText = () => {
    switch (status) {
        case 'parsing':
        return 'идёт парсинг файла';
        case 'success':
        return 'готово!';
        case 'error':
        return 'упс, не то...';
        default:
        return file ? 'файл загружен!' : 'или перетащите сюда';
    }
  };


  const dropZoneClass = `${styles.dropZone} ${
    isDragging ? styles.dragging :
    file ? styles.fileLoaded :
    status === 'error' ? styles.error : ''
  }`;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Загрузите <span className={styles.highlight}>csv</span> файл и получите <span className={styles.highlight}>полную информацию</span> о нём за сверхнизкое время
      </h2>

      <div
        className={dropZoneClass}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className={styles.uploadContainer}>
            <UploadButton
                file={file}
                status={status}
                onClick={handleUploadClick}
            />
            {file && (
                <div className={styles.clearButtonWrapper}>
                <ClearButton onClick={handleClearFile} />
                </div>
            )}
        </div>
        <p className={`${styles.statusText} ${status === 'error' ? styles.errorText : ''}`}>
            {getStatusText()}
        </p>


        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {status !== 'parsing' && status !== 'success' && (
        <Button
          variant={status === 'success' ? 'success' : 'primary'}
          disabled={!file || status === 'error'}
          onClick={handleSubmit}
        >
          Отправить
        </Button>
      )}
    </section>
  );
};
