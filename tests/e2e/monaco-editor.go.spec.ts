import { test, expect } from "@playwright/test";
import { ChatActions } from "./helpers/chat-actions";
import { EditorActions } from "./helpers/editor-actions";
import { ExecutionValidator } from "./helpers/execution-validator";
import { solutions } from "./fixtures/two-sum-solutions";
import { languageConfigs } from "./config/language-configs";

test.describe.configure({ mode: "serial" });

test.describe("Monaco Editor Go Execution", () => {
  test("Go - Two Sum II execution", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);
    const validator = new ExecutionValidator(page);

    // Setup
    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    // Switch to Go
    await editor.switchLanguage("go");

    // Implement solution
    await editor.insertSolution(solutions.go);

    // Execute & validate
    await editor.executeCode();
    await validator.validateResults({
      expectedPasses: languageConfigs.go.expectedTestCases,
    });

    // Cleanup
    await editor.closeEditor();
  });

  test("Go - Handles Runtime Error (e.g., undefined variable)", async ({
    page,
  }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("go");

    const codeWithUndefinedVariable = `
func twoSum(numbers []int, target int) []int {
    left := 0
    right := len(numbers) - 1

    for left < right {
        sum := numbers[left] + numbers[right]

        if sum == target {
            return []int{left + 1, right + 1} // 1-indexed
        } else if sum < target {
            left++
        } else {
            // Deliberate error: 'righ' is not defined (should be 'right')
            righ-- 
        }
    }
    return []int{} // No solution found
}`;
    await editor.insertSolution(codeWithUndefinedVariable);
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
    // Go's compiler/runtime usually reports undefined variables clearly.
    // The exact message might vary slightly based on the execution environment.
    await expect(errorPreElement).toContainText(/undefined: righ/i);
    const testCasesList = page.locator(
      '[data-testid="test-cases-list"] > [data-testid^="test-case-"]'
    );
    await expect(testCasesList).toHaveCount(0);

    await editor.closeEditor();
  });

  test("Go - Handles Empty Editor (twoSum not defined)", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("go");

    const emptyCode = ""; // No package main, no func twoSum
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
    // Expecting an error related to 'twoSum' being undefined because the
    // TwoSumIIExecutor.wrapCode will try to call it.
    await expect(errorPreElement).toContainText(/undefined: twoSum/i);
    const testCasesList = page.locator(
      '[data-testid="test-cases-list"] > [data-testid^="test-case-"]'
    );
    await expect(testCasesList).toHaveCount(0);

    await editor.closeEditor();
  });
});
