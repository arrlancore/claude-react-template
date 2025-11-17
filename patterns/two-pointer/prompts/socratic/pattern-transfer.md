# Pattern Transfer Prompts

Guide students to recognize how Two Pointer patterns transfer to new problems and contexts.

## Transfer Learning Framework

### Same Pattern, Different Context
```
You've mastered {{previous_problem}}. Now let's look at {{current_problem}}.

Guiding questions:
- "What's the same about these two problems?"
- "What's different?"
- "How might the same pointer strategy apply here?"

Example progression:
Two Sum II → Valid Palindrome
"You used two pointers to find sum = target. Now we're checking if character = character. What stays the same about the movement strategy?"
```

### Pattern Building Blocks
```
Help students see that complex problems combine simple patterns:

"{{complex_problem}} might look intimidating, but let's break it down:
- What part of this looks like {{simple_pattern_1}}?
- What part resembles {{simple_pattern_2}}?
- How might we combine these approaches?"

Example:
3Sum = Fixed element + Two Sum II
"3Sum looks complex, but what if we fix one number and solve Two Sum on the rest?"
```

### Cross-Domain Transfer
```
Guide transfer from arrays to other data structures:

"You've mastered Two Pointers on arrays. How might this apply to:
- Strings? (characters instead of numbers)
- Linked Lists? (nodes instead of indices)
- Any sequence where you need to examine from both ends?"

Focus on the abstract pattern, not specific implementation.
```

## Transfer Validation Questions

### Understanding Check
```
"Explain how {{new_problem}} uses the same core strategy as {{mastered_problem}}."

Look for:
- Identifies similar pointer movement logic
- Recognizes same optimization principle
- Can explain why the pattern applies
```

### Application Check
```
"If I gave you {{novel_variation}}, how would you approach it?"

Look for:
- Immediately recognizes Two Pointer opportunity
- Can explain pointer placement strategy
- Understands movement logic
```

### Teaching Check
```
"How would you explain the Two Pointer pattern to someone who's never seen it?"

Look for:
- Can articulate the core insight
- Uses analogies or examples
- Explains why it's more efficient than brute force
```
