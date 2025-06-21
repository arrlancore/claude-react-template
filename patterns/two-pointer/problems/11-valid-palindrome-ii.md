# Valid Palindrome II

## Problem Overview
**Difficulty**: Easy
**Time Estimate**: 30-40 minutes
**Pattern Category**: Advanced String Manipulation
**LeetCode**: #680

Determine if string can be a palindrome after deleting at most one character.

## Learning Objectives
- [ ] Apply decision trees with two pointers
- [ ] Master conditional pointer movement
- [ ] Understand recursive/helper function patterns
- [ ] Handle complex validation logic

## Pattern Discovery

### Decision Tree Challenge
When characters don't match, you have two choices:
1. Skip left character and check remaining
2. Skip right character and check remaining

**Strategy**: Try both options, return true if either works.

### Helper Function Pattern
```python
def isPalindrome(s, left, right):
    # Standard two-pointer palindrome check
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
```

## Implementation Template
```python
def validPalindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        if s[left] != s[right]:
            # Try skipping left character OR right character
            # TODO: Check if remaining is palindrome after skipping left
            # TODO: Check if remaining is palindrome after skipping right
            # TODO: Return true if either option works
            pass

        left += 1
        right -= 1

    return True  # Already palindrome

def isPalindrome(s, left, right):
    # TODO: Implement helper function
    pass
```

## Test Cases
```python
test_cases = [
    {
        "input": "aba",
        "expected": True,
        "explanation": "Already palindrome"
    },
    {
        "input": "abca",
        "expected": True,
        "explanation": "Remove 'c' to get 'aba'"
    },
    {
        "input": "abc",
        "expected": False,
        "explanation": "Cannot make palindrome with one deletion"
    }
]
```

## Success Criteria
- [ ] Handle decision tree correctly
- [ ] Implement helper function properly
- [ ] Try both skip options
- [ ] Achieve O(n) time complexity

## Pattern Connections
- **Base**: Valid Palindrome (basic pattern)
- **Advanced**: Decision trees and branching
- **Next**: Pattern variations with conditions
