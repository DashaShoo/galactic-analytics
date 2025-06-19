import styles from "./StatusLabel.module.css";

export const StatusLabel = ({ 
  status,
  mode = 'upload',
  file = null,
  customTexts = {}
}) => {
  const defaultTexts = {
    upload: {
      idle: 'или перетащите сюда',
      parsing: 'идёт парсинг файла',
      success: 'готово!',
      error: 'упс, не то...',
      fileLoaded: 'файл загружен!'
    },
    generate: {
      idle: '',
      parsing: 'идёт процесс генерации',
      success: 'файл сгенерирован!',
      error: 'упс, не то...'
    }
  };

  const getStatusText = () => {
    const texts = { ...defaultTexts[mode], ...customTexts };
    
    // Для режима загрузки: если есть файл и статус idle, показываем "файл загружен"
    if (mode === 'upload' && file && status === 'idle') {
      return texts.fileLoaded;
    }
    
    // Во всех остальных случаях используем стандартные тексты
    return texts[status] || texts.idle;
  };

  return (
    <p className={`${styles.statusText} ${status === 'error' ? styles.errorText : ''}`}>
      {getStatusText()}
    </p>
  );
};