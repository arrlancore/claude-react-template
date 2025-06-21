# Squares of a Sorted Array

## Problem Overview
**Difficulty**: Easy
**Time Estimate**: 25-35 minutes
**Pattern Category**: Pattern Variation
**LeetCode**: #977

Given sorted array (can have negative numbers), return sorted array of squares.

## Learning Objectives
- [ ] Apply two pointers with absolute value comparison
- [ ] Master reverse filling technique
- [ ] Understand pointer selection based on magnitude
- [ ] Handle negative number complications

## Pattern Discovery

### Magnitude Challenge
Array: `[-4,-1,0,3,5]`
Squares: `[16,1,0,9,25]` → Sorted: `[0,1,9,16,25]`

**Problem**: Largest squares can be at either end!
- Negative numbers: larger magnitude = larger square
- Need to compare absolute values

### Reverse Fill Strategy
Instead of sorting after, build result array from largest to smallest:
- Compare `|nums[left]|` vs `|nums[right]|`
- Place larger square at end of result
- Move corresponding pointer inward

## Implementation Template
```python
def sortedSquares(nums):
    n = len(nums)
    result = [0] * n
    left, right = 0, n - 1
    pos = n - 1  # Fill from end

    while left <= right:
        left_square = nums[left] * nums[left]
        right_square = nums[right] * nums[right]

        if left_square > right_square:
            # TODO: Place left_square and move left
            pass
        else:
            # TODO: Place right_square and move right
            pass

        # TODO: Move position pointer

    return result
```

## Test Cases
```python
test_cases = [
    {
        "input": [-4,-1,0,3,5],
        "expected": [0,1,9,16,25],
        "explanation": "Squares sorted: 0,1,9,16,25"
    },
    {
        "input": [-7,-3,2,3,11],
        "expected": [4,9,9,49,121],
        "explanation": "Handle duplicate squares"
    },
    {
        "input": [1,2,3,4],
        "expected": [1,4,9,16],
        "explanation": "All positive numbers"
    }
]
```

## Success Criteria
- [ ] Compare absolute values correctly
- [ ] Fill result array from end
- [ ] Handle negative numbers properly
- [ ] Achieve O(n) time, O(n) space

## Pattern Connections
- **Variation**: Absolute value comparison
- **Technique**: Reverse filling
- **Completion**: Level 2 mastery achieved
