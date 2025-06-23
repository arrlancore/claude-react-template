/**
 * Two Sum II Problem Executor
 * Handles execution logic specific to Two Sum on sorted array
 */

import pistonService from "@/lib/execution/piston-service";
import testCases from "./test-cases.json";
import templates from "./templates.json";

export interface TestCase {
  input: {
    numbers: number[];
    target: number;
  };
  expected: any; // Can be number[] or number[][] or other types based on strategy
  explanation: string;
  actual?: number[];
  passed?: boolean;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  executionTime: number;
  testResults: TestCase[];
  error?: string;
}

class TwoSumIIExecutor {
  /**
   * Execute code for Two Sum II problem
   */
  async execute(
    language: string,
    code: string,
    customTests?: string
  ): Promise<ExecutionResult> {
    const startTime = Date.now();

    try {
      const cases = customTests
        ? this.parseCustomTests(customTests)
        : testCases.testCases;
      const wrappedCode = this.wrapCode(code, language);
      const results: TestCase[] = [];
      let allPassed = true;

      for (const testCase of cases) {
        try {
          const input = this.formatInput(testCase.input, language);
          const result = await pistonService.execute(
            language,
            wrappedCode,
            input
          );

          if (result.run.code !== 0 || result.run.stderr) {
            throw new Error(result.run.stderr || result.run.output);
          }

          const actual = this.parseOutput(result.run.stdout, language);
          // @ts-ignore TODO: Fix this type error later
          const comparisonStrategy =
            testCases.metadata.comparisonStrategy || "exactOrder";
          const passed = this.compareResults(
            actual,
            testCase.expected,
            comparisonStrategy
          );

          results.push({
            ...testCase,
            actual,
            passed,
          });

          if (!passed) {
            allPassed = false;
            break;
          }
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : "Execution failed";
          if (results.length === 0) {
            throw new Error(errorMsg);
          }
          results.push({
            ...testCase,
            actual: [],
            passed: false,
          });
          allPassed = false;
          break;
        }
      }

      return {
        success: allPassed,
        output: allPassed ? "All tests passed" : "Some tests failed",
        executionTime: Date.now() - startTime,
        testResults: results,
      };
    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : "Execution failed",
        executionTime: Date.now() - startTime,
        testResults: [],
        error: error instanceof Error ? error.message : "Execution failed",
      };
    }
  }

  /**
   * Get starter code template for language
   */
  getTemplate(language: string): string {
    return templates[language as keyof typeof templates] || "";
  }

  /**
   * Parse custom test cases from user input
   */
  private parseCustomTests(customTests: string): TestCase[] {
    const lines = customTests
      .trim()
      .split("\n")
      .filter((line) => line.trim());

    return lines.map((line) => {
      const parts = line.split("|");
      if (parts.length >= 3) {
        const numbers = JSON.parse(parts[0].trim());
        const target = parseInt(parts[1].trim());
        const expected = JSON.parse(parts[2].trim());

        return {
          input: { numbers, target },
          expected,
          explanation: `Custom test case`,
        };
      }
      throw new Error(`Invalid test case format: ${line}`);
    });
  }

  /**
   * Format input for execution
   */
  private formatInput(
    input: { numbers: number[]; target: number },
    language: string
  ): string {
    return `${JSON.stringify(input.numbers)}\n${input.target}`;
  }

  /**
   * Wrap user code with test harness
   */
  private wrapCode(code: string, language: string): string {
    switch (language) {
      case "javascript":
        return `${code}

// Test harness
const readline = require('readline');
const rl = readline.createInterface({input: process.stdin});
let input = '';
rl.on('line', line => input += line + '\\n');
rl.on('close', () => {
  const lines = input.trim().split('\\n');
  const numbers = JSON.parse(lines[0]);
  const target = parseInt(lines[1]);
  const result = twoSum(numbers, target);
  console.log(JSON.stringify(result));
});`;

      case "typescript":
        return `${code}

// Test harness
const readline = require('readline');
const rl = readline.createInterface({input: process.stdin});
let input = '';
rl.on('line', line => input += line + '\\n');
rl.on('close', () => {
  const lines = input.trim().split('\\n');
  const numbers = JSON.parse(lines[0]);
  const target = parseInt(lines[1]);
  const result = twoSum(numbers, target);
  console.log(JSON.stringify(result));
});`;

      case "python":
        return `${code}

# Test harness
import sys
import json

lines = sys.stdin.read().strip().split('\\n')
numbers = json.loads(lines[0])
target = int(lines[1])
result = twoSum(numbers, target)
print(json.dumps(result))`;

      case "java":
        return `import java.util.*;
import java.io.*;

${code.replace(/class Solution/, "class Main")}

public static void main(String[] args) throws IOException {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    String numbersStr = br.readLine();
    int target = Integer.parseInt(br.readLine());

    // Parse array from JSON string
    numbersStr = numbersStr.substring(1, numbersStr.length() - 1);
    String[] parts = numbersStr.split(",");
    int[] numbers = new int[parts.length];
    for (int i = 0; i < parts.length; i++) {
        numbers[i] = Integer.parseInt(parts[i].trim());
    }

    Main solution = new Main();
    int[] result = solution.twoSum(numbers, target);
    System.out.println("[" + result[0] + "," + result[1] + "]");
}`;

      case "cpp":
        return `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

${code}

int main() {
    string line;
    getline(cin, line);

    // Parse JSON array
    vector<int> numbers;
    line = line.substr(1, line.length() - 2);
    stringstream ss(line);
    string num;
    while (getline(ss, num, ',')) {
        numbers.push_back(stoi(num));
    }

    int target;
    cin >> target;

    Solution solution;
    vector<int> result = solution.twoSum(numbers, target);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`;

      case "c":
        return `#include <stdio.h>
#include <stdlib.h>

${code}

int main() {
    int numbers[] = {2, 7, 11, 15};
    int target = 9;
    int returnSize;
    int* result = twoSum(numbers, 4, target, &returnSize);
    printf("[%d,%d]\\n", result[0], result[1]);
    free(result);
    return 0;
}`;

      case "go":
        return `package main

import (
    "encoding/json"
    "fmt"
    "strconv"
    "strings"
)

${code}

func main() {
    var input string
    fmt.Scanln(&input)
    var target int
    fmt.Scanln(&target)

    // Parse JSON array
    input = strings.Trim(input, "[]")
    parts := strings.Split(input, ",")
    numbers := make([]int, len(parts))
    for i, part := range parts {
        numbers[i], _ = strconv.Atoi(strings.TrimSpace(part))
    }

    result := twoSum(numbers, target)
    output, _ := json.Marshal(result)
    fmt.Println(string(output))
}`;

      case "rust":
        return `use std::io;

${code}

fn main() {
    let numbers = vec![2, 7, 11, 15];
    let target = 9;
    let result = Solution::two_sum(numbers, target);
    println!("[{},{}]", result[0], result[1]);
}`;

      default:
        return code;
    }
  }

  /**
   * Parse execution output
   */
  private parseOutput(stdout: string, language: string): number[] {
    const lines = stdout.trim().split("\n");
    const resultLines = lines.filter(
      (line) => line.trim() && !line.includes("defined successfully")
    );

    for (let i = resultLines.length - 1; i >= 0; i--) {
      const line = resultLines[i].trim();
      if (line.startsWith("[") && line.endsWith("]")) {
        try {
          return JSON.parse(line);
        } catch {
          continue;
        }
      }
    }

    throw new Error("No valid output received from execution");
  }

  /**
   * Compare expected vs actual results
   */
  private compareResults(
    actual: number[],
    expected: any,
    strategy: string
  ): boolean {
    switch (strategy) {
      case "unorderedElementsMatchAny":
        if (!Array.isArray(expected) || !Array.isArray(expected[0])) {
          // Expected should be an array of arrays (e.g., number[][])
          return false;
        }
        if (!actual || actual.length === 0) {
          // if expected has items, and actual is empty, it's a mismatch
          return expected.length === 0 || expected[0].length === 0;
        }
        const sortedActual = [...actual].sort((a, b) => a - b);
        for (const expArr of expected as number[][]) {
          if (expArr.length !== sortedActual.length) continue;
          const sortedExpArr = [...expArr].sort((a, b) => a - b);
          if (sortedActual.every((val, idx) => val === sortedExpArr[idx])) {
            return true;
          }
        }
        return false;
      case "exactOrder": // Fallback to original logic or if explicitly set
      default:
        if (!Array.isArray(expected) || actual.length !== expected.length)
          return false;
        return actual.every((val, idx) => val === (expected as number[])[idx]);
    }
  }
}

export const twoSumIIExecutor = new TwoSumIIExecutor();
export default twoSumIIExecutor;
