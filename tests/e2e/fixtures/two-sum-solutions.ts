/**
 * Two Sum II solution templates for each supported language
 */

export const solutions = {
  javascript: `function twoSum(numbers, target) {
    let left = 0;
    let right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];

        if (sum === target) {
            return [left + 1, right + 1]; // 1-indexed
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    return []; // No solution found
}`,

  typescript: `function twoSum(numbers: number[], target: number): number[] {
    let left = 0;
    let right = numbers.length - 1;

    while (left < right) {
        const sum = numbers[left] + numbers[right];

        if (sum === target) {
            return [left + 1, right + 1]; // 1-indexed
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    return []; // No solution found
}`,

  python: `def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return []  # No solution found`,

  java: `class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0;
        int right = numbers.length - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];

            if (sum == target) {
                return new int[]{left + 1, right + 1}; // 1-indexed
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }

        return new int[]{}; // No solution found
    }
}`,

  cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int left = 0;
        int right = numbers.size() - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];

            if (sum == target) {
                return {left + 1, right + 1}; // 1-indexed
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }

        return {}; // No solution found
    }
};`,

  c: `#include <stdlib.h>

int* twoSum(int* numbers, int numbersSize, int target, int* returnSize) {
    int left = 0;
    int right = numbersSize - 1;
    int* result = (int*)malloc(2 * sizeof(int));

    while (left < right) {
        int sum = numbers[left] + numbers[right];

        if (sum == target) {
            result[0] = left + 1;  // 1-indexed
            result[1] = right + 1;
            *returnSize = 2;
            return result;
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    *returnSize = 0;
    free(result);
    return NULL; // No solution found
}`,

  go: `func twoSum(numbers []int, target int) []int {
    left := 0
    right := len(numbers) - 1

    for left < right {
        sum := numbers[left] + numbers[right]

        if sum == target {
            return []int{left + 1, right + 1} // 1-indexed
        } else if sum < target {
            left++
        } else {
            right--
        }
    }

    return []int{} // No solution found
}`,

  rust: `impl Solution {
    pub fn two_sum(numbers: Vec<i32>, target: i32) -> Vec<i32> {
        let mut left = 0;
        let mut right = numbers.len() - 1;

        while left < right {
            let sum = numbers[left] + numbers[right];

            if sum == target {
                return vec![left as i32 + 1, right as i32 + 1]; // 1-indexed
            } else if sum < target {
                left += 1;
            } else {
                right -= 1;
            }
        }

        vec![] // No solution found
    }
}`
};
