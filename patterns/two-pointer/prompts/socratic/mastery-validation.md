# Mastery Validation Prompts

Assess true pattern mastery through explanation, application, and teaching scenarios.

## Mastery Assessment Framework

### Pattern Recognition Test
```
Present novel Two Pointer problems without revealing the pattern:

"Here's a new problem: {{unseen_problem}}.
Before coding, describe your approach in 2-3 sentences."

Mastery indicators:
- Immediately identifies Two Pointer opportunity
- Explains pointer placement strategy
- Describes movement logic correctly
- Estimates O(n) time complexity
```

### Deep Understanding Check
```
"Why does the Two Pointer technique work? What makes it more efficient than checking all pairs?"

Mastery indicators:
- Explains sorted array property importance
- Understands elimination logic
- Can articulate optimization principle
- Connects to time complexity improvement
```

### Variation Handling
```
Present edge cases and variations:

"How would you modify your approach if:
- The array wasn't sorted?
- You needed three numbers instead of two?
- You wanted the closest sum instead of exact match?"

Mastery indicators:
- Recognizes when pattern applies/doesn't apply
- Can adapt pattern to variations
- Understands prerequisites for the technique
```

## Teaching Assessment

### Explanation Quality
```
"Teach the Two Pointer pattern to someone who's never seen it. Use the Two Sum problem as your example."

Evaluate:
- Starts with motivation (why not brute force?)
- Uses clear analogies or examples
- Explains decision logic step by step
- Covers edge cases and termination
- Summarizes key insights
```

### Common Mistakes Prevention
```
"What are the most common mistakes students make when learning Two Pointers?"

Look for awareness of:
- Moving wrong pointer
- Forgetting to move pointers
- Off-by-one errors
- Not handling duplicates
- Infinite loops
```

## Application Mastery

### Unseen Problem Set
```
Present 3 carefully chosen problems that test different aspects:

1. Standard opposite-direction (new context)
2. Same-direction variant
3. Multi-pointer extension

Each should be solvable in 10-15 minutes if pattern is truly mastered.
```

### Transfer Success Metrics
```
Mastery achieved when student:
- Recognizes pattern in <30 seconds
- Explains approach clearly in <2 minutes
- Implements working solution in <15 minutes
- Handles edge cases appropriately
- Can teach the concept to others
```

## Remediation Triggers

### Incomplete Mastery Indicators
```
If student shows:
- Slow pattern recognition (>60 seconds)
- Incorrect pointer movement decisions
- Cannot explain why technique works
- Struggles with variations

Remediation: Return to foundation problems with focused guidance
```
