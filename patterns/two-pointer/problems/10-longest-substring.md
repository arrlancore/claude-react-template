# Longest Substring Without Repeating Characters

## Problem Overview
**Difficulty**: Medium
**Time Estimate**: 45-55 minutes
**Pattern Category**: Hybrid (Two Pointer + Sliding Window)
**LeetCode**: #3

Find the length of the longest substring without repeating characters.

## Learning Objectives
- [ ] Combine two pointer with sliding window technique
- [ ] Master dynamic window resizing
- [ ] Apply character frequency tracking
- [ ] Understand hybrid pattern combinations

## Pattern Discovery

### Hybrid Pattern
This problem combines:
- **Two Pointer**: Left and right boundaries
- **Sliding Window**: Expandable/contractible window
- **Hash Set**: Track characters in current window

### Window Strategy
String: `"abcabcbb"`
- Expand right until duplicate found
- Contract left until duplicate removed
- Track maximum window size

## Implementation Template
```python
def lengthOfLongestSubstring(s):
    char_set = set()
    left = 0
    max_length = 0

    for right in range(len(s)):
        # Shrink window while duplicate exists
        while s[right] in char_set:
            # TODO: Remove character and move left
            pass

        # TODO: Add current character to set
        # TODO: Update max_length

    return max_length
```

## Test Cases
```python
test_cases = [
    {
        "input": "abcabcbb",
        "expected": 3,
        "explanation": "abc is longest without repeats"
    },
    {
        "input": "bbbbb",
        "expected": 1,
        "explanation": "Single character b"
    },
    {
        "input": "pwwkew",
        "expected": 3,
        "explanation": "wke is longest without repeats"
    }
]
```

## Success Criteria
- [ ] Implement sliding window correctly
- [ ] Handle character tracking properly
- [ ] Achieve O(n) time complexity
- [ ] Understand hybrid pattern combination

## Pattern Connections
- **Two Pointer**: Window boundaries
- **Sliding Window**: Dynamic resizing
- **Advanced**: Pattern combination technique
