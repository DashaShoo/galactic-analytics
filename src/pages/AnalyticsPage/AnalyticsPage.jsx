import { Upload } from '../../components/Upload/Upload';
import { Title } from '../../components/Title/Title';
import styles from '../../components/Title/Title.module.css';
export const AnalyticsPage = () => {
  return (
    <div>
      <Title>
        Загрузите <span className={styles.highlight}>csv</span> файл и получите{' '}
        <span className={styles.highlight}>полную информацию</span> о нём за сверхнизкое время
      </Title>
      <Upload />
    </div>
  );
};
