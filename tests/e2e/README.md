# E2E Testing: Monaco Editor Multi-Language Validation

This test suite validates the end-to-end execution pipeline for the Monaco Editor across all supported programming languages using real Piston server integration.

## 🎯 Test Objectives

- **Validate Monaco Editor Integration**: Ensure the editor loads and functions correctly
- **Test Language Switching**: Verify language dropdown and template switching
- **Validate Code Execution**: Test real code execution via Piston server
- **Verify Test Results**: Ensure all 10 test cases pass for Two Sum II problem
- **Performance Validation**: Execution time under 10 seconds

## 🔧 Quick Start

### Prerequisites
- Development server running (`npm run dev`)
- Node.js and npm installed

### Run JavaScript Test Only
```bash
./scripts/test-e2e-setup.sh
```

### Run All Language Tests
```bash
npm install @playwright/test --save-dev
npx playwright install chromium
npm run test:e2e
```

### Run with UI (Interactive)
```bash
npm run test:e2e:ui
```

## 📁 File Structure

```
tests/e2e/
├── monaco-editor.spec.ts           # Full test suite (all 8 languages)
├── javascript-only.spec.ts         # Quick JavaScript validation
├── fixtures/
│   └── two-sum-solutions.ts        # Solution templates per language
├── helpers/
│   ├── chat-actions.ts             # Chat interaction helpers
│   ├── editor-actions.ts           # Monaco editor helpers
│   └── execution-validator.ts      # Result validation
└── config/
    └── language-configs.ts         # Language-specific settings
```

## 🧪 Test Flow

Each test follows this pattern:

1. **Navigate** to `/demo-chat`
2. **Trigger** DSA problem generation ("give me a dsa problem")
3. **Open** Monaco Editor via "Solve Problem" button
4. **Switch** to target language via dropdown
5. **Insert** correct Two Sum II solution
6. **Execute** code via "Run" button
7. **Validate** 10/10 test cases pass
8. **Cleanup** by closing editor

## 📊 Validation Criteria

- ✅ **Execution Success**: No runtime errors
- ✅ **Test Results**: All 10 test cases pass
- ✅ **Response Time**: Execution < 10 seconds
- ✅ **UI State**: Proper test results display

## 🎯 Supported Languages

| Language   | Test ID | Expected Cases | Timeout |
|------------|---------|----------------|---------|
| JavaScript | `js`    | 10             | 5s      |
| TypeScript | `ts`    | 10             | 8s      |
| Python     | `py`    | 10             | 6s      |
| Java       | `java`  | 10             | 10s     |
| C++        | `cpp`   | 10             | 8s      |
| C          | `c`     | 10             | 8s      |
| Go         | `go`    | 10             | 6s      |
| Rust       | `rust`  | 10             | 12s     |

## 🔍 Test Selectors

The tests use reliable `data-testid` selectors:

```typescript
// Key selectors used in tests
'[data-testid="chat-input"]'           // Chat input field
'[data-testid="problem-card"]'         // DSA problem card
'[data-testid="open-editor-button"]'   // Open editor button
'[data-testid="language-selector"]'    // Language dropdown
'[data-testid="run-code-button"]'      // Execute code button
'[data-testid="test-results-container"]' // Test results area
'[data-testid="test-cases-list"]'      // Individual test cases
```

## 🐛 Troubleshooting

### Test Failures
- **Monaco Editor not loading**: Check development server is running
- **Language switching fails**: Verify dropdown interactions work in browser
- **Execution timeout**: Check Piston server connection
- **Test case validation fails**: Verify solution templates are correct

### Debug Commands
```bash
# Run specific test with debug
npx playwright test tests/e2e/javascript-only.spec.ts --debug

# Run with trace
npx playwright test --trace on

# Generate test report
npx playwright show-report
```

### Common Issues
1. **Port 3000 not available**: Ensure dev server is running
2. **Browser not installed**: Run `npx playwright install`
3. **Timeout errors**: Increase timeout in `playwright.config.ts`

## 📈 Success Metrics

- **100% pass rate** across all languages
- **Execution time** < 10 seconds per language
- **Zero false positives** in test validation
- **Complete coverage** of Monaco Editor flow

## 🚀 CI Integration

Add to GitHub Actions:

```yaml
- name: Install Playwright
  run: npm install @playwright/test

- name: Install browsers
  run: npx playwright install

- name: Run E2E tests
  run: npm run test:e2e
```

## 📝 Adding New Languages

1. Add solution template to `fixtures/two-sum-solutions.ts`
2. Add language config to `config/language-configs.ts`
3. Add test case to `monaco-editor.spec.ts`
4. Update this README

This test suite ensures the Monaco Editor execution pipeline works reliably across all supported languages with real Piston server integration.
