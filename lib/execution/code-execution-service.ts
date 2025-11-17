/**
 * Code execution service wrapper
 * Handles Two Sum problem execution with test cases
 */

import pistonService, { ExecutionResult } from './piston-service';

export interface TestCase {
  input: string;
  expected: string;
  actual?: string;
  passed?: boolean;
}

export interface ExecutionResponse {
  success: boolean;
  output: string;
  executionTime: number;
  testResults: TestCase[];
  error?: string;
}

// Two Sum test cases
const TWO_SUM_TESTS: TestCase[] = [
  { input: "[2,7,11,15]\n9", expected: "[0,1]" },
  { input: "[3,2,4]\n6", expected: "[1,2]" },
  { input: "[-1,0]\n-1", expected: "[0,1]" },
];

class CodeExecutionService {
  /**
   * Execute code for Two Sum problem
   */
  async executeTwoSum(language: string, code: string, customTests?: string): Promise<ExecutionResponse> {
    const startTime = Date.now();

    try {
      // Use custom tests if provided, otherwise default
      const testCases = customTests ? this.parseCustomTestCases(customTests) : TWO_SUM_TESTS;
      const wrappedCode = this.wrapTwoSumCode(code, language);

      const testResults: TestCase[] = [];
      let allPassed = true;
      let debugOutput = "";

      // Execute each test case with early return
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];

        try {
          const result = await pistonService.execute(language, wrappedCode, testCase.input);

          // Check for runtime errors
          if (result.run.code !== 0 || result.run.stderr) {
            throw new Error(result.run.stderr || result.run.output);
          }

          const actual = this.parseOutput(result.run.stdout, language);
          const passed = this.compareResults(actual, testCase.expected);

          testResults.push({
            ...testCase,
            actual,
            passed
          });

          // Early return on first failure
          if (!passed) {
            allPassed = false;
            break;
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Execution failed';
          if (i === 0) {
            throw new Error(errorMsg);
          }
          testResults.push({
            ...testCase,
            actual: "",
            passed: false
          });
          allPassed = false;
          break;
        }
      }

      const executionTime = Date.now() - startTime;

      return {
        success: allPassed,
        output: debugOutput || "Code executed successfully",
        executionTime,
        testResults
      };

    } catch (error) {
      return {
        success: false,
        output: error instanceof Error ? error.message : 'Execution failed',
        executionTime: Date.now() - startTime,
        testResults: [],
        error: error instanceof Error ? error.message : 'Execution failed'
      };
    }
  }

  /**
   * Parse custom test cases from string
   */
  private parseCustomTestCases(customTests: string): TestCase[] {
    const lines = customTests.trim().split('\n').filter(line => line.trim());

    return lines.map(line => {
      const parts = line.split('|');
      if (parts.length >= 3) {
        const nums = parts[0].trim();
        const target = parts[1].trim();
        const expected = parts[2].trim();

        return {
          input: `${nums}\n${target}`,
          expected: expected
        };
      }
      // Fallback for invalid format
      return {
        input: "[]\n0",
        expected: "null"
      };
    });
  }

  /**
   * Wrap Two Sum code with test harness
   */
  private wrapTwoSumCode(code: string, language: string): string {
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
  const nums = JSON.parse(lines[0]);
  const target = parseInt(lines[1]);
  const result = twoSum(nums, target);
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
  const nums = JSON.parse(lines[0]);
  const target = parseInt(lines[1]);
  const result = twoSum(nums, target);
  console.log(JSON.stringify(result));
});`;

      case "python":
        return `${code}

# Test harness
import sys
import json

lines = sys.stdin.read().strip().split('\\n')
nums = json.loads(lines[0])
target = int(lines[1])
result = twoSum(nums, target)
print(json.dumps(result))`;

      case "java":
        return `import java.util.*;
import java.io.*;

${code.replace(/class Solution/, 'class Main')}

public static void main(String[] args) throws IOException {
    BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    String numsStr = br.readLine();
    int target = Integer.parseInt(br.readLine());

    // Parse array from string like [2,7,11,15]
    numsStr = numsStr.substring(1, numsStr.length() - 1);
    String[] parts = numsStr.split(",");
    int[] nums = new int[parts.length];
    for (int i = 0; i < parts.length; i++) {
        nums[i] = Integer.parseInt(parts[i].trim());
    }

    Main solution = new Main();
    int[] result = solution.twoSum(nums, target);
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

    // Parse array [2,7,11,15]
    vector<int> nums;
    line = line.substr(1, line.length() - 2);
    stringstream ss(line);
    string num;
    while (getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }

    int target;
    cin >> target;

    Solution solution;
    vector<int> result = solution.twoSum(nums, target);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`;

      case "c":
        return `#include <stdio.h>
#include <stdlib.h>

${code}

int main() {
    // Simple test for C
    int nums[] = {2, 7, 11, 15};
    int target = 9;
    int returnSize;
    int* result = twoSum(nums, 4, target, &returnSize);
    printf("[%d,%d]\\n", result[0], result[1]);
    free(result);
    return 0;
}`;

      case "go":
        return `package main

import (
    "encoding/json"
    "fmt"
    "os"
    "strconv"
    "strings"
)

${code}

func main() {
    var input string
    fmt.Scanln(&input)
    var target int
    fmt.Scanln(&target)

    // Parse array [2,7,11,15]
    input = strings.Trim(input, "[]")
    parts := strings.Split(input, ",")
    nums := make([]int, len(parts))
    for i, part := range parts {
        nums[i], _ = strconv.Atoi(strings.TrimSpace(part))
    }

    result := twoSum(nums, target)
    output, _ := json.Marshal(result)
    fmt.Println(string(output))
}`;

      case "rust":
        return `use std::io;

${code}

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let input = input.trim();

    // Simple test for Rust
    let nums = vec![2, 7, 11, 15];
    let target = 9;
    let result = Solution::two_sum(nums, target);
    println!("[{},{}]", result[0], result[1]);
}`;

      default:
        return code;
    }
  }

  /**
   * Parse execution output to extract result
   */
  private parseOutput(stdout: string, language: string): string {
    const lines = stdout.trim().split('\n');
    // Remove "Function defined successfully" line and get actual result
    const resultLines = lines.filter(line =>
      line.trim() &&
      !line.includes('Function defined successfully') &&
      !line.includes('defined successfully')
    );

    // Get the last meaningful line (usually the result)
    for (let i = resultLines.length - 1; i >= 0; i--) {
      const line = resultLines[i].trim();
      if (line) {
        return line;
      }
    }
    return stdout.trim();
  }

  /**
   * Compare expected vs actual results
   */
  private compareResults(actual: string, expected: string): boolean {
    // Normalize both strings (remove spaces, etc.)
    const normalize = (str: string) => str.replace(/\s/g, '').toLowerCase();
    return normalize(actual) === normalize(expected);
  }
}

export const codeExecutionService = new CodeExecutionService();
export default codeExecutionService;
