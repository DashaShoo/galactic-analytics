import styles from './Generator.module.css';
import { Button } from '../Button/Button';
import { UploadButton } from '../UploadButton/UploadButton';
import { ClearButton } from '../ClearButton/ClearButton';
import { StatusLabel } from '../StatusLabel/StatusLabel';
import { useState } from 'react';
import { useReportGenerator } from '../../hooks/useReportGenerator';

export const Generator = () => {
  const [status, setStatus] = useState('idle');
  const [generatedFile, setGeneratedFile] = useState(null);
  const { generate } = useReportGenerator();

  const handleSubmit = async () => {
    setStatus('parsing');
    const { success, filename, blob } = await generate();
    if (success) {
      const file = new File([blob], filename, { type: 'text/csv' });
      setGeneratedFile(file);
    }
    setStatus(success ? 'success' : 'error');
  };

  const handleClear = () => {
    setGeneratedFile(null);
    setStatus('idle');
  };

  return (
    <div className={styles.section}>
      {status === 'idle' && (
        <Button variant="default" onClick={handleSubmit} data-testid="start-button">
          Начать генерацию
        </Button>
      )}

      {(status === 'parsing' || status === 'success' || status === 'error') && (
        <div className={styles.uploadContainer}>
          <UploadButton status={status} file={generatedFile} mode="generate" data-testid="upload-button"/>

          {status !== 'parsing' && (
            <div className={styles.clearButtonWrapper}>
              <ClearButton onClick={handleClear} data-testid="clear-button"/>
            </div>
          )}
        </div>
      )}

      <StatusLabel status={status} mode="generate" file={null} />
    </div>
  );
};
