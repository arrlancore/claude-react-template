---
objectives: ["Understand opposite-direction pointer movement", "Master strategic pointer decisions", "Apply pattern to sorted arrays"]
---

# Two Sum II - Input Array is Sorted

Given a **1-indexed** array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.

## Problem Statement

Return the indices of the two numbers (1-indexed) such that they add up to the target, where index1 < index2.

You may assume that each input would have exactly one solution and you may not use the same element twice.

Your solution must use only constant extra space.

## Examples

**Example 1:**
```
Input: numbers = [2,7,11,15], target = 9
Output: [1,2]
Explanation: The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2.
```

**Example 2:**
```
Input: numbers = [2,3,4], target = 6
Output: [1,3]
Explanation: The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3.
```

## Constraints

- 2 ≤ numbers.length ≤ 3 * 10⁴
- -1000 ≤ numbers[i] ≤ 1000
- numbers is sorted in non-decreasing order
- -1000 ≤ target ≤ 1000
- The tests are generated such that there is exactly one solution

## Approach

This problem is perfect for the **Two Pointer technique** because:

1. **Array is sorted** - This allows strategic pointer movement
2. **Single solution exists** - No need to handle multiple solutions
3. **Constant space required** - Two pointers use O(1) space

### Key Insight

When sum is too high → move right pointer left (decrease sum)
When sum is too low → move left pointer right (increase sum)

## Template

```python
def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1  # Need larger sum
        else:
            right -= 1  # Need smaller sum

    return []  # Should never reach here per problem constraints
```

## Complexity

- **Time:** O(n) - Single pass through array
- **Space:** O(1) - Only two pointers used
