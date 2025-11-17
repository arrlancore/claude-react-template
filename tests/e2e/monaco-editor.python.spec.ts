import { test, expect } from "@playwright/test";
import { ChatActions } from "./helpers/chat-actions";
import { EditorActions } from "./helpers/editor-actions";
import { ExecutionValidator } from "./helpers/execution-validator";
// solutions.py is not imported as we are using the user-provided snippet directly for the success case
// and a modified version for the error case.
import { languageConfigs } from "./config/language-configs";

test.describe.configure({ mode: "serial" });

test.describe("Monaco Editor Python Execution", () => {
  test("Python - Two Sum II execution", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);
    const validator = new ExecutionValidator(page);

    // Setup
    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    // Switch to Python
    await editor.switchLanguage("python");

    // Implement solution (user-provided)
    const userProvidedPythonSolution = `
def twoSum(numbers, target):
    num_map = {}
    for i, num in enumerate(numbers):
        complement = target - num
        if complement in num_map:
            return [num_map[complement] + 1, i + 1]  # 1-indexed
        num_map[num] = i
    return []`;
    await editor.insertSolution(userProvidedPythonSolution);

    // Execute & validate
    await editor.executeCode();
    await validator.validateResults({
      expectedPasses: languageConfigs.python.expectedTestCases,
    });

    // Cleanup
    await editor.closeEditor();
  });

  test("Python - Handles Runtime Error (e.g., NameError)", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("python");

    const pythonCodeWithNameError = `
def twoSum(numbers, target):
    num_map = {}
    for i, num in enumerate(numbers):
        complement = target - num
        if complement in num_map:
            return [num_map[complement] + 1, i + 1]
        # Deliberate NameError: 'num_maap' is not defined
        num_maap[num] = i 
    return []`;
    await editor.insertSolution(pythonCodeWithNameError);
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
      /NameError: name 'num_maap' is not defined/i
    );
    const testCasesList = page.locator(
      '[data-testid="test-cases-list"] > [data-testid^="test-case-"]'
    );
    await expect(testCasesList).toHaveCount(0);

    await editor.closeEditor();
  });

  test("Python - Handles Empty Editor (twoSum not defined)", async ({
    page,
  }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("python");

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
      /NameError: name 'twoSum' is not defined/i
    );
    const testCasesList = page.locator(
      '[data-testid="test-cases-list"] > [data-testid^="test-case-"]'
    );
    await expect(testCasesList).toHaveCount(0);

    await editor.closeEditor();
  });
});
