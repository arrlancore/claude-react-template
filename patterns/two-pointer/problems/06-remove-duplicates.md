# Remove Duplicates from Sorted Array

## Problem Overview
**Difficulty**: Easy
**Time Estimate**: 25-35 minutes
**Pattern Category**: In-Place Modification
**LeetCode**: #26

Remove duplicates from sorted array in-place, return new length. Order of elements can be changed, but first k elements should have final result.

## Learning Objectives
- [ ] Apply two pointers for in-place array modification
- [ ] Master duplicate detection and removal
- [ ] Understand write pointer technique
- [ ] Optimize space complexity to O(1)

## Pattern Discovery

### In-Place Strategy
Array: `[1,1,2,2,3]`
How do you remove duplicates without extra space?

**Similar to Move Zeroes**:
- Slow pointer: tracks where to write next unique element
- Fast pointer: scans array for new unique elements

## Implementation Template
```python
def removeDuplicates(nums):
    if not nums:
        return 0

    slow = 0  # Position for next unique element

    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            # TODO: Move slow pointer
            # TODO: Place unique element
            pass

    return slow + 1  # Length of unique elements
```

## Test Cases
```python
test_cases = [
    {
        "input": [1,1,2],
        "expected": 2,
        "result_array": [1,2],
        "explanation": "First 2 elements should be [1,2]"
    },
    {
        "input": [0,0,1,1,1,2,2,3,3,4],
        "expected": 5,
        "result_array": [0,1,2,3,4],
        "explanation": "First 5 elements should be unique"
    }
]
```

## Success Criteria
- [ ] Return correct length of unique elements
- [ ] Modify array in-place correctly
- [ ] Achieve O(n) time, O(1) space
- [ ] Handle edge cases (empty, single element)

## Pattern Connections
- **Similar**: Move Zeroes (same-direction pointers)
- **Next**: Sort Colors (three-pointer variation)
- **Concept**: In-place modification with two pointers
