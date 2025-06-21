# Remove Nth Node From End of List

## Problem Overview
**Difficulty**: Medium
**Time Estimate**: 35-45 minutes
**Pattern Category**: Linked Lists
**LeetCode**: #19

Remove the nth node from the end of a linked list and return its head. Do this in one pass.

## Learning Objectives
- [ ] Apply two pointers to linked list problems
- [ ] Master fast-slow pointer with fixed gap
- [ ] Understand one-pass elimination strategy
- [ ] Transfer array technique to linked structures

## Pattern Discovery

### One-Pass Challenge
How do you find the nth node from the end in one pass without knowing the list length?

**Two-pointer solution**:
- Fast pointer: moves n+1 steps ahead
- Slow pointer: starts at head
- Move both together until fast reaches end
- Slow will be at node before target

### Gap Strategy
List: `1→2→3→4→5`, remove 2nd from end (node 4)

1. Fast moves 3 steps: `1→2→3`
2. Both move together: Fast at null, Slow at node 3
3. Remove `slow.next` (node 4)

## Implementation Template
```python
def removeNthFromEnd(head, n):
    # Create dummy node for edge cases
    dummy = ListNode(0)
    dummy.next = head

    fast = dummy
    slow = dummy

    # Move fast n+1 steps ahead
    for _ in range(n + 1):
        fast = fast.next

    # Move both until fast reaches end
    while fast:
        # TODO: Move both pointers
        pass

    # Remove the nth node
    slow.next = slow.next.next

    return dummy.next
```

## Test Cases
```python
test_cases = [
    {
        "input": {"head": [1,2,3,4,5], "n": 2},
        "expected": [1,2,3,5],
        "explanation": "Remove 4 (2nd from end)"
    },
    {
        "input": {"head": [1], "n": 1},
        "expected": [],
        "explanation": "Remove only node"
    },
    {
        "input": {"head": [1,2], "n": 1},
        "expected": [1],
        "explanation": "Remove last node"
    }
]
```

## Success Criteria
- [ ] Remove correct node in one pass
- [ ] Handle edge cases (remove first/last)
- [ ] Use dummy node technique properly
- [ ] Maintain fixed gap between pointers

## Pattern Connections
- **Transfer**: Array two pointers → Linked list
- **Technique**: Fast-slow with fixed gap
- **Level Completion**: Final Level 1 problem
- **Next**: Advanced variations in Level 2
