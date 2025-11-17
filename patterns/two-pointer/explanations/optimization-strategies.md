# Optimization Strategies for Two Pointer Problems

## Performance Optimization Techniques

### 1. Early Termination Strategies

#### Perfect Match Found
```python
def twoSum(nums, target):
    left, right = 0, len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]

        if current_sum == target:
            return [left, right]  # Early exit on exact match
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return []
```

### 2. Memory Optimization

#### In-Place Modifications
```python
def moveZeroes(nums):
    """Move zeroes to end without extra space"""
    write_pos = 0

    for read_pos in range(len(nums)):
        if nums[read_pos] != 0:
            nums[write_pos] = nums[read_pos]
            write_pos += 1

    while write_pos < len(nums):
        nums[write_pos] = 0
        write_pos += 1
```

## Algorithm-Specific Optimizations

### 1. Container With Most Water
```python
def maxArea(height):
    left, right = 0, len(height) - 1
    max_area = 0

    while left < right:
        width = right - left
        current_height = min(height[left], height[right])
        current_area = width * current_height
        max_area = max(max_area, current_area)

        # Move pointer with smaller height
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_area
```

### 2. Smart Pointer Movement
```python
def twoSum(nums, target):
    left, right = 0, len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]

        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return []
```

## Space Complexity Optimizations

### 1. In-Place Sorting (Dutch Flag)
```python
def sortColors(nums):
    """Sort 0s, 1s, 2s without extra space"""
    red = current = 0
    blue = len(nums) - 1

    while current <= blue:
        if nums[current] == 0:
            nums[red], nums[current] = nums[current], nums[red]
            red += 1
            current += 1
        elif nums[current] == 1:
            current += 1
        else:  # nums[current] == 2
            nums[blue], nums[current] = nums[current], nums[blue]
            blue -= 1
```

### 2. Constant Space Solutions
```python
def hasCycle(head):
    """Detect cycle with O(1) space using Floyd's algorithm"""
    if not head or not head.next:
        return False

    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True

    return False
```

## Key Optimization Principles

### 1. Minimize Comparisons
- Skip duplicate values efficiently
- Use early termination when possible
- Eliminate impossible cases upfront

### 2. Optimize Memory Access
- Maintain sequential access patterns
- Minimize cache misses
- Use in-place modifications when possible

### 3. Reduce Algorithm Complexity
- Transform O(n³) to O(n²) with fixed element
- Use Two Pointers instead of nested loops
- Leverage sorted array properties

### 4. Handle Edge Cases Efficiently
- Validate inputs early
- Use fast paths for simple cases
- Minimize branching in hot loops
