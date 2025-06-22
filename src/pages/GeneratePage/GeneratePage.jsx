import { Title } from '../../components/Title/Title';
import { Generator } from '../../components/Generator/Generator';

export const GeneratePage = () => {
  return (
    <div className="generate-page">
      <Title>Сгенерируйте готовый csv-файл нажатием одной кнопки</Title>
      <Generator />
    </div>
  );
};
