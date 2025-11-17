# Pattern Variations and Extensions

## Core Two Pointer Variations

### 1. Opposite Direction Variations

#### Standard Target Sum
```python
# Classic two sum on sorted array
left, right = 0, len(nums) - 1
while left < right:
    current_sum = nums[left] + nums[right]
    if current_sum == target:
        return [left, right]
    elif current_sum < target:
        left += 1
    else:
        right -= 1
```

#### Closest Sum Variation
```python
# Find pair with sum closest to target
closest_sum = float('inf')
while left < right:
    current_sum = nums[left] + nums[right]
    if abs(current_sum - target) < abs(closest_sum - target):
        closest_sum = current_sum

    if current_sum < target:
        left += 1
    else:
        right -= 1
```

### 2. Same Direction Variations

#### Fast-Slow (Remove Elements)
```python
# Remove all instances of target value
slow = 0
for fast in range(len(nums)):
    if nums[fast] != target:
        nums[slow] = nums[fast]
        slow += 1
return slow  # New length
```

#### Fixed Gap (Nth from End)
```python
# Find nth node from end in linked list
fast = head
# Move fast n steps ahead
for _ in range(n):
    fast = fast.next

slow = head
# Move both until fast reaches end
while fast:
    fast = fast.next
    slow = slow.next
```

### 3. Multi-Pointer Variations

#### Three Pointer (Dutch Flag)
```python
# Sort 0s, 1s, 2s
left = current = 0
right = len(nums) - 1

while current <= right:
    if nums[current] == 0:
        nums[left], nums[current] = nums[current], nums[left]
        left += 1
        current += 1
    elif nums[current] == 1:
        current += 1
    else:  # nums[current] == 2
        nums[right], nums[current] = nums[current], nums[right]
        right -= 1
```

## Advanced Pattern Extensions

### 1. Conditional Two Pointers
```python
# Valid Palindrome II (One Deletion Allowed)
def validPalindrome(s):
    def isPalindrome(left, right):
        while left < right:
            if s[left] != s[right]:
                return False
            left += 1
            right -= 1
        return True

    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return isPalindrome(left + 1, right) or isPalindrome(left, right - 1)
        left += 1
        right -= 1
    return True
```

### 2. Hybrid Patterns
Two Pointers combined with other techniques for complex problems.

### 3. Cross-Domain Applications
- **Arrays**: Sum problems, partitioning
- **Strings**: Palindromes, pattern matching
- **Linked Lists**: Cycle detection, finding middle
- **Trees**: Path problems (less common)

## Pattern Recognition Guide

### When Each Variation Applies:
- **Opposite Direction**: Sorted data, optimization, validation
- **Same Direction**: In-place modification, different speeds
- **Multi-Pointer**: Complex partitioning, multiple constraints
- **Conditional**: Decision trees, multiple valid paths
- **Hybrid**: Complex requirements, multiple techniques needed
