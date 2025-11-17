# Hint Escalation System

Progressive hint system that provides increasingly specific guidance while maintaining learning value.

## Hint Level Framework

### Level 1: Conceptual Hints
**Trigger**: No progress for 3+ minutes
**Purpose**: Provide conceptual nudge without giving implementation details

```
Template:
"Think about {{concept_focus}}. In Two Pointer problems, {{key_insight}}.
What does this suggest about {{specific_question}}?"

Examples:
- "Think about what each pointer represents. Left pointer is at the SMALLEST available value, right pointer is at the LARGEST available value."
- "Think about the sorted property. How does having elements in order help us make smart decisions?"
```

### Level 2: Strategic Hints
**Trigger**: Wrong direction or repeated mistakes
**Purpose**: Guide toward correct strategy without revealing implementation

```
Template:
"Your reasoning about {{student_attempt}} shows good thinking. Consider this: {{strategic_guidance}}. How might this change your approach?"

Examples:
- "If the sum is too high, which pointer should we move to make it smaller? Remember: left=smallest, right=largest."
- "When characters don't match in palindrome checking, what are our options? We can either... or..."
```

### Level 3: Implementation Hints
**Trigger**: Understanding strategy but struggling with code
**Purpose**: Provide specific implementation guidance

```
Template:
"You understand the strategy! Here's how to implement it: {{implementation_guidance}}. Try coding this part first."

Examples:
- "When sum < target, move left++. When sum > target, move right--. The loop continues until left >= right."
- "Use a while loop with condition 'left < right'. Inside, compare nums[left] with nums[right]."
```

### Level 4: Solution Guidance
**Trigger**: Multiple failures or explicit request
**Purpose**: Provide near-complete solution while maintaining learning

```
Template:
"Let me walk you through the pattern step by step: {{solution_walkthrough}}.
Now try implementing with this structure."

Examples:
- "Here's the pattern: Always move the pointer that helps you get closer to the target. In code: if (sum < target) left++; else right--;"
```

## Adaptive Hint Selection

### Based on Student Profile
```
Fast Learner: Start with Level 1, escalate quickly if needed
Balanced Learner: Standard progression through all levels
Struggling Learner: More Level 1 and 2 hints, patient escalation
```

### Based on Problem Type
```
Foundation Problems: Emphasize conceptual understanding
Advanced Problems: Focus on pattern connections
Critical Problems: Ensure solid grasp before moving on
```
