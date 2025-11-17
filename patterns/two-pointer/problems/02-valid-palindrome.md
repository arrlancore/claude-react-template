# Valid Palindrome

## Problem Overview
**Difficulty**: Easy
**Time Estimate**: 25-35 minutes
**Pattern Category**: Foundation
**LeetCode**: #125

A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

## Learning Objectives
- [ ] Apply two pointer pattern to string validation
- [ ] Understand character comparison vs sum comparison
- [ ] Master pointer movement for validation problems
- [ ] Transfer learning from Two Sum II

## Pattern Discovery

### Transfer Question
How is checking palindromes similar to Two Sum II?
*Hint: Instead of finding sum = target, you're checking if...?*

### Core Insight
Same pointer mechanics, different comparison logic:
- Two Sum II: Move pointers based on sum comparison
- Valid Palindrome: Move pointers based on character comparison

## Implementation Template
```python
def isPalindrome(s):
    # Clean string: keep only alphanumeric, convert to lowercase
    cleaned = ''.join(char.lower() for char in s if char.isalnum())

    left, right = 0, len(cleaned) - 1

    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        # TODO: Move pointers
        pass

    return True
```

## Test Cases
```python
test_cases = [
    {
        "input": "A man a plan a canal Panama",
        "expected": True,
        "explanation": "amanaplanacanalpanama is palindrome"
    },
    {
        "input": "race a car",
        "expected": False,
        "explanation": "raceacar is not palindrome"
    },
    {
        "input": " ",
        "expected": True,
        "explanation": "empty string after cleaning"
    }
]
```

## Success Criteria
- [ ] Recognize pattern transfer from Two Sum II
- [ ] Implement string cleaning correctly
- [ ] Handle edge cases (empty, single char)
- [ ] Achieve O(n) time, O(1) space

## Pattern Connections
- **Previous**: Two Sum II (same pointer movement)
- **Next**: Container With Most Water (optimization logic)
- **Advanced**: Valid Palindrome II (decision trees)
