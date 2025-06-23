import { Page, expect } from "@playwright/test";

export interface ValidationOptions {
  expectedPasses: number;
  maxExecutionTime?: number;
}

export class ExecutionValidator {
  constructor(private page: Page) {}

  async validateResults(options: ValidationOptions) {
    const { expectedPasses, maxExecutionTime = 10000 } = options;

    // Wait for execution to complete
    await this.page.waitForSelector('[data-testid="test-results-container"]', {
      timeout: 15000,
    });

    // The hasExecutionErrors() and getExecutionError() methods can still be useful
    // for debugging or for specific checks if a Piston-level error is suspected
    // (e.g. if no test results container appears at all).
    // However, for standard test case validation, we will rely on validateTestCases below,
    // which checks each test case individually for a pass/fail status.
    // This prevents the test from aborting if the app merely indicates a failed test case
    // using a style similar to an execution error.

    // const hasErrors = await this.hasExecutionErrors();
    // if (hasErrors) {
    //   // Potentially, we could check if the errorText indicates a true execution error
    //   // vs. just a test case failure summary. For now, we'll let validateTestCases handle it.
    //   const errorText = await this.getExecutionError();
    //   // Avoid throwing here if it's just a summary of failed test cases.
    //   // True Piston errors might not even show the test-results-container.
    //   // This logic might need refinement based on how Piston errors are distinctly displayed.
    //   console.warn(`Potential execution error or test failure summary detected: ${errorText}`);
    // }

    // Validate test case results
    await this.validateTestCases(expectedPasses);

    // Validate execution time if specified
    if (maxExecutionTime) {
      await this.validateExecutionTime(maxExecutionTime);
    }
  }

  private async hasExecutionErrors(): Promise<boolean> {
    const errorContainerElement = this.page.locator(".bg-red-900\\/30");
    // Wait for a short period to see if the error container appears
    return await errorContainerElement.isVisible({ timeout: 3000 });
  }

  private async getExecutionError(): Promise<string> {
    const errorPreElement = this.page.locator(".bg-red-900\\/30 pre");
    const errorContainerElement = this.page.locator(".bg-red-900\\/30");

    // Attempt to get a detailed error message from a 'pre' tag first
    try {
      await errorPreElement.waitFor({ state: "visible", timeout: 2500 }); // Shorter timeout for pre
      const preText = await errorPreElement.textContent();
      if (preText && preText.trim() !== "") {
        return preText.trim();
      }
    } catch (e) {
      // 'pre' tag not found or empty, proceed to check container
    }

    // If 'pre' tag didn't yield a useful result, try the container itself
    try {
      // Ensure the main container is actually visible if we are here
      if (!(await errorContainerElement.isVisible({ timeout: 1000 }))) {
        return "Unknown execution error (error container not found after initial check).";
      }
      const containerText = await errorContainerElement.textContent();
      if (containerText && containerText.trim() !== "") {
        // Basic check if the container text looks like an error message
        const trimmedContainerText = containerText.trim();
        if (
          trimmedContainerText.toLowerCase().includes("error:") ||
          trimmedContainerText.toLowerCase().includes("failed:")
        ) {
          return trimmedContainerText;
        }
        return `Error container visible with non-specific content: "${trimmedContainerText.substring(0, 100)}${trimmedContainerText.length > 100 ? "..." : ""}" (pre tag missing/empty).`;
      }
      return "Error container visible but seems empty (pre tag missing/empty).";
    } catch (e) {
      return "Unknown execution error (error container and pre tag not found or failed to read).";
    }
  }

  private async validateTestCases(expectedPasses: number) {
    const testCases = this.page.locator(
      '[data-testid="test-cases-list"] > [data-testid^="test-case-"]'
    );
    await expect(testCases).toHaveCount(expectedPasses);

    // Verify all test cases passed
    for (let i = 0; i < expectedPasses; i++) {
      const testCase = testCases.nth(i);
      const passedIndicator = testCase.locator(':has-text("✅ Passed")');
      await expect(passedIndicator).toBeVisible();
    }
  }

  private async validateExecutionTime(maxTime: number) {
    // Using a more specific locator based on the observed HTML structure for the time display
    const timeIndicator = this.page.locator(
      "div.text-xs.text-slate-400.flex.items-center.gap-1:has(svg.lucide-clock)"
    );
    await expect(timeIndicator).toBeVisible();

    const timeText = await timeIndicator.textContent();
    const executionTime = parseInt(timeText?.match(/(\d+)ms/)?.[1] || "0");

    expect(executionTime).toBeLessThan(maxTime);
    expect(executionTime).toBeGreaterThan(0);
  }

  async getTestResults() {
    const testCases = this.page.locator(
      '[data-testid="test-cases-list"] > [data-testid^="test-case-"]'
    );
    const count = await testCases.count();

    const results = [];
    for (let i = 0; i < count; i++) {
      const testCase = testCases.nth(i);
      const passed = await testCase
        .locator(':has-text("✅ Passed")')
        .isVisible();
      results.push({ index: i, passed });
    }

    return results;
  }
}
