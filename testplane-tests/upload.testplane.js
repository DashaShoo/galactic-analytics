const path = require('path');

describe('Постепенная загрузка данных', function () {
    it('Данные приходят частями, и по окончании складывается итоговая запись в историю', async function () {
        await this.browser.url('/');

        // 1. Подготавливаем input (потому что по умолчанию у меня он display:none и тест не работает(( )
        const fileInput = await this.browser.$('[data-testid="file-input"]');
        await this.browser.execute((el) => el.style.display = 'block', fileInput);

        const filePath = path.resolve(__dirname, './fixtures/test.csv');
        await fileInput.setValue(filePath);

        // 2. Отправляем файл
        const submitButton = await this.browser.$('[data-testid="submit-button"]');
        await submitButton.click();

        // 3. Отслеживаем изменения значения во времени (отследить постепенное получение и обновление данных)
        const values = [];
        const startTime = Date.now();

        await this.browser.waitUntil(
            async () => {
                const element = await this.browser.$('[data-testid="row-total-spend"]');
                const isVisible = await element.isDisplayed();
                if (isVisible) {
                    const text = await element.getText();
                    const numeric = parseInt(text, 10);
                    if (!isNaN(numeric)) {
                        const last = values[values.length - 1];
                        if (!last || last.value !== numeric) {
                            values.push({ time: Date.now() - startTime, value: numeric });
                        }
                    }
                }

                const statusLabel = await this.browser.$('[data-testid="status-label"]');
                const statusText = await statusLabel.getText();
                return statusText.includes('готово');
            },
            {
                timeout: 60000,
                interval: 1000,
                timeoutMsg: 'Финальный статус не появился',
            }
        );

        // 4. Проверка постепенной загрузки
        if (values.length < 2) {
            throw new Error(`Значение обновилось только ${values.length} раз. Ожидалась постепенная загрузка.`);
        }

        // 5. Проверка сохранения в историю
        const historyItems = await this.browser.execute(() => 
            JSON.parse(localStorage.getItem('csv_analytics_history') || '[]')
        );
        
        const lastHistoryItem = historyItems[historyItems.length - 1];
        
        if (!lastHistoryItem) {
            throw new Error('Запись в истории не найдена');
        }
        if (lastHistoryItem.fileName !== 'test.csv') {
            throw new Error(`Неверное имя файла в истории: ${lastHistoryItem.fileName}, ожидалось test.csv`);
        }
        if (lastHistoryItem.status !== 'success') {
            throw new Error(`Неверный статус в истории: ${lastHistoryItem.status}, ожидалось success`);
        }
        if (!lastHistoryItem.analyticsData) {
            throw new Error('Отсутствуют данные аналитики в истории');
        }
        if (!lastHistoryItem.date) {
            throw new Error('Отсутствует дата в истории');
        }
    });
});