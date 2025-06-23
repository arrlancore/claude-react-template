"use client";

import React, { useState, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, ChevronDown, Clock, X, Settings } from "lucide-react";
import executionFactory from "@/lib/execution/execution-factory";

interface TestCase {
  input: string;
  expected: string;
  actual?: string;
  passed?: boolean;
}

interface DSAProblem {
  id: string;
  pattern: string; // Add pattern property
  title: string;
  description: string;
  starterCode?: Record<string, string>; // { language: code }
  language: string;
  testCases?: TestCase[];
}

interface MonacoEditorPanelProps {
  problem: DSAProblem;
  initialCode: string;
  language: string;
  onClose: () => void;
  onSubmit: (code: string, language: string) => void;
  isVisible: boolean;
}
// will support more languages in the future, after MVP
// For now, we only support JavaScript, Python, and Go
const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  // { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  // { value: "java", label: "Java" },
  // { value: "cpp", label: "C++" },
  // { value: "c", label: "C" },
  { value: "go", label: "Go" },
  // { value: "rust", label: "Rust" },
];

// Load from execution factory instead of problem's starterCode
const getStarterCode = async (
  language: string,
  problem: DSAProblem
): Promise<string> => {
  try {
    return await executionFactory.getTemplate(
      problem.pattern,
      problem.id,
      language
    );
  } catch (error) {
    console.warn(
      `Could not load template for ${problem.pattern}/${problem.id}:`,
      error
    );
    return problem.starterCode?.[language] || "";
  }
};

