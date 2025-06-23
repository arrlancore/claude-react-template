import { Page, expect } from "@playwright/test";

export class EditorActions {
  constructor(private page: Page) {}

  async switchLanguage(language: string) {
    // Open language dropdown
    const languageButton = this.page.locator(
      '[data-testid="language-selector"]'
    );
    await expect(languageButton).toBeVisible();
    await languageButton.click();

    // Wait for dropdown to appear
    await this.page.waitForSelector('[data-testid="language-dropdown"]');

    // Select target language
    const languageOption = this.page.locator(
      `[data-testid="language-option-${language}"]`
    );
    await expect(languageOption).toBeVisible();
    await languageOption.click();

    // It's better to wait for a specific condition after language switch
    // if needed, e.g., an attribute change or a specific element.
    // For now, removing the fixed timeout. Playwright's auto-waiting
    // should handle most cases for subsequent actions.
    // If issues arise, a more specific wait should be added here.
  }

  async insertSolution(code: string) {
    // Wait for Monaco editor to be visible
    await this.page.waitForSelector(".monaco-editor", { state: "visible" });

    // Directly set the editor's content using page.evaluate
    // This assumes the Monaco editor instance is accessible globally
    // or can be found. Adapt the logic inside page.evaluate if your
    // application exposes the editor differently.
    await this.page.evaluate((newCode) => {
      const editor = window.monaco?.editor;
      if (editor) {
        const models = editor.getModels();
        if (models.length > 0) {
          // Assuming the first model is the one we want to change.
          // In a multi-model scenario, more specific logic to find the
          // correct model would be needed.
          models[0].setValue(newCode);
          return;
        }
      }
      // Fallback or error if editor instance can't be accessed directly.
      // This part is highly application-specific.
      // Check if a global editor instance like 'monacoEditor' is available.
      if (
        window.monacoEditor &&
        typeof window.monacoEditor.setValue === "function"
      ) {
        window.monacoEditor.setValue(newCode);
        return;
      }
      // If neither standard monaco API nor a global instance is found, throw an error.
      throw new Error(
        "Monaco editor instance or setValue method not found. Cannot set editor content via page.evaluate()."
      );
    }, code);

    // After setting value via evaluate, the change is typically synchronous
    // within the browser's event loop. A long fixed wait is usually not needed.
    // If subsequent actions depend on UI updates triggered by the value change,
    // use specific expect conditions or waitForFunction.
    // For example, to ensure the editor reflects the new code:
    // await expect(this.page.locator('.monaco-editor')).toContainText(code.substring(0, 100)); // Check a snippet
  }

  async executeCode() {
    const runButton = this.page.locator('[data-testid="run-code-button"]');
    await expect(runButton).toBeVisible();
    await expect(runButton).not.toBeDisabled();

    await runButton.click();

    // Wait for execution to complete (max 10 seconds)
    await this.page.waitForSelector('[data-testid="test-results-container"]', {
      timeout: 10000,
    });
  }

  async closeEditor() {
    const closeButton = this.page.locator('[data-testid="close-panel-button"]');
    await expect(closeButton).toBeVisible();
    await closeButton.click();
  }

  private getLanguageLabel(language: string): string {
    const labels: Record<string, string> = {
      javascript: "JavaScript",
      typescript: "TypeScript",
      python: "Python",
      java: "Java",
      cpp: "C++",
      c: "C",
      go: "Go",
      rust: "Rust",
    };
    return labels[language] || language;
  }
}
