import { useRef, useState } from "react";
import styles from "./Upload.module.css";
import { UploadButton } from "../UploadButton/UploadButton";
import { Button } from "../Button/Button";
import { ClearButton } from '../ClearButton/ClearButton';
import { AnalyticsTable } from '../AnalyticsTable/AnalyticsTable'

export const Upload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'parsing', 'success', 'error'
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const [analyticsData, setAnalyticsData] = useState(null);

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
    setAnalyticsData(null);
  };

   const handleSubmit = async () => {
    if (!file) return;

    setStatus('parsing');
    setAnalyticsData(null);
    console.log('Начинаем потоковую агрегацию...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3000/aggregate?rows=10000', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      if (!response.body) throw new Error('ReadableStream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          try {
            const data = JSON.parse(line);
            console.log('Получены данные:', data);
            setAnalyticsData(data); // Обновляем данные для таблицы
          } catch (e) {
            setStatus('error');
            console.warn('Ошибка парсинга:', e);
          }
        }
      }

      if (buffer.trim() !== '') {
        try {
          const data = JSON.parse(buffer);
          console.log('Финальные данные:', data);
          setAnalyticsData(data); // Финализируем данные
        } catch (e) {
          setStatus('error');
          console.warn('Ошибка парсинга финальных данных:', e);
        }
      }

      setStatus('success');
    } catch (error) {
      console.error('Ошибка:', error);
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
            {file && status !== 'parsing' &&(
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

      <AnalyticsTable data={analyticsData}/>
    </section>
  );
};
