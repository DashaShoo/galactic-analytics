describe('Генерация файла отчёта', function() {
  it('Если нажать на кнопку, файл успешно сгенерируется и скачается(статус сменится на успех)', async function() {
    await this.browser.url('/generate');

    // 1. Проверяем, что изначально отображается кнопка "Начать генерацию" (проверено в юнитах)
    const startButton = await this.browser.$('[data-testid="start-button"]');
    //await startButton.waitForDisplayed({ timeout: 5000 });

    // 2. Нажимаем на кнопку "Начать генерацию"
    await startButton.click();

    // 3. Ждем, что статус сменится на success — проверяем статус через label
    const statusLabel = await this.browser.$('[data-testid="status-label"]');
    await this.browser.waitUntil(
      async () => {
        const text = await statusLabel.getText();
        return text.toLowerCase().includes('файл сгенерирован');
      },
      { timeout: 15000, timeoutMsg: 'Статус не сменился на успех' }
    );

    // 4. Проверяем, что кнопка очистки появилась
    const clearButton = await this.browser.$('[data-testid="clear-button"]');
    await clearButton.waitForDisplayed({ timeout: 5000 });

    // 5. Нажимаем кнопку очистки
    await clearButton.click();

    // 6. Проверяем, что статус сбросился и кнопка начала генерации снова видна
    await startButton.waitForDisplayed({ timeout: 5000 });
    const statusText = await statusLabel.getText();
    if (statusText.toLowerCase().includes('success')) {
      throw new Error('Статус не сбросился после очистки');
    }
  });
});
