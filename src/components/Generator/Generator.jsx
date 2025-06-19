import styles from "./Generator.module.css";
import { Button } from "../Button/Button";
import { UploadButton } from "../UploadButton/UploadButton";
import { ClearButton } from "../ClearButton/ClearButton";
import { StatusLabel } from "../StatusLabel/StatusLabel";
import { useState } from "react";

export const Generator = () => {
    const [status, setStatus] = useState('idle'); // 'idle', 'parsing', 'success', 'error'
    const [generatedFile, setGeneratedFile] = useState(null);

    const handleSubmit = async () => {
        setStatus('parsing');
        
        try {
            const response = await fetch('http://localhost:3000/report?size=0.1&withErrors&maxSpend=1000');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Получаем имя файла из headers
            const contentDisposition = response.headers.get('content-disposition');
            const filename = contentDisposition 
                ? contentDisposition.split('filename=')[1] 
                : 'report.csv';

            // Создаем blob из ответа
            const blob = await response.blob();
            const file = new File([blob], filename, { type: 'text/csv' });
            
            setGeneratedFile(file);
            setStatus('success');
            
            // Автоматическое скачивание
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

        } catch (error) {
            console.error('Ошибка генерации:', error);
            setStatus('error');
        }
    };

    const handleClear = () => {
        setGeneratedFile(null);
        setStatus('idle');
    };

    return (
        <div className={styles.section}>
            {status === 'idle' && (
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                >
                    Начать генерацию
                </Button>
            )}

            {(status === 'parsing' || status === 'success' || status === 'error') && (
                <div className={styles.uploadContainer}>
                    <UploadButton
                        status={status}
                        file={generatedFile}
                        mode = 'generate'
                    />
                    
                    {status !== 'parsing' && (
                        <div className={styles.clearButtonWrapper}>
                            <ClearButton onClick={handleClear} />
                        </div>
                    )}
                </div>
            )}

            <StatusLabel 
                status={status} 
                mode = 'generate'
                file={null}
            />
        </div>
    );
};