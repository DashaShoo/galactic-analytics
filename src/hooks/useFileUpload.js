import { uploadFile } from '../api/api';
import { useAppStore } from '../store/store';
import { saveToHistory } from '../services/history';

export const useFileUpload = () => {
  const { setStatus, setAnalyticsData } = useAppStore();

  const upload = async (file) => {
    setStatus('parsing');
    setAnalyticsData(null);

    let latestData = null;

    try {
      const response = await uploadFile(file);

      if (!response.ok || !response.body) {
        throw new Error('Server error or no response body');
      }

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
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            latestData = data;
            setAnalyticsData(data);
          } catch {
            setStatus('error');
          }
        }
      }

      if (buffer.trim() !== '') {
        try {
          const data = JSON.parse(buffer);
          latestData = data;
          setAnalyticsData(data);
        } catch {
          setStatus('error');
        }
      }

      setStatus('success');
      saveToHistory({
        id: Date.now(),
        date: new Date().toISOString(),
        fileName: file.name,
        status: 'success',
        analyticsData: latestData,
      });
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('error');
      saveToHistory({
        id: Date.now(),
        date: new Date().toISOString(),
        fileName: file.name,
        status: 'error',
        analyticsData: null,
      });
    }
  };

  return { upload };
};
