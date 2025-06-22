import { useRef } from 'react';
import styles from './Upload.module.css';
import { UploadButton } from '../UploadButton/UploadButton';
import { Button } from '../Button/Button';
import { ClearButton } from '../ClearButton/ClearButton';
import { AnalyticsTable } from '../AnalyticsTable/AnalyticsTable';
import { StatusLabel } from '../StatusLabel/StatusLabel';
import { saveToHistory } from '../../services/history';
import { useAppStore } from '../../store/store';
import { useFileUpload } from '../../hooks/useFileUpload';

export const Upload = () => {
  const {
    file,
    setFile,
    analyticsData,
    status,
    setStatus,
    isDragging,
    setIsDragging,
    resetUploadState,
  } = useAppStore();

  const inputRef = useRef(null);
  const { upload } = useFileUpload();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setStatus('idle');
      } else {
        setFile(droppedFile);
        setStatus('error');
        saveToHistory({
          id: Date.now(),
          fileName: droppedFile.name,
          date: new Date().toISOString(),
          status: 'error',
          analyticsData: null,
        });
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
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
    resetUploadState();
  };

  const handleSubmit = async () => {
    if (!file) return;
    await upload(file);
  };

  const dropZoneClass = `${styles.dropZone} ${
    isDragging ? styles.dragging : file ? styles.fileLoaded : status === 'error' ? styles.error : ''
  }`;

  return (
    <section className={styles.section}>
      <div
        className={dropZoneClass}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className={styles.uploadContainer}>
          <UploadButton file={file} status={status} onClick={handleUploadClick} mode="upload" />
          {file && status !== 'parsing' && (
            <div className={styles.clearButtonWrapper}>
              <ClearButton onClick={handleClearFile} />
            </div>
          )}
        </div>

        <StatusLabel status={status} mode="upload" file={file} />

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {status !== 'parsing' && status !== 'success' && (
        <Button variant="default" disabled={!file || status === 'error'} onClick={handleSubmit}>
          Отправить
        </Button>
      )}

      <AnalyticsTable data={analyticsData} />
    </section>
  );
};
