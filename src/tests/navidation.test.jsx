import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';

describe('Навигация для перемещения между разделами', () => {
  test('Страница аналитики по адресу "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('analytics-page')).toBeInTheDocument();
  });

  test('Страница генерации по адресу "/generate"', () => {
    render(
      <MemoryRouter initialEntries={['/generate']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('generate-page')).toBeInTheDocument();
  });

  test('Страница истории по адресу "/history"', () => {
    render(
      <MemoryRouter initialEntries={['/history']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId('history-page')).toBeInTheDocument();
  });

  test('Если нажать на кнопку "CSV Аналитик" в шапке, то переместишься на страницу аналитики', async () => {
    render(
      <MemoryRouter initialEntries={['/generate']}>
        <App />
      </MemoryRouter>
    );

    await fireEvent.click(screen.getByTestId('link-analytics'));
    expect(screen.getByTestId('analytics-page')).toBeInTheDocument();
  });

  test('Если нажать на кнопку "CSV Генератор" в шапке, то переместишься на страницу генерации', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await fireEvent.click(screen.getByTestId('link-generate'));
    expect(screen.getByTestId('generate-page')).toBeInTheDocument();
  });

  test('Если нажать на кнопку "История" в шапке, то переместишься на страницу истории', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await fireEvent.click(screen.getByTestId('link-history'));
    expect(screen.getByTestId('history-page')).toBeInTheDocument();
  });

  test('Если нажать на кнопку "Сгенерировать больше" на странице истории, то переместишься на страницу генерации', async () => {
    render(
        <MemoryRouter initialEntries={['/history']}>
        <App />
        </MemoryRouter>
    );

    await fireEvent.click(screen.getByTestId('redirect-button'));

    expect(screen.getByTestId('generate-page')).toBeInTheDocument();
    });

});

