const HISTORY_KEY = 'csv_analytics_history';

export const getHistory = () => {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const saveToHistory = (fileData) => {
  const history = getHistory();
  history.unshift(fileData);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

export const removeFromHistory = (id) => {
  console.log('remove');
  const history = getHistory();
  const updatedHistory = history.filter((item) => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
};
