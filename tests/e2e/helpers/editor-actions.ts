import { Page, expect } from '@playwright/test';

export class EditorActions {
  constructor(private page: Page) {}

  async switchLanguage(language: string) {
    // Open language dropdown
    const languageButton = this.page.locator('[data-testid="language-selector"]');
    await expect(languageButton).toBeVisible();
    await languageButton.click();

    // Wait for dropdown to appear
    await this.page.waitForSelector('[data-testid="language-dropdown"]');

    // Select target language
    const languageOption = this.page.locator(`[data-testid="language-option-${language}"]`);
    await expect(languageOption).toBeVisible();
    await languageOption.click();

    // Wait for editor to reload with new language
    await this.page.waitForTimeout(2000);
  }

  async insertSolution(code: string) {
    // Wait for Monaco editor to be ready
    await this.page.waitForSelector('.monaco-editor', { state: 'visible' });

    // Click in the editor content area to focus
    await this.page.locator('.monaco-editor .view-lines').click();
    await this.page.waitForTimeout(500);

    // Select all and delete existing content
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Delete');
    await this.page.waitForTimeout(300);

    // Type the solution character by character for reliability
    await this.page.keyboard.type(code, { delay: 10 });

    // Wait for content to stabilize
    await this.page.waitForTimeout(1000);
  }

  async executeCode() {
    const runButton = this.page.locator('[data-testid="run-code-button"]');
    await expect(runButton).toBeVisible();
    await expect(runButton).not.toBeDisabled();

    await runButton.click();

    // Wait for execution to complete (max 10 seconds)
    await this.page.waitForSelector('[data-testid="test-results-container"]', { timeout: 10000 });
  }

  async closeEditor() {
    const closeButton = this.page.locator('[data-testid="close-panel-button"]');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  private getLanguageLabel(language: string): string {
    const labels: Record<string, string> = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'go': 'Go',
      'rust': 'Rust'
    };
    return labels[language] || language;
  }
}
