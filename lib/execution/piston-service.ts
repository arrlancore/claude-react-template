/**
 * Piston API service for code execution
 * Docs: https://github.com/engineer-man/piston
 * Rate limit: 5 requests/second
 */

export interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
  runtime?: string;
}

export interface ExecutionResult {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

export interface ExecuteRequest {
  language: string;
  version: string;
  files: Array<{
    name: string;
    content: string;
  }>;
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
}

// Language mapping from our editor to Piston
const LANGUAGE_MAP: Record<string, { language: string; version: string; filename: string }> = {
  javascript: { language: "javascript", version: "18.15.0", filename: "main.js" },
  typescript: { language: "typescript", version: "5.0.3", filename: "main.ts" },
  python: { language: "python", version: "3.10.0", filename: "main.py" },
  java: { language: "java", version: "15.0.2", filename: "Main.java" },
  cpp: { language: "c++", version: "10.2.0", filename: "main.cpp" },
  c: { language: "c", version: "10.2.0", filename: "main.c" },
  go: { language: "go", version: "1.16.2", filename: "main.go" },
  rust: { language: "rust", version: "1.68.2", filename: "main.rs" },
};

class PistonService {
  private readonly baseUrl = "https://emkc.org/api/v2/piston";
  private readonly rateLimitDelay = 200; // 5 req/sec = 200ms between requests
  private lastRequestTime = 0;

  /**
   * Get available runtimes
   */
  async getRuntimes(): Promise<PistonRuntime[]> {
    await this.enforceRateLimit();

    const response = await fetch(`${this.baseUrl}/runtimes`);
    if (!response.ok) {
      throw new Error(`Failed to fetch runtimes: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Execute code
   */
  async execute(
    language: string,
    code: string,
    stdin?: string,
    timeoutMs = 3000
  ): Promise<ExecutionResult> {
    await this.enforceRateLimit();

    const mapping = LANGUAGE_MAP[language];
    if (!mapping) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const request: ExecuteRequest = {
      language: mapping.language,
      version: mapping.version,
      files: [{
        name: mapping.filename,
        content: this.wrapCode(code, language)
      }],
      stdin: stdin || "",
      compile_timeout: timeoutMs,
      run_timeout: timeoutMs
    };

    const response = await fetch(`${this.baseUrl}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Execution failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Execute with test cases
   */
  async executeWithTests(
    language: string,
    code: string,
    testCases: Array<{ input: string; expected: string }>
  ): Promise<Array<{ input: string; expected: string; actual: string; passed: boolean; output: string; error?: string }>> {
    const results = [];

    for (const testCase of testCases) {
      try {
        await this.enforceRateLimit();

        const result = await this.execute(language, code, testCase.input);
        const actual = result.run.stdout.trim();
        const passed = actual === testCase.expected.trim();

        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual,
          passed,
          output: result.run.output,
          error: result.run.stderr || undefined
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual: "",
          passed: false,
          output: "",
          error: error instanceof Error ? error.message : "Execution failed"
        });
      }
    }

    return results;
  }

  /**
   * Wrap code with boilerplate for execution
   */
  private wrapCode(code: string, language: string): string {
    switch (language) {
      case "javascript":
        return `${code}\n\n// Test execution\nconsole.log('Function defined successfully');`;

      case "typescript":
        return `${code}\n\n// Test execution\nconsole.log('TypeScript function defined successfully');`;

      case "python":
        return `${code}\n\n# Test execution\nif __name__ == "__main__":\n    print("Function defined successfully")`;

      case "java":
        if (!code.includes("class")) {
          return `public class Main {\n    ${code}\n    \n    public static void main(String[] args) {\n        System.out.println("Function defined successfully");\n    }\n}`;
        }
        return code.replace(/class\s+\w+/, "public class Main");

      case "cpp":
        return `#include <iostream>\n#include <vector>\nusing namespace std;\n\n${code}\n\nint main() {\n    cout << "Function defined successfully" << endl;\n    return 0;\n}`;

      case "c":
        return `#include <stdio.h>\n#include <stdlib.h>\n\n${code}\n\nint main() {\n    printf("Function defined successfully\\n");\n    return 0;\n}`;

      case "go":
        return `package main\n\nimport "fmt"\n\n${code}\n\nfunc main() {\n    fmt.Println("Function defined successfully")\n}`;

      case "rust":
        return `${code}\n\nfn main() {\n    println!("Function defined successfully");\n}`;

      default:
        return code;
    }
  }

  /**
   * Enforce rate limiting
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(language: string): boolean {
    return language in LANGUAGE_MAP;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    return Object.keys(LANGUAGE_MAP);
  }
}

export const pistonService = new PistonService();
export default pistonService;
