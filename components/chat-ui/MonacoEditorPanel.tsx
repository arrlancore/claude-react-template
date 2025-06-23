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

// Interface to represent the structure from test-cases.json
interface SourceTestCase {
  input: Record<string, any> | any;
  expected: any;
  explanation?: string;
}

interface DSAProblem {
  id: string;
  pattern: string; // Add pattern property
  title: string;
  description: string;
  starterCode?: Record<string, string>; // { language: code }
  language: string;
  testCases?: SourceTestCase[]; // Updated to use SourceTestCase
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

const GO_LINE_OFFSET = 9; // Offset for lines added by Piston wrapper for Go

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
  const [displayedSystemTestCases, setDisplayedSystemTestCases] =
    useState<string>("");

  // Effect to format system test cases for display
  useEffect(() => {
    if (problem?.testCases?.length) {
      const formattedStrings = problem.testCases.map((tc) => {
        let inputDisplayStr = "";
        if (typeof tc.input === "object" && tc.input !== null) {
          // Check for common structure like { numbers: [], target: ... }
          if (
            "numbers" in tc.input &&
            "target" in tc.input &&
            Object.keys(tc.input).length === 2
          ) {
            inputDisplayStr = `${JSON.stringify(tc.input.numbers)}|${tc.input.target}`;
          } else {
            // Generic fallback for other object structures
            inputDisplayStr = Object.values(tc.input)
              .map((v) => (Array.isArray(v) ? JSON.stringify(v) : String(v)))
              .join("|");
          }
        } else {
          inputDisplayStr = String(tc.input); // For non-object inputs (e.g. string, number)
        }

        const expectedDisplayStr = JSON.stringify(tc.expected);
        // Return only input|output, without explanation
        return `${inputDisplayStr}|${expectedDisplayStr}`;
      });
      setDisplayedSystemTestCases(formattedStrings.join("\n")); // Join with single newline
    } else {
      setDisplayedSystemTestCases(
        "No default test cases available for this problem."
      );
    }
  }, [problem, problem.testCases]); // Made dependency more specific

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
  const parseExecutionError = (error: string, currentLanguage: string) => {
    let line: number | null = null;
    let message = error.split("\n")[0]; // Default message is the first line

    if (currentLanguage === "javascript") {
      const lineMatch = error.match(/main\.\w+:(\d+)/);
      line = lineMatch ? parseInt(lineMatch[1], 10) : null;
      const errorLines = error.split("\n");
      message =
        errorLines.find(
          (l) =>
            l.includes("Error:") ||
            l.includes("TypeError:") ||
            l.includes("ReferenceError:") ||
            l.includes("SyntaxError:")
        ) || errorLines[0];
    } else if (currentLanguage === "python") {
      // Python: File "main.py", line X
      //         SpecificError: The error message
      if (error === "Could not parse output") {
        // This is an application-level error, not a Python traceback for line marking
        message = error;
        line = null;
        return { line, message }; // Early return
      }

      const lineMatch = error.match(/File ".*?", line (\d+)/g);
      if (lineMatch && lineMatch.length > 0) {
        // Get the last match, which is usually the most relevant
        const lastMatch = lineMatch[lineMatch.length - 1];
        const lineNumStr = lastMatch.match(/line (\d+)/);
        if (lineNumStr && lineNumStr[1]) {
          line = parseInt(lineNumStr[1], 10);
        }
      }
      const errorLines = error.split("\n");
      // Find the line with the error type and message
      const errorTypeLine = errorLines.find((line) =>
        /^[A-Za-z]+Error:/.test(line.trim())
      );
      message = errorTypeLine
        ? errorTypeLine.trim()
        : errorLines[errorLines.length - 1] || errorLines[0];
    } else if (currentLanguage === "go") {
      // Go compile error: ./main.go:X:Y: message  OR ./main.go.go:X:Y: message
      // Go runtime panic: panic: message
      //                   main.go:X or main.go.go:X
      // Example error: # command-line-arguments\n./main.go.go:14:12: undefined: x
      const compileErrorMatch = error.match(
        /^\.\/(.+?\.go):(\d+):\d+:\s*(.*)/m
      ); // Added 'm' flag for multiline

      if (compileErrorMatch && compileErrorMatch[2] && compileErrorMatch[3]) {
        const parsedLine = parseInt(compileErrorMatch[2], 10);
        line = Math.max(1, parsedLine - GO_LINE_OFFSET); // Adjust line and ensure it's > 0
        message = compileErrorMatch[3];
      } else {
        // Try to find panic message and line from stack trace
        const panicMatch = error.match(/panic:\s*(.*)/);
        if (panicMatch && panicMatch[1]) {
          message = `panic: ${panicMatch[1].split("\n")[0]}`; // Get only the first line of panic
        }
        // Match main.go:X or main.go.go:X in stack traces for panics
        const stackTraceLineMatch = error.match(/(.+?\.go):(\d+)/m);
        if (stackTraceLineMatch && stackTraceLineMatch[2]) {
          const parsedLine = parseInt(stackTraceLineMatch[2], 10);
          line = Math.max(1, parsedLine - GO_LINE_OFFSET); // Adjust line and ensure it's > 0
        }
      }
    }

    return { line, message: message.trim() };
  };

  // Set Monaco error markers
  const setErrorMarkers = (error: string, currentLanguage: string) => {
    if (!editorInstance) return;

    const monaco = (window as any).monaco;
    if (!monaco) return;

    const { line, message } = parseExecutionError(error, currentLanguage);

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

  const formatErrorForDisplay = (
    rawError: string,
    language: string
  ): string => {
    if (language === "go") {
      // Try to match compile error format: (# command-line-arguments\n)?./filename:line:col: message
      const compileErrorRegex =
        /^(# command-line-arguments\n)?(\.\/(.+?\.go)):(\d+):(\d+:\s*.*)/m;
      const compileMatch = rawError.match(compileErrorRegex);

      if (compileMatch) {
        const prefix = compileMatch[1] || ""; // Optional "# command-line-arguments\n"
        const filePath = compileMatch[2]; // Full path like ./main.go.go
        const originalLine = parseInt(compileMatch[4], 10);
        const restOfMessage = compileMatch[5]; // Column and actual error message part

        const adjustedLine = Math.max(1, originalLine - GO_LINE_OFFSET);
        return `${prefix}${filePath}:${adjustedLine}:${restOfMessage}`;
      }
      // Note: Panic messages might need different handling if their displayed format also needs adjustment.
      // For now, this targets the common compile error string.
    } else if (language === "python") {
      if (rawError === "Could not parse output") {
        return rawError; // Don't try to adjust this specific message's line numbers
      }
      // TODO: Add Python traceback line number adjustment logic here
      //       if Piston returns standard tracebacks with user-code line numbers
      //       that need offsetting due to wrappers.
    }
    // TODO: Add similar logic for Python if its error messages also need line number adjustments for display.
    return rawError; // Return original if no transformation applies or language not handled
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
        const formattedError = formatErrorForDisplay(result.error, language);
        setExecutionError(formattedError);
        setErrorMarkers(result.error, language); // setErrorMarkers uses original error for its internal parsing
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Execution failed";
      const formattedError = formatErrorForDisplay(errorMsg, language);
      setExecutionError(formattedError);
      setErrorMarkers(errorMsg, language); // setErrorMarkers uses original error for its internal parsing
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
                value={displayedSystemTestCases}
                disabled
                className="w-full h-24 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-400 text-sm font-mono resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                System-defined test cases. Format: input_parts|expected_output
                (one per line).
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
