# Three Sum Closest

## Problem Overview
**Difficulty**: Medium
**Time Estimate**: 35-45 minutes
**Pattern Category**: Pattern Adaptation
**LeetCode**: #16

Find three integers whose sum is closest to target. Return the sum of the three integers.

## Learning Objectives
- [ ] Adapt 3Sum pattern for optimization problems
- [ ] Master closest value tracking strategy
- [ ] Understand pattern modification techniques
- [ ] Apply systematic pattern variation

## Pattern Discovery

### Adaptation Challenge
How is this different from regular 3Sum?
- 3Sum: Find exact sum = 0
- 3Sum Closest: Find sum closest to target

**Same structure, different goal**:
- Fix one element
- Use two pointers on remaining
- Track best sum instead of collecting results

## Implementation Template
```python
def threeSumClosest(nums, target):
    nums.sort()
    closest_sum = float('inf')

    for i in range(len(nums) - 2):
        left, right = i + 1, len(nums) - 1

        while left < right:
            current_sum = nums[i] + nums[left] + nums[right]

            # TODO: Update closest_sum if current is closer

            if current_sum == target:
                return target  # Exact match
            elif current_sum < target:
                # TODO: Move which pointer?
                pass
            else:
                # TODO: Move which pointer?
                pass

    return closest_sum
```

## Test Cases
```python
test_cases = [
    {
        "input": {"nums": [-1,2,1,-4], "target": 1},
        "expected": 2,
        "explanation": "Sum closest to 1 is 2 (-1+2+1)"
    },
    {
        "input": {"nums": [0,0,0], "target": 1},
        "expected": 0,
        "explanation": "Only possible sum is 0"
    }
]
```

## Success Criteria
- [ ] Adapt 3Sum pattern correctly
- [ ] Track closest sum accurately
- [ ] Handle edge cases
- [ ] Achieve O(n²) time complexity

## Pattern Connections
- **Base**: 3Sum (same structure)
- **Variation**: Optimization vs exact match
- **Next**: Hybrid patterns
