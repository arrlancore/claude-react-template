# Container With Most Water

## Problem Overview
**Difficulty**: Medium
**Time Estimate**: 35-45 minutes
**Pattern Category**: Optimization
**LeetCode**: #11

Given n non-negative integers representing heights, find two lines that form a container holding the most water.

## Learning Objectives
- [ ] Apply two pointers for optimization problems
- [ ] Understand greedy pointer movement decisions
- [ ] Master area maximization strategy
- [ ] Learn when to move which pointer

## Pattern Discovery

### Optimization Question
Array: `[1,8,6,2,5,4,8,3,7]`
Starting: left=0 (height=1), right=8 (height=7)
Current area: min(1,7) * 8 = 8

**Which pointer should move to potentially find larger area?**

### Key Insight
Always move the pointer with the smaller height. Why?
- Moving the taller pointer can only decrease area
- Moving the shorter pointer might find a taller line

## Implementation Template
```python
def maxArea(height):
    left, right = 0, len(height) - 1
    max_area = 0

    while left < right:
        width = right - left
        current_area = min(height[left], height[right]) * width
        max_area = max(max_area, current_area)

        # TODO: Which pointer to move?
        if height[left] < height[right]:
            pass  # Move which pointer?
        else:
            pass  # Move which pointer?

    return max_area
```

## Test Cases
```python
test_cases = [
    {
        "input": [1,8,6,2,5,4,8,3,7],
        "expected": 49,
        "explanation": "Lines at index 1 and 8: min(8,7) * 7 = 49"
    },
    {
        "input": [1,1],
        "expected": 1,
        "explanation": "Only two lines: min(1,1) * 1 = 1"
    }
]
```

## Success Criteria
- [ ] Understand greedy optimization strategy
- [ ] Implement correct pointer movement logic
- [ ] Achieve O(n) time complexity
- [ ] Handle edge cases

## Pattern Connections
- **Previous**: Valid Palindrome (pointer movement)
- **Next**: Move Zeroes (same-direction pointers)
- **Key Insight**: Greedy pointer selection for optimization
