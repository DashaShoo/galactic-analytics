import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { History } from '../components/History/History';
import * as historyService from '../services/history';

const mockHistory = [
  {
    id: '1',
    fileName: 'test.csv',
    date: new Date().toISOString(),
    status: 'success',
    analyticsData: {
      total_spend_galactic: 1000,
      rows_affected: 10,
      less_spent_at: '42',
      big_spent_civ: 'humans',
      less_spent_civ: 'monsters',
      big_spent_at: '13',
      big_spent_value: 500,
      average_spend_galactic: 100,
    },
  },
  {
    id: '2',
    fileName: 'bad.csv',
    date: new Date().toISOString(),
    status: 'error',
    analyticsData: null,
  },
];

describe('История загрузок, хранимая в LocalStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Если история пустая, ее компонент и кнопка "очистить все" не отобразится', () => {
    vi.spyOn(historyService, 'getHistory').mockReturnValue([]);

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('history-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('clear-all')).not.toBeInTheDocument();
  });



  test('Если история непустая, ее компонент и кнопка "очистить все" отобразится', () => {
    vi.spyOn(historyService, 'getHistory').mockReturnValue(mockHistory);

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    expect(screen.getByTestId('history-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('history-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('clear-all')).toBeInTheDocument();
  });


  test('Если нажать на кнопку удаления записи, она удалится, а другие останутся', () => {
      vi.spyOn(historyService, 'getHistory').mockReturnValue(mockHistory);
      const removeSpy = vi
        .spyOn(historyService, 'removeFromHistory')
        .mockImplementation((idToRemove) => mockHistory.filter((item) => item.id !== idToRemove));

      render(
        <MemoryRouter>
            <History />
        </MemoryRouter>
      );

        //проверяем наличие обеих записей
      expect(screen.getByTestId('history-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('history-item-2')).toBeInTheDocument();

        //удаляем первую
      fireEvent.click(screen.getByTestId('delete-1'));
      expect(removeSpy).toHaveBeenCalledWith('1');

        //удалённой записи быть не должно
      expect(screen.queryByTestId('history-item-1')).not.toBeInTheDocument();

        //остальные записи должны остаться
      expect(screen.getByTestId('history-item-2')).toBeInTheDocument();
    });


  test('Если нажать на кнопку "Очистить всё", вся история будет удалена', () => {
    const clearSpy = vi.spyOn(historyService, 'clearHistory').mockImplementation(() => {});
    vi.spyOn(historyService, 'getHistory').mockReturnValue(mockHistory);

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('clear-all'));

    expect(clearSpy).toHaveBeenCalled();
  });

  test('Если запись успешная, при клике откроется модальное окно', () => {
    vi.spyOn(historyService, 'getHistory').mockReturnValue(mockHistory);

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('row-test.csv'));

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  test('Если запись неуспешная, при клике не откроется модальное окно', () => {
    vi.spyOn(historyService, 'getHistory').mockReturnValue(mockHistory);

    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('row-bad.csv'));

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

});
