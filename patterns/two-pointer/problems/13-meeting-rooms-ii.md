# Meeting Rooms II

## Problem Overview
**Difficulty**: Medium
**Time Estimate**: 45-60 minutes
**Pattern Category**: Multi-Pattern
**LeetCode**: #253
**Primary Pattern**: Two Pointer
**Supporting Patterns**: Sorting, Greedy

Given an array of meeting time intervals consisting of start and end times `[[s1,e1],[s2,e2],...]`, find the minimum number of conference rooms required.

## Learning Objectives
- [ ] Combine Two Pointer with sorting for data preparation
- [ ] Apply greedy decision making to pointer movement
- [ ] Master interval processing with two pointers
- [ ] Handle real-time event simulation efficiently

## Pattern Breakdown

### Primary Pattern: Two Pointer
**Role**: Core algorithm logic
**Implementation**:
- One pointer tracks meeting start times
- One pointer tracks meeting end times
- Move pointers based on time comparison

### Supporting Pattern: Sorting
**Role**: Data preparation
**Connection**: Creates the sequential order needed for pointer movement
**Quick Explanation**: "Think of sorting like organizing meetings in chronological order - then your Two Pointer skills take over"

### Supporting Pattern: Greedy
**Role**: Decision making
**Connection**: Decides which pointer to move for optimal solution
**Quick Explanation**: "Always make the choice that helps your Two Pointer logic most - same principle you already know"

## Core Insight Discovery

### Discovery Question 1
You have meetings: `[[0,30],[5,10],[15,20]]`

After sorting by start time, you have:
- **Start times**: [0, 5, 15]
- **End times**: [10, 20, 30] (sorted separately)

**Key Insight**: Why do we sort start and end times separately?

**Think about it**: What does each sorted array represent in terms of events?

### Discovery Question 2
**Simulation Thinking**:
- At time 0: Meeting starts (need 1 room)
- At time 5: Another meeting starts (need 2 rooms)
- At time 10: A meeting ends (back to 1 room)
- At time 15: Another meeting starts (need 2 rooms)

**Question**: How do two pointers help track this room count efficiently?

## Algorithm Walkthrough

### Step-by-Step Logic
```python
def minMeetingRooms(intervals):
    if not intervals:
        return 0

    # Separate and sort start and end times
    start_times = sorted([interval[0] for interval in intervals])
    end_times = sorted([interval[1] for interval in intervals])

    # Two pointers for start and end events
    start_pointer = end_pointer = 0
    rooms_needed = max_rooms = 0

    # Process all start events
    while start_pointer < len(start_times):
        # If meeting starts before earliest meeting ends
        if start_times[start_pointer] < end_times[end_pointer]:
            # Need a new room
            rooms_needed += 1
            start_pointer += 1
        else:
            # A room becomes available
            rooms_needed -= 1
            end_pointer += 1

        # Track maximum rooms needed simultaneously
        max_rooms = max(max_rooms, rooms_needed)

    return max_rooms
```

## Pattern Connection Questions

### For Two Pointer Mastery
**Question**: How is this similar to the Two Sum pattern you know well?
- Two Sum: Compare `nums[left] + nums[right]` with target
- Meeting Rooms: Compare `start_times[start_ptr]` with `end_times[end_ptr]`

**Same Logic**: Strategic pointer movement based on comparison!

### For Pattern Transfer
**Question**: What other problems might use this "event simulation" approach with two pointers?

**Examples**:
- Car Fleet problems
- Task Scheduler variations
- Resource allocation problems

## Implementation Template

```python
def minMeetingRooms(intervals):
    if not intervals:
        return 0

    # Step 1: Extract and sort events (Sorting pattern)
    starts = sorted([interval[0] for interval in intervals])
    ends = sorted([interval[1] for interval in intervals])

    # Step 2: Two pointer setup
    start_ptr = end_ptr = 0
    current_rooms = max_rooms = 0

    # Step 3: Process events with two pointers
    while start_ptr < len(starts):
        # TODO: Compare start time with earliest end time
        # TODO: Decide which pointer to move (Greedy pattern)
        # TODO: Update room count
        # TODO: Track maximum
        pass

    return max_rooms
```

## Test Cases

```python
test_cases = [
    {
        "input": [[0,30],[5,10],[15,20]],
        "expected": 2,
        "explanation": "Two meetings overlap at most"
    },
    {
        "input": [[7,10],[2,4]],
        "expected": 1,
        "explanation": "No overlap, one room sufficient"
    },
    {
        "input": [[9,10],[4,9],[4,17]],
        "expected": 2,
        "explanation": "Two rooms needed during overlap"
    },
    {
        "input": [[1,5],[8,9],[8,9]],
        "expected": 2,
        "explanation": "Two meetings start at same time"
    }
]
```

## Adaptive Hints for Unknown Patterns

### If Struggling with Sorting
```
Don't worry about mastering sorting right now! Here's what you need:

**Quick Sorting Concept**:
- `sorted([4,1,3])` returns `[1,3,4]`
- We sort to process events in time order

**Focus on Your Two Pointer Strength**:
Once sorted, you're back in your comfort zone - comparing values and moving pointers strategically!
```

### If Struggling with Greedy
```
The "greedy" part is simple decision making:

**Same as Two Pointer Logic**:
- In Two Sum: "Sum too high? Move right pointer left"
- In Meeting Rooms: "Meeting starts before earliest end? Need new room"

**You already think this way** - just apply it to room management!
```

## Success Criteria
- [ ] Recognize this combines Two Pointer with supporting patterns
- [ ] Understand that Two Pointer drives the core logic
- [ ] Implement solution using two pointers for event processing
- [ ] Achieve O(n log n) time complexity
- [ ] Explain how supporting patterns help Two Pointer work

## Pattern Mastery Questions

### Understanding Check
1. **Core Pattern**: "What makes this fundamentally a Two Pointer problem?"
2. **Pattern Support**: "How do sorting and greedy help your Two Pointer logic?"
3. **Transfer Learning**: "What signals would tell you to use this approach in a new problem?"

### Interview Preparation
**Follow-up Questions You Might Get**:
- "What if meetings could be in multiple buildings?"
- "How would you track which specific rooms are used?"
- "Can you optimize space complexity?"
- "What if we had thousands of meetings per second?"

This problem showcases how Two Pointer thinking scales to complex, real-world scenarios when combined with supporting patterns.
