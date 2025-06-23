import { test, expect } from "@playwright/test";
import { ChatActions } from "./helpers/chat-actions";
import { EditorActions } from "./helpers/editor-actions";
import { ExecutionValidator } from "./helpers/execution-validator";
import { solutions } from "./fixtures/two-sum-solutions";
import { languageConfigs } from "./config/language-configs";

test.describe("Monaco Editor Multi-Language Execution", () => {
  test.only("JavaScript - Two Sum II execution", async ({ page }) => {
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
    await page.pause();
    await validator.validateResults({
      expectedPasses: languageConfigs.javascript.expectedTestCases,
    });
    // Pause the test to inspect the browser

    // Cleanup
    await editor.closeEditor();
  });

  test("Python - Two Sum II execution", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);
    const validator = new ExecutionValidator(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("python");
    await editor.insertSolution(solutions.python);

    await editor.executeCode();
    await validator.validateResults({
      expectedPasses: languageConfigs.python.expectedTestCases,
    });

    await editor.closeEditor();
  });

  test("TypeScript - Two Sum II execution", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);
    const validator = new ExecutionValidator(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("typescript");
    await editor.insertSolution(solutions.typescript);

    await editor.executeCode();
    await validator.validateResults({
      expectedPasses: languageConfigs.typescript.expectedTestCases,
    });

    await editor.closeEditor();
  });

  test("Java - Two Sum II execution", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);
    const validator = new ExecutionValidator(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("java");
    await editor.insertSolution(solutions.java);

    await editor.executeCode();
    await validator.validateResults({
      expectedPasses: languageConfigs.java.expectedTestCases,
    });

    await editor.closeEditor();
  });

  test("C++ - Two Sum II execution", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);
    const validator = new ExecutionValidator(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("cpp");
    await editor.insertSolution(solutions.cpp);

    await editor.executeCode();
    await validator.validateResults({
      expectedPasses: languageConfigs.cpp.expectedTestCases,
    });

    await editor.closeEditor();
  });

  test("C - Two Sum II execution", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);
    const validator = new ExecutionValidator(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("c");
    await editor.insertSolution(solutions.c);

    await editor.executeCode();
    await validator.validateResults({
      expectedPasses: languageConfigs.c.expectedTestCases,
    });

    await editor.closeEditor();
  });

  test("Go - Two Sum II execution", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);
    const validator = new ExecutionValidator(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("go");
    await editor.insertSolution(solutions.go);

    await editor.executeCode();
    await validator.validateResults({
      expectedPasses: languageConfigs.go.expectedTestCases,
    });

    await editor.closeEditor();
  });

  test("Rust - Two Sum II execution", async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);
    const validator = new ExecutionValidator(page);

    await chat.navigateToDemoChat();
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    await editor.switchLanguage("rust");
    await editor.insertSolution(solutions.rust);

    await editor.executeCode();
    await validator.validateResults({
      expectedPasses: languageConfigs.rust.expectedTestCases,
    });

    await editor.closeEditor();
  });
});
