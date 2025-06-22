import { generateReport } from '../api/api';

export const useReportGenerator = () => {
  const generate = async () => {
    try {
      const { blob, filename } = await generateReport();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();

      return {
        success: true,
        filename,
        blob,
      };
    } catch (error) {
      console.error('Generation error:', error);
      return { success: false, error };
    }
  };

  return { generate };
};
