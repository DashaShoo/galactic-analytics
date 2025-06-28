import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Upload } from '../components/Upload/Upload';
import { useAppStore } from '../store/store';

//мокируем хранилище
vi.mock('../store/store');

//создаем мок для хука useFileUpload
const mockUpload = vi.fn();
vi.mock('../hooks/useFileUpload', () => ({
  useFileUpload: vi.fn(() => ({
    upload: mockUpload
  }))
}));

//мок CSV-файла
const mockCSVFile = new File(
  ['id,civ,developer_id,date,spend\n1,humans,4342405056669,79,324\n2,humans,3825702045536,313,265'], 
  'test.csv', 
  { type: 'text/csv' }
);

describe('Компонент Upload', () => {
  beforeEach(() => {
    //сбрасываем моки перед каждым тестом
    vi.clearAllMocks();
    
    //мок useAppStore
    useAppStore.mockReturnValue({
      file: null,
      status: 'idle',
      isDragging: false,
      setFile: vi.fn(),
      setStatus: vi.fn(),
      setIsDragging: vi.fn(),
      resetUploadState: vi.fn(),
      analyticsData: null,
    });

    //сбрасываем мок upload
    mockUpload.mockReset();
  });

  test('Дроп-зона корректно отображается', () => {
    render(<Upload />);
    const dropZone = screen.getByTestId('drop-zone');
    expect(dropZone).toBeInTheDocument();
  });


  test('Если случилась ошибка, кнопка отправки заблокирована', () => {
    useAppStore.mockReturnValueOnce({ 
      ...useAppStore(), 
      file: mockCSVFile, 
      status: 'error' 
    });

    render(<Upload />);
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });



  test('Если файла нет, кнопка отправки заблокирована', async () => {
    useAppStore.mockReturnValueOnce({
      ...useAppStore(),
      file: null,
      status: 'idle'
    });

    render(<Upload />);
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });



  test('Если файл неподдерживаемого формата, он будет отклонен', () => {
    const setFileMock = vi.fn();
    const badFile = new File(['...'], 'bad.txt', { type: 'text/plain' });

    useAppStore.mockReturnValueOnce({ ...useAppStore(), setFile: setFileMock });

    render(<Upload />);
    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [badFile] } });

    expect(setFileMock).not.toHaveBeenCalled();
  });



  test('Drag-and-drop файла', () => {
    const setIsDraggingMock = vi.fn();
    useAppStore.mockReturnValueOnce({ ...useAppStore(), setIsDragging: setIsDraggingMock });

    render(<Upload />);
    const dropZone = screen.getByTestId('drop-zone');

    fireEvent.dragEnter(dropZone);
    expect(setIsDraggingMock).toHaveBeenCalledWith(true);

    fireEvent.dragLeave(dropZone);
    expect(setIsDraggingMock).toHaveBeenCalledWith(false);
  });


  test('Если нажать на кнопку очищения, загруженный файл будет удален и интерфейс сбросится', () => {
    const resetUploadStateMock = vi.fn();
    useAppStore.mockReturnValueOnce({
      ...useAppStore(),
      file: mockCSVFile,
      status: 'idle',
      resetUploadState: resetUploadStateMock,
    });

    render(<Upload />);
    const clearButton = screen.getByTestId('clear-button');
    fireEvent.click(clearButton);

    expect(resetUploadStateMock).toHaveBeenCalled();
    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
  });


  test('Если дропнуть файл неподдерживаемого формата, будет показана ошибка', () => {
    const setFileMock = vi.fn();
    const setStatusMock = vi.fn();
    const badFile = new File(['test'], 'file.txt', { type: 'text/plain' });

    useAppStore.mockReturnValueOnce({
      ...useAppStore(),
      setFile: setFileMock,
      setStatus: setStatusMock,
    });

    render(<Upload />);
    const dropZone = screen.getByTestId('drop-zone');
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [badFile],
      },
    });

    expect(setFileMock).toHaveBeenCalledWith(badFile);
    expect(setStatusMock).toHaveBeenCalledWith('error');
  });



  test('Если аналитики нет, отображается плейсхолдер', () => {
    useAppStore.mockReturnValueOnce({
      ...useAppStore(),
      analyticsData: null,
    });

    render(<Upload />);
    expect(screen.getByTestId('placeholder')).toBeInTheDocument();
  });



  test('Если файл обработался, отображаются строчки аналитики', () => {
    useAppStore.mockReturnValueOnce({
      ...useAppStore(),
      analyticsData: {
        total_spend_galactic: 1500,
        rows_affected: 2,
        less_spent_at: 40,
        big_spent_civ: 'humans',
        less_spent_civ: 'robots',
        big_spent_at: 200,
        big_spent_value: 999,
        average_spend_galactic: 750,
      },
    });

    render(<Upload />);

    expect(screen.getByTestId('row-total-spend')).toBeInTheDocument();
    expect(screen.getByTestId('row-rows-affected')).toBeInTheDocument();
    expect(screen.getByTestId('row-less-spent-at')).toBeInTheDocument();
    expect(screen.getByTestId('row-big-spent-civ')).toBeInTheDocument();
    expect(screen.getByTestId('row-less-spent-civ')).toBeInTheDocument();
    expect(screen.getByTestId('row-big-spent-at')).toBeInTheDocument();
    expect(screen.getByTestId('row-big-spent-value')).toBeInTheDocument();
    expect(screen.getByTestId('row-average-spend')).toBeInTheDocument();
  });


  test('Если файл сейчас обрабатывается, отображается значок загрузки', () => {
    useAppStore.mockReturnValue({
      file: mockCSVFile,
      status: 'parsing',
      analyticsData: null,
      setFile: vi.fn(),
      setStatus: vi.fn(),
      setIsDragging: vi.fn(),
      resetUploadState: vi.fn(),
    });

    render(<Upload />);

    //кнопка UploadButton показывает лоадер
    const uploadButton = screen.getByTestId('upload-button');
    expect(uploadButton.querySelector('img[alt="Loading"]')).toBeInTheDocument();

    //кнопка "Отправить" не должна отображаться во время parsing
    expect(screen.queryByTestId('submit-button')).not.toBeInTheDocument();
  });

});