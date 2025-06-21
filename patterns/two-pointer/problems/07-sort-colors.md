# Sort Colors (Dutch National Flag)

## Problem Overview
**Difficulty**: Medium
**Time Estimate**: 40-50 minutes
**Pattern Category**: Three-Pointer
**LeetCode**: #75

Sort array with only 0s, 1s, and 2s in-place. Must use constant extra space.

## Learning Objectives
- [ ] Master three-pointer technique
- [ ] Understand partitioning strategy
- [ ] Apply Dutch National Flag algorithm
- [ ] Coordinate multiple pointer movements

## Pattern Discovery

### Three-Pointer Strategy
Array: `[2,0,2,1,1,0]`
Need three sections: [0s][1s][2s]

**Three pointers**:
- `left`: boundary of 0s section
- `current`: scanning pointer
- `right`: boundary of 2s section

### Movement Rules
- If `nums[current] == 0`: swap with `left`, move both pointers
- If `nums[current] == 1`: just move `current`
- If `nums[current] == 2`: swap with `right`, move only `right`

**Why different movement for 2s?** After swapping with `right`, we don't know what element we got, so `current` stays to re-examine.

## Implementation Template
```python
def sortColors(nums):
    left = 0      # Boundary of 0s
    current = 0   # Scanning pointer
    right = len(nums) - 1  # Boundary of 2s

    while current <= right:
        if nums[current] == 0:
            # TODO: Swap and move both pointers
            pass
        elif nums[current] == 1:
            # TODO: Move current only
            pass
        else:  # nums[current] == 2
            # TODO: Swap and move right only
            pass
```

## Test Cases
```python
test_cases = [
    {
        "input": [2,0,2,1,1,0],
        "expected": [0,0,1,1,2,2],
        "explanation": "All 0s, then 1s, then 2s"
    },
    {
        "input": [2,0,1],
        "expected": [0,1,2],
        "explanation": "One of each color"
    },
    {
        "input": [0],
        "expected": [0],
        "explanation": "Single element"
    }
]
```

## Success Criteria
- [ ] Coordinate three pointers correctly
- [ ] Handle all three cases properly
- [ ] Achieve O(n) time, O(1) space
- [ ] Sort array in single pass

## Pattern Connections
- **Extension**: Two pointers → three pointers
- **Next**: Remove Nth Node (different data structure)
- **Advanced**: Multiple pointer coordination
