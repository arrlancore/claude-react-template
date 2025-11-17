# Move Zeroes

## Problem Overview
**Difficulty**: Easy
**Time Estimate**: 30-40 minutes
**Pattern Category**: Same-Direction
**LeetCode**: #283

Move all 0's to the end of array while maintaining relative order of non-zero elements. Must do this in-place.

## Learning Objectives
- [ ] Master same-direction two pointer technique
- [ ] Understand fast-slow pointer variation
- [ ] Apply in-place modification strategy
- [ ] Learn pointer roles: write vs read

## Pattern Discovery

### New Pattern Question
Previous problems used pointers moving toward each other. This uses pointers moving in **same direction**. Why?

Array: `[0,1,0,3,12]`
- Slow pointer: tracks where to write next non-zero
- Fast pointer: finds non-zero elements

### Key Insight
Two pointers, same direction:
- Fast pointer scans array
- Slow pointer tracks insertion position
- Swap when fast finds non-zero

## Implementation Template
```python
def moveZeroes(nums):
    slow = 0  # Position to place next non-zero

    for fast in range(len(nums)):
        if nums[fast] != 0:
            # TODO: Swap elements at slow and fast
            # TODO: Move slow pointer
            pass
```

## Test Cases
```python
test_cases = [
    {
        "input": [0,1,0,3,12],
        "expected": [1,3,12,0,0],
        "explanation": "Non-zeros moved left, zeros moved right"
    },
    {
        "input": [0],
        "expected": [0],
        "explanation": "Single zero stays"
    },
    {
        "input": [1,2,3],
        "expected": [1,2,3],
        "explanation": "No zeros to move"
    }
]
```

## Success Criteria
- [ ] Understand same-direction pointer movement
- [ ] Maintain relative order of non-zeros
- [ ] Achieve O(n) time, O(1) space
- [ ] Handle edge cases

## Pattern Connections
- **Previous**: Container (optimization strategy)
- **Next**: 3Sum (combines techniques)
- **New Concept**: Fast-slow pointer pattern
