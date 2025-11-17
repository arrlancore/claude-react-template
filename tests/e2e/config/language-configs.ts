export const languageConfigs = {
  javascript: {
    monacoLanguage: 'javascript',
    displayName: 'JavaScript',
    timeout: 5000,
    expectedTestCases: 10
  },
  typescript: {
    monacoLanguage: 'typescript',
    displayName: 'TypeScript',
    timeout: 8000,
    expectedTestCases: 10
  },
  python: {
    monacoLanguage: 'python',
    displayName: 'Python',
    timeout: 6000,
    expectedTestCases: 10
  },
  java: {
    monacoLanguage: 'java',
    displayName: 'Java',
    timeout: 10000,
    expectedTestCases: 10
  },
  cpp: {
    monacoLanguage: 'cpp',
    displayName: 'C++',
    timeout: 8000,
    expectedTestCases: 10
  },
  c: {
    monacoLanguage: 'c',
    displayName: 'C',
    timeout: 8000,
    expectedTestCases: 10
  },
  go: {
    monacoLanguage: 'go',
    displayName: 'Go',
    timeout: 6000,
    expectedTestCases: 10
  },
  rust: {
    monacoLanguage: 'rust',
    displayName: 'Rust',
    timeout: 12000,
    expectedTestCases: 10
  }
} as const;

export type SupportedLanguage = keyof typeof languageConfigs;
