import { test, expect } from "@playwright/test";
import { ChatActions } from "./helpers/chat-actions";
import { EditorActions } from "./helpers/editor-actions";

test.describe.configure({ mode: "serial" });
import { ExecutionValidator } from "./helpers/execution-validator";
import { solutions } from "./fixtures/two-sum-solutions";
import { languageConfigs } from "./config/language-configs";

test.describe("Monaco Editor JavaScript Execution", () => {
  test("JavaScript - Two Sum II execution", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);
    const validator = new ExecutionValidator(page);

    // Setup
    await chat.navigateToDemoChat();

    // Trigger DSA problem
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    // Switch to JavaScript (default language, but ensure correct)
    await editor.switchLanguage("javascript");

    // Implement solution
    await editor.insertSolution(solutions.javascript);

    // Execute & validate
    await editor.executeCode();
    await validator.validateResults({
      expectedPasses: languageConfigs.javascript.expectedTestCases,
    });

    // Cleanup
    await editor.closeEditor();
  });

  test("JavaScript - Handles Runtime Error (seem is not defined)", async ({
    page,
  }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("javascript");

    const codeWithReferenceError = `
function twoSum(numbers, target) {
  const seen = new Map();
  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i + 1];
    }
    seem.set(numbers[i], i + 1); // Deliberate ReferenceError: 'seem' is not defined
  }
  return [];
}`;
    await editor.insertSolution(codeWithReferenceError);
    await editor.executeCode();

    const errorContainer = page.locator(
      '[data-testid="test-results-container"] .bg-red-900\\/30'
    );
    await expect(errorContainer).toBeVisible();
    await expect(
      errorContainer.locator('div:has-text("Execution Error:")')
    ).toBeVisible();
    const errorPreElement = errorContainer.locator("pre");
    await expect(errorPreElement).toBeVisible();
    await expect(errorPreElement).toContainText(
      /ReferenceError: seem is not defined/i
    );
    const testCasesList = page.locator(
      '[data-testid="test-cases-list"] > [data-testid^="test-case-"]'
    );
    await expect(testCasesList).toHaveCount(0);

    await editor.closeEditor();
  });

  test("JavaScript - Handles Empty Editor (twoSum not defined)", async ({
    page,
  }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("javascript");

    const emptyCode = "";
    await editor.insertSolution(emptyCode);
    await editor.executeCode();

    const errorContainer = page.locator(
      '[data-testid="test-results-container"] .bg-red-900\\/30'
    );
    await expect(errorContainer).toBeVisible();
    await expect(
      errorContainer.locator('div:has-text("Execution Error:")')
    ).toBeVisible();
    const errorPreElement = errorContainer.locator("pre");
    await expect(errorPreElement).toBeVisible();
    await expect(errorPreElement).toContainText(
      /ReferenceError: twoSum is not defined/i
    );
    const testCasesList = page.locator(
      '[data-testid="test-cases-list"] > [data-testid^="test-case-"]'
    );
    await expect(testCasesList).toHaveCount(0);

    await editor.closeEditor();
  });
});
