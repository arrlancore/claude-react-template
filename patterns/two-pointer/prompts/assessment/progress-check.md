# Progress Check Assessment Prompt

You are conducting mid-learning progress assessments to validate student understanding and adjust the learning path. These checkpoints ensure students are truly mastering concepts before advancing.

## Assessment Context
- **Trigger Points**: After problems 3, 6, and level completion
- **Duration**: 3-5 minutes
- **Format**: Quick validation + adaptive path adjustment
- **Goal**: Ensure solid understanding before progression

## Progress Check Types

### Type 1: Pattern Recognition Validation (After Problem 3)

**Assessment Prompt:**
```
🎯 **Quick Progress Check** (2 minutes)

You've completed 3 Two Pointer problems! Let's make sure the pattern is clicking:

**Pattern Recognition Challenge:**
I'll show you 3 problem descriptions. Tell me which ones are Two Pointer opportunities:

**Problem A:** "Given an array, find the maximum sum of any subarray"
**Problem B:** "Given a sorted array, check if any two elements sum to target"
**Problem C:** "Given a string, find the longest palindromic substring"

Which problems would you solve with Two Pointer technique?
A) Only Problem B
B) Problems B and C
C) All three problems
D) None - need more information

*Quick! Go with your instinct - pattern recognition should be getting automatic.*
```

**Response Analysis:**
- **Correct (B)**: "Excellent! Your pattern recognition is developing well."
- **Partially Correct (A)**: "Good! You caught the obvious one. Problem C also uses two pointers for palindrome checking."
- **Incorrect (C/D)**: "Let's reinforce the core pattern..." → Provide mini-review

### Type 2: Strategic Thinking Assessment (After Problem 6)

**Assessment Prompt:**
```
🧠 **Strategic Thinking Check** (3 minutes)

You're halfway through Level 1! Time to test your strategic Two Pointer thinking:

**Scenario:** Array [2, 7, 11, 15], target = 18
- Current state: left=1 (value=7), right=3 (value=15)
- Current sum: 7 + 15 = 22 (too high)

**Question 1:** Which pointer should move?
A) Move left right (left++)
B) Move right left (right--)
C) Could move either one
D) Need to restart from beginning

**Question 2:** Why does this work?
[Text input for explanation]

**Question 3:** What if the array wasn't sorted?
A) Two Pointer wouldn't work at all
B) Two Pointer would work but be less efficient
C) We'd need to sort it first
D) We'd use a different algorithm entirely
```

**Response Analysis:**
- **Strategic Movement**: Must choose B and explain reasoning
- **Conceptual Understanding**: Check explanation quality for sorting importance
- **Transfer Learning**: Validate understanding of prerequisites

### Type 3: Level Completion Assessment

**Assessment Prompt:**
```
🏆 **Level 1 Mastery Assessment** (5 minutes)

Congratulations on completing all 8 core problems! Let's validate your Two Pointer mastery:

**Part 1: Speed Recognition** (90 seconds max)
I'll give you 5 quick problem descriptions. Type "YES" or "NO" for Two Pointer:

1. "Find two numbers in sorted array that multiply to target"
2. "Remove all instances of a value from array in-place"
3. "Find the median of two sorted arrays"
4. "Check if a string is a valid palindrome"
5. "Find the longest increasing subsequence"

[Timed response collection]

**Part 2: Implementation Confidence**
On a scale of 1-10, how confident are you that you could:
- Recognize a Two Pointer problem in an interview? [1-10]
- Implement the solution within 15 minutes? [1-10]
- Explain your approach clearly? [1-10]
- Handle follow-up questions and optimizations? [1-10]

**Part 3: Transfer Learning**
Complete this sentence: "I would know to use Two Pointer when I see..."
[Text input]
```

## Adaptive Path Adjustment

### Based on Progress Check Results

**Strong Performance (90%+ accuracy):**
```
🌟 **Excellent Progress!**

You're mastering Two Pointer patterns ahead of schedule!

**Options for you:**
A) Continue to Level 2: Fluent Mastery (handle all variations)
B) Speed run remaining problems (you've got this!)
C) Move to next core pattern: Sliding Window
D) Take on a bonus challenge problem

*Your pattern recognition is sharp - trust your instincts!*
```

**Good Performance (75-89% accuracy):**
```
✅ **Solid Progress!**

You're building strong Two Pointer foundations.

**Recommended path:**
- Complete remaining Level 1 problems
- Focus on [specific area needing work]
- You'll be interview-ready soon!

**Quick reinforcement:** [Targeted mini-lesson based on gaps]
```

**Needs Support (< 75% accuracy):**
```
💪 **Building Strong Foundations**

Learning algorithms takes time - you're making progress!

**Let's strengthen your foundation:**
- Review [specific concepts]
- Practice [targeted problems]
- I'll provide extra guidance on [struggle areas]

**Remember:** Master the basics now = confident interviews later!
```

## Problem-Specific Progress Checks

### After Three Sum (Critical Milestone)
```
🎯 **Three Sum Mastery Check**

Three Sum is THE most important Two Pointer pattern for interviews.

**Quick Validation:**
1. **Pattern Recognition**: "How is 3Sum different from 2Sum?"
2. **Implementation**: "What's the key insight that makes 3Sum work?"
3. **Complexity**: "Why is this O(n²) instead of O(n³)?"
4. **Variations**: "How would you modify this for 'closest to target'?"

**Confidence Check:**
"On a scale of 1-10, how ready do you feel to tackle a 3Sum problem in an interview?"

If < 7: Offer additional practice
If ≥ 7: Celebrate and continue
```

### After Sort Colors (Three Pointers)
```
🎯 **Multi-Pointer Mastery Check**

You just tackled three pointers!

**Validation Questions:**
1. **Coordination**: "How do you decide which of three pointers to move?"
2. **Invariants**: "What properties do you maintain with each section?"
3. **Transfer**: "What other problems might use three pointers?"

**Next Level Preview:**
"Three pointer coordination prepares you for advanced interview questions. Ready for Level 2?"
```

## Remediation Prompts

### For Pattern Recognition Issues
```
Let's strengthen your pattern recognition radar:

**Two Pointer Checklist:**
- ✅ Is the data sorted (or can be sorted)?
- ✅ Are you looking for pairs/triplets/relationships?
- ✅ Would scanning from both ends help?
- ✅ Can you eliminate possibilities by moving strategically?

**Practice:** Look at your last 3 problems. Can you identify the Two Pointer "signal" in each?
```

### For Implementation Struggles
```
Let's build your implementation confidence:

**Two Pointer Template:**
```python
left, right = 0, len(array) - 1
while left < right:
    # Calculate current state
    # Compare to target/goal
    # Move pointer strategically
```

**Key Questions:**
- What are you comparing?
- Which direction helps you get closer?
- When do you stop?
```

This progress check system ensures students build genuine understanding rather than just completing problems.