const MonacoEditorPanel: React.FC<MonacoEditorPanelProps> = ({
  problem,
  initialCode,
  language: initialLanguage,
  onClose,
  onSubmit,
  isVisible,
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [customTestCases, setCustomTestCases] = useState("");

  // Auto-save to localStorage
  useEffect(() => {
    const saveKey = `dsa-editor-${problem.id}-${language}`;
    const timeoutId = setTimeout(() => {
      localStorage.setItem(saveKey, code);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [code, problem.id, language]);

  // Load from localStorage on mount only, not on language change
  useEffect(() => {
    const loadInitialCode = async () => {
      const saveKey = `dsa-editor-${problem.id}-${language}`;
      const saved = localStorage.getItem(saveKey);
      if (saved) {
        setCode(saved);
      } else {
        // If no saved code, use starter template
        const starterCode = await getStarterCode(language, problem);
        setCode(starterCode);
      }
    };
    loadInitialCode();
  }, [problem.id]); // Remove language and initialCode from dependencies

  // Initialize with starter code template when language changes
  useEffect(() => {
    const loadTemplate = async () => {
      const starterCode = await getStarterCode(language, problem);
      setCode(starterCode || initialCode);
    };
    loadTemplate();
  }, [language]); // Only trigger on language change

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      setCode(value || "");
      // Clear markers when code changes
      if (editorInstance) {
        const monaco = (window as any).monaco;
        if (monaco) {
          monaco.editor.setModelMarkers(
            editorInstance.getModel(),
            "execution-errors",
            []
          );
        }
      }
    },
    [editorInstance]
  );

  // Parse error message to extract line number and details
  const parseExecutionError = (error: string) => {
    // Match patterns like "/path/main.js:8" or "line 8"
    const lineMatch = error.match(/main\.\w+:(\d+)/);
    const line = lineMatch ? parseInt(lineMatch[1], 10) : null;

    // Extract error message (after the stack trace line)
    const errorLines = error.split("\n");
    const errorMsg =
      errorLines.find(
        (line) =>
          line.includes("Error:") ||
          line.includes("TypeError:") ||
          line.includes("ReferenceError:") ||
          line.includes("SyntaxError:")
      ) || errorLines[0];

    return { line, message: errorMsg.trim() };
  };

  // Set Monaco error markers
  const setErrorMarkers = (error: string) => {
    if (!editorInstance) return;

    const monaco = (window as any).monaco;
    if (!monaco) return;

    const { line, message } = parseExecutionError(error);

    if (line) {
      const markers = [
        {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 1000,
          message: message,
          severity: monaco.MarkerSeverity.Error,
          source: "execution",
        },
      ];

      monaco.editor.setModelMarkers(
        editorInstance.getModel(),
        "execution-errors",
        markers
      );
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setExecutionError(null);

    try {
      const result = await executionFactory.execute(
        problem.pattern,
        problem.id,
        language,
        code,
        customTestCases.trim() || undefined
      );

      setExecutionTime(result.executionTime);
      setTestResults(
        result.testResults.map((test) => ({
          input:
            test.input &&
            typeof test.input === "object" &&
            "numbers" in test.input
              ? `numbers = ${JSON.stringify(test.input.numbers)}, target = ${test.input.target}`
              : typeof test.input === "string"
                ? test.input.replace("\n", ", target = ")
                : String(test.input),
          expected: Array.isArray(test.expected)
            ? JSON.stringify(test.expected)
            : String(test.expected),
          actual: test.actual
            ? Array.isArray(test.actual)
              ? JSON.stringify(test.actual)
              : String(test.actual)
            : "",
          passed: test.passed || false,
        }))
      );

      if (!result.success && result.error) {
        setExecutionError(result.error);
        setErrorMarkers(result.error);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Execution failed";
      setExecutionError(errorMsg);
      setErrorMarkers(errorMsg);
      setTestResults([]);
    }

    setIsRunning(false);
  };

  const handleReset = () => {
    setCode(initialCode);
    const saveKey = `dsa-editor-${problem.id}-${language}`;
    localStorage.removeItem(saveKey);
    setTestResults([]);
    setExecutionTime(null);
    setExecutionError(null);
    // Clear markers
    if (editorInstance) {
      const monaco = (window as any).monaco;
      if (monaco) {
        monaco.editor.setModelMarkers(
          editorInstance.getModel(),
          "execution-errors",
          []
        );
      }
    }
  };

  const handleEditorMount = (editor: any, monaco: any) => {
    setEditorInstance(editor);
  };

  const handleSubmit = () => {
    onSubmit(code, language);
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    setShowLanguageDropdown(false);
    const starterCode = await getStarterCode(newLanguage, problem);
    setCode(starterCode);
  };

  if (!isVisible) {
    return null;
  }

  const currentLanguage = LANGUAGES.find((lang) => lang.value === language);
  const hasTestResults = testResults.length > 0 || executionError;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700"
            data-testid="run-code-button"
          >
            <Play className="h-4 w-4 mr-1" />
            {isRunning ? "Running..." : "Run"}
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleReset}
            className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowSettings(true)}
            className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {executionTime && (
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {executionTime}ms
            </div>
          )}

          {/* Language Selector */}
          <div className="relative">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
              data-testid="language-selector"
            >
              {currentLanguage?.label || language}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>

            {showLanguageDropdown && (
              <div
                className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-50 min-w-32"
                data-testid="language-dropdown"
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-700 first:rounded-t-md last:rounded-b-md"
                    onClick={() => handleLanguageChange(lang.value)}
                    data-testid={`language-option-${lang.value}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor + Test Results Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Editor */}
        <div className={`${hasTestResults ? "lg:w-3/5" : "w-full"} min-h-0`}>
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Test Results Panel */}
        {hasTestResults && (
          <div className="lg:w-2/5 border-t lg:border-t-0 lg:border-l border-slate-700 flex flex-col">
            {/* Test Results Header */}
            <div className="p-2 border-b border-slate-700 flex items-center justify-between">
              <span className="text-sm font-medium">Test Results</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setTestResults([]);
                  setExecutionError(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Test Results Content */}
            <div
              className="flex-1 overflow-y-auto p-3"
              data-testid="test-results-container"
            >
              {/* Execution Error */}
              {executionError && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-sm">
                  <div className="font-medium text-red-400 mb-2">
                    Execution Error:
                  </div>
                  <pre className="text-red-300 whitespace-pre-wrap text-xs">
                    {executionError}
                  </pre>
                </div>
              )}

              {/* Test Cases */}
              {testResults.length > 0 && (
                <div className="space-y-2" data-testid="test-cases-list">
                  {testResults.map((test, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-xs ${
                        test.passed
                          ? "bg-green-900/30 border border-green-700"
                          : "bg-red-900/30 border border-red-700"
                      }`}
                      data-testid={`test-case-${index}`}
                    >
                      <div>Input: {test.input}</div>
                      <div>Expected: {test.expected}</div>
                      <div>Actual: {test.actual}</div>
                      <div
                        className={
                          test.passed ? "text-green-400" : "text-red-400"
                        }
                      >
                        {test.passed ? "✅ Passed" : "❌ Failed"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="p-4 border-t border-slate-700 flex justify-end space-x-2">
        <Button
          variant="secondary"
          onClick={onClose}
          data-testid="close-panel-button"
        >
          Close Panel
        </Button>
        <Button onClick={handleSubmit}>Submit Solution</Button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full border border-slate-600 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Test Case Settings
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSettings(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* System Test Cases */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                System Test Cases (Default)
              </label>
              <textarea
                value={`[2,7,11,15]|9|[1,2]
[2,3,4]|6|[1,3]
[-1,0]|-1|[1,2]`}
                disabled
                className="w-full h-24 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-400 text-sm font-mono resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Format: nums|target|expected (one per line)
              </p>
            </div>

            {/* Custom Test Cases */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Custom Test Cases (Override)
              </label>
              <textarea
                value={customTestCases}
                onChange={(e) => setCustomTestCases(e.target.value)}
                placeholder={`[1,2,3,4]|7|[2,3]
[5,5,5]|10|[1,2]
[]|0|null`}
                className="w-full h-32 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">
                Leave empty to use system tests. Custom tests override system
                tests when defined.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowSettings(false)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonacoEditorPanel;
