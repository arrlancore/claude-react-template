# Three Sum

## Problem Overview
**Difficulty**: Medium
**Time Estimate**: 50-70 minutes
**Pattern Category**: Critical Mastery
**LeetCode**: #15

Find all unique triplets that sum to zero. The solution set must not contain duplicate triplets.

## Learning Objectives
- [ ] Combine fixed element with two pointers
- [ ] Master duplicate handling strategy
- [ ] Apply nested two pointer technique
- [ ] Understand complexity optimization (O(n³) → O(n²))

## Pattern Discovery

### Critical Question
How do you find THREE numbers that sum to zero using two pointer technique?

**Key Insight**: Fix one number, use two pointers for the rest!
- Fix `nums[i]`
- Find two numbers in remaining array that sum to `-nums[i]`
- That's just Two Sum II on the remaining array!

### Duplicate Challenge
Array: `[-1,0,1,2,-1,-4]` → Sorted: `[-4,-1,-1,0,1,2]`
How do you avoid duplicate triplets like `[-1,0,1]` appearing twice?

## Implementation Template
```python
def threeSum(nums):
    nums.sort()
    result = []

    for i in range(len(nums) - 2):
        # TODO: Skip duplicates for fixed element
        if i > 0 and nums[i] == nums[i-1]:
            continue

        left, right = i + 1, len(nums) - 1
        target = -nums[i]

        while left < right:
            current_sum = nums[left] + nums[right]

            if current_sum == target:
                result.append([nums[i], nums[left], nums[right]])

                # TODO: Skip duplicates for left pointer
                # TODO: Skip duplicates for right pointer
                # TODO: Move both pointers
                pass
            elif current_sum < target:
                # TODO: Which pointer to move?
                pass
            else:
                # TODO: Which pointer to move?
                pass

    return result
```

## Test Cases
```python
test_cases = [
    {
        "input": [-1,0,1,2,-1,-4],
        "expected": [[-1,-1,2],[-1,0,1]],
        "explanation": "Two unique triplets sum to 0"
    },
    {
        "input": [0,1,1],
        "expected": [],
        "explanation": "No triplet sums to 0"
    },
    {
        "input": [0,0,0],
        "expected": [[0,0,0]],
        "explanation": "One triplet: all zeros"
    }
]
```

## Success Criteria
- [ ] Recognize fixed element + two pointer pattern
- [ ] Handle duplicates correctly
- [ ] Achieve O(n²) time complexity
- [ ] Implement nested pointer logic

## Pattern Connections
- **Foundation**: Two Sum II (inner loop logic)
- **Next**: Remove Duplicates (in-place modification)
- **Critical**: Most important pattern combination for interviews
