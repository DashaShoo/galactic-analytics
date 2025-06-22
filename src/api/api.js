export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('http://localhost:3000/aggregate?rows=10000', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Upload failed');
  return response;
};

export const generateReport = async (params = { size: 0.1, withErrors: true, maxSpend: 1000 }) => {
  const query = new URLSearchParams(params);
  const response = await fetch(`http://localhost:3000/report?${query}`);

  if (!response.ok) throw new Error('Generation failed');

  const contentDisposition = response.headers.get('content-disposition');
  const filename = contentDisposition?.split('filename=')[1] || 'report.csv';
  const blob = await response.blob();

  return { blob, filename };
};
