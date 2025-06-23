import { Page, expect } from '@playwright/test';

export interface ValidationOptions {
  expectedPasses: number;
  maxExecutionTime?: number;
}

export class ExecutionValidator {
  constructor(private page: Page) {}

  async validateResults(options: ValidationOptions) {
    const { expectedPasses, maxExecutionTime = 10000 } = options;

    // Wait for execution to complete
    await this.page.waitForSelector('[data-testid="test-results-container"]', { timeout: 15000 });

    // Check if execution had errors and fail gracefully with details
    const hasErrors = await this.hasExecutionErrors();
    if (hasErrors) {
      const errorText = await this.getExecutionError();
      throw new Error(`Code execution failed: ${errorText}`);
    }

    // Validate test case results
    await this.validateTestCases(expectedPasses);

    // Validate execution time if specified
    if (maxExecutionTime) {
      await this.validateExecutionTime(maxExecutionTime);
    }
  }

  private async hasExecutionErrors(): Promise<boolean> {
    const errorElement = this.page.locator('.bg-red-900\\/30');
    return await errorElement.isVisible();
  }

  private async getExecutionError(): Promise<string> {
    const errorElement = this.page.locator('.bg-red-900\\/30 pre');
    return await errorElement.textContent() || 'Unknown execution error';
  }

  private async validateTestCases(expectedPasses: number) {
    const testCases = this.page.locator('[data-testid="test-cases-list"] > [data-testid^="test-case-"]');
    await expect(testCases).toHaveCount(expectedPasses);

    // Verify all test cases passed
    for (let i = 0; i < expectedPasses; i++) {
      const testCase = testCases.nth(i);
      const passedIndicator = testCase.locator(':has-text("✅ Passed")');
      await expect(passedIndicator).toBeVisible();
    }
  }

  private async validateExecutionTime(maxTime: number) {
    const timeIndicator = this.page.locator('div:has(svg.lucide-clock)');
    await expect(timeIndicator).toBeVisible();

    const timeText = await timeIndicator.textContent();
    const executionTime = parseInt(timeText?.match(/(\d+)ms/)?.[1] || '0');

    expect(executionTime).toBeLessThan(maxTime);
    expect(executionTime).toBeGreaterThan(0);
  }

  async getTestResults() {
    const testCases = this.page.locator('[data-testid="test-cases-list"] > [data-testid^="test-case-"]');
    const count = await testCases.count();

    const results = [];
    for (let i = 0; i < count; i++) {
      const testCase = testCases.nth(i);
      const passed = await testCase.locator(':has-text("✅ Passed")').isVisible();
      results.push({ index: i, passed });
    }

    return results;
  }
}
