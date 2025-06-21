# Two Sum II - Input Array is Sorted

## Problem Overview
**Difficulty**: Easy
**Time Estimate**: 30-45 minutes
**Pattern Category**: Foundation
**LeetCode**: #167

Given a **1-indexed** array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.

## Learning Objectives
- [ ] Understand opposite-direction two pointer movement
- [ ] Master strategic pointer movement decisions
- [ ] Apply pattern to sorted array optimization
- [ ] Recognize Two Pointer opportunities in sum problems

## Pattern Discovery

### Core Insight Question 1
You have array `[2, 7, 11, 15]` and target `9`.
Starting with pointers at positions 0 and 3 (values 2 and 15).
Current sum = 17, which is > 9.

**Which pointer should move and why?**

### Core Insight Question 2
**Why does this work? What property of the array makes this optimization possible?**

## Implementation Template
```python
def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            # TODO: Which pointer should move?
            pass
        else:
            # TODO: Which pointer should move?
            pass

    return []  # No solution found
```

## Test Cases
```python
test_cases = [
    {
        "input": {"numbers": [2,7,11,15], "target": 9},
        "expected": [1,2],
        "explanation": "2 + 7 = 9, return indices 1 and 2"
    },
    {
        "input": {"numbers": [2,3,4], "target": 6},
        "expected": [1,3],
        "explanation": "2 + 4 = 6, return indices 1 and 3"
    },
    {
        "input": {"numbers": [-1,0], "target": -1},
        "expected": [1,2],
        "explanation": "-1 + 0 = -1, return indices 1 and 2"
    }
]
```

## Success Criteria
- [ ] Recognize this as Two Pointer opportunity within 30 seconds
- [ ] Implement correct solution within 15 minutes
- [ ] Explain why the algorithm works
- [ ] Achieve O(n) time complexity
- [ ] Handle edge cases correctly

## Pattern Connections
This problem demonstrates the foundation of **opposite-direction two pointers**:
- **Next Problem**: Valid Palindrome (same movement pattern, different comparison)
- **Advanced Application**: 3Sum (combines fixed element + two pointers)
- **Optimization Pattern**: Container With Most Water (optimization using two pointers)
