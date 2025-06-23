import { test, expect } from '@playwright/test';
import { ChatActions } from './helpers/chat-actions';
import { EditorActions } from './helpers/editor-actions';
import { ExecutionValidator } from './helpers/execution-validator';
import { solutions } from './fixtures/two-sum-solutions';
import { languageConfigs } from './config/language-configs';

test.describe('Monaco Editor JavaScript Test', () => {

  test('JavaScript - Two Sum II execution', async ({ page }) => {
    const chat = new ChatActions(page);
    const editor = new EditorActions(page);
    const validator = new ExecutionValidator(page);

    // Setup
    await chat.navigateToDemoChat();

    // Trigger DSA problem
    await chat.triggerDSAProblem();
    await chat.openMonacoEditor();

    // Switch to JavaScript (default language, but ensure correct)
    await editor.switchLanguage('javascript');

    // Implement solution
    await editor.insertSolution(solutions.javascript);

    // Execute & validate
    await editor.executeCode();
    await validator.validateResults({
      expectedPasses: languageConfigs.javascript.expectedTestCases
    });

    // Cleanup
    await editor.closeEditor();
  });
});
