import { Page, expect } from '@playwright/test';

export class ChatActions {
  constructor(private page: Page) {}

  async navigateToDemoChat() {
    await this.page.goto('/demo-chat');
    await this.page.waitForLoadState('networkidle');
  }

  async triggerDSAProblem() {
    const chatInput = this.page.locator('[data-testid="chat-input"]');
    await expect(chatInput).toBeVisible();

    await chatInput.fill('give me a dsa problem');
    await chatInput.press('Enter');

    // Wait for assistant response with problem card
    await this.page.waitForSelector('[data-testid="problem-card"]', {
      timeout: 10000
    });
  }

  async openMonacoEditor() {
    const openEditorButton = this.page.locator('[data-testid="open-editor-button"]');
    await expect(openEditorButton).toBeVisible();
    await openEditorButton.click();

    // Wait for editor panel to fully load
    await this.page.waitForSelector('.monaco-editor', { timeout: 15000 });
  }
}
