describe('История из localStorage отображается', function () {
  beforeEach(async function () {
    await this.browser.execute(() => {
      localStorage.setItem('csv_analytics_history', JSON.stringify([
        {
          id: '1',
          fileName: 'integration.csv',
          date: '2025.06.28',
          status: 'success',
          analyticsData: {
            total_spend_galactic: 123,
            rows_affected: 3,
            less_spent_at: '5',
            big_spent_civ: 'humans',
            less_spent_civ: 'blobs',
            big_spent_at: '2',
            big_spent_value: 45,
            average_spend_galactic: 41,
          },
        }
      ]));
    });

    await this.browser.url('/history');
  });

  afterEach(async function () {
    await this.browser.execute(() => {
      localStorage.removeItem('csv_analytics_history');
    });
  });

  it('отображает запись из localStorage', async function () {
    //ждем появления записи в истории
    const historyItem = await this.browser.$('[data-testid="history-item-1"]');
    await historyItem.waitForDisplayed({ timeout: 5000 });

    const fileNameEl = await this.browser.$('[data-testid="row-integration.csv"]');
    await fileNameEl.waitForDisplayed({ timeout: 5000 });

    const text = await fileNameEl.getText();
    if (!text.includes('integration.csv')) {
      throw new Error(`Ожидалось, что строка будет содержать "integration.csv", но получено: "${text}"`);
    }
  });
});
