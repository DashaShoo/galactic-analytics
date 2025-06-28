import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Generator } from '../components/Generator/Generator';
import { vi } from 'vitest';

// создаём мок, который мы сможем переопределять в каждом тесте
const generateMock = vi.fn();

vi.mock('../hooks/useReportGenerator', () => ({
  useReportGenerator: () => ({
    generate: generateMock,
  }),
}));

describe('Генератор отчёта', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // очищаем мок перед каждым тестом
  });

  test('Изначально отображается кнопка "Начать генерацию"', () => {
    render(<Generator />);
    expect(screen.getByTestId('start-button')).toBeInTheDocument();
  });
  

  test('Если возникает ошибка при генерации, показывается сообщение об ошибке', async () => {
    generateMock.mockResolvedValueOnce({
      success: false,
      error: new Error('fail'),
    });

    render(<Generator />);

    fireEvent.click(screen.getByTestId('start-button'));

    await waitFor(() => {
      expect(screen.getByTestId('status-label')).toHaveTextContent(/упс, не то.../i);
    });
  });

  //реализовано в testplane
  // test('Кнопка "Очистить" сбрасывает состояние до начального', async () => {
  //   const blob = new Blob(['data'], { type: 'text/csv' });

  //   generateMock.mockResolvedValueOnce({
  //     success: true,
  //     filename: 'test.csv',
  //     blob,
  //   });

  //   render(<Generator />);

  //   fireEvent.click(screen.getByTestId('start-button'));

  //   await waitFor(() => {
  //     expect(screen.getByTestId('clear-button')).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getByTestId('clear-button'));

  //   expect(screen.getByTestId('start-button')).toBeInTheDocument();
  // });
});
