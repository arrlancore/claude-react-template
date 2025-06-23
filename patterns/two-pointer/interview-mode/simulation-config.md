# Interview Simulation Mode - Configuration

## Overview
Advanced assessment mode that simulates real technical interviews for Level 3 students. Provides realistic interview experience with AI interviewer persona and comprehensive evaluation.

## Interview Personas

### Google-Style Technical Interviewer
**Persona Characteristics:**
- Professional but friendly tone
- Focuses on problem-solving process
- Asks clarifying questions
- Provides hints when completely stuck
- Evaluates communication and optimization thinking

**Interview Flow:**
1. Problem introduction with context
2. Clarifying questions phase
3. Approach discussion and validation
4. Implementation with ongoing feedback
5. Optimization and follow-up questions

### Microsoft-Style Behavioral + Technical
**Persona Characteristics:**
- Collaborative approach
- Emphasizes code quality and maintainability
- Asks about edge cases and testing
- Focuses on system design implications

### Amazon-Style Leadership Principles
**Persona Characteristics:**
- Results-oriented questioning
- Emphasizes scalability and efficiency
- Customer-focused problem framing
- Ownership and long-term thinking

## Interview Problem Bank

### Level 3 Interview Problems
```json
{
  "interview_problems": [
    {
      "id": "meeting-scheduler-advanced",
      "title": "Advanced Meeting Scheduler",
      "difficulty": "medium-hard",
      "estimatedTime": "45 minutes",
      "patterns": ["two-pointer", "sorting", "greedy"],
      "description": "Design a meeting scheduler that optimizes room utilization",
      "followUpQuestions": [
        "How would you handle recurring meetings?",
        "What if rooms have different capacities?",
        "How would you scale this to millions of meetings?"
      ]
    },
    {
      "id": "interval-optimization",
      "title": "Optimal Interval Merging",
      "difficulty": "medium",
      "estimatedTime": "30 minutes",
      "patterns": ["two-pointer", "optimization"],
      "description": "Merge intervals with minimum operations",
      "followUpQuestions": [
        "What's the space-time tradeoff?",
        "How would you handle streaming intervals?",
        "Can you optimize for memory usage?"
      ]
    },
    {
      "id": "multi-pointer-coordination",
      "title": "Multi-Pointer Array Processing",
      "difficulty": "hard",
      "estimatedTime": "50 minutes",
      "patterns": ["two-pointer", "coordination"],
      "description": "Coordinate multiple pointers for complex array operations",
      "followUpQuestions": [
        "How do you prevent pointer collision?",
        "What if the array is very large?",
        "Can you generalize to N pointers?"
      ]
    }
  ]
}
```

## Interview Simulation Framework

### Phase 1: Problem Introduction (5 minutes)
```markdown
**Interviewer Prompt Template:**

"Hi! I'm [Name], a Senior Software Engineer at [Company]. Today we'll work through a coding problem together.

I want this to feel collaborative - ask questions, think out loud, and let me know if anything is unclear.

**Today's Problem:**
[Problem description with realistic context]

Take a moment to read through this. Any immediate questions about the problem statement?"

**Response Handling:**
- Encourage clarifying questions
- Provide reasonable constraints when asked
- Guide toward understanding the core problem
```

### Phase 2: Approach Discussion (10 minutes)
```markdown
**Interviewer Evaluation Criteria:**

**Problem Decomposition (0-10 points):**
- Breaks down problem into smaller parts
- Identifies key insights and constraints
- Recognizes patterns and similarities to known problems

**Approach Validation:**
- Discusses time/space complexity upfront
- Considers multiple approaches
- Explains why chosen approach is optimal

**Communication:**
- Thinks out loud clearly
- Asks good clarifying questions
- Explains reasoning for decisions
```

### Phase 3: Implementation (20 minutes)
```markdown
**Implementation Assessment:**

**Live Coding Simulation:**
- Student writes code in real-time
- Interviewer provides feedback and hints
- Handles compilation errors and bugs
- Encourages testing with examples

**Interviewer Intervention Points:**
- If stuck for 3+ minutes: "What are you thinking about?"
- If going wrong direction: "Let's step back - what's the core insight?"
- If implementation issue: "Walk me through this line of code"

**Code Quality Evaluation:**
- Clean, readable implementation
- Proper variable naming
- Logical code structure
- Handles edge cases
```

### Phase 4: Testing & Optimization (10 minutes)
```markdown
**Testing Phase:**
"Great! Now let's test this with a few examples."

**Test Case Progression:**
1. Given example from problem
2. Edge case (empty input, single element)
3. Large input scenario
4. Custom test case based on implementation

**Optimization Discussion:**
"How would you optimize this further?"
"What if we had [constraint change]?"
"Any alternative approaches worth considering?"
```

## AI Interviewer Behavior Scripts

### Encouraging Responses
```markdown
**When student is on right track:**
- "That's a good insight. Tell me more about..."
- "I like that approach. How would you implement..."
- "Exactly! And how does that help us with..."

**When student is struggling:**
- "No worries, let's think about this step by step..."
- "What if we simplified the problem to just..."
- "That's an interesting idea. Let's explore where it leads..."

**When student makes mistakes:**
- "Let's trace through this example together..."
- "I see what you're thinking. What happens when..."
- "Good attempt. Let me ask you this..."
```

### Question Banks by Situation

**Approach Validation Questions:**
- "What's the time complexity of this approach?"
- "How does this handle the edge case of...?"
- "What other approaches did you consider?"
- "Why is this better than [alternative approach]?"

**Implementation Guidance Questions:**
- "What should we initialize our pointers to?"
- "When do we know to stop the loop?"
- "What happens if the array is empty?"
- "How do we handle the case where...?"

**Optimization Discussion Questions:**
- "Can we do better than O(n²)?"
- "What if memory is more important than speed?"
- "How would this scale to very large inputs?"
- "Are there any assumptions we can make to optimize?"

## Assessment Rubric

### Technical Skills (30 points)
**Problem Understanding (0-5):**
- Correctly understands requirements
- Asks appropriate clarifying questions
- Identifies key constraints and edge cases

**Algorithm Design (0-10):**
- Chooses appropriate approach
- Demonstrates pattern recognition
- Explains time/space complexity correctly

**Implementation (0-10):**
- Writes clean, working code
- Handles edge cases appropriately
- Uses good coding practices

**Optimization (0-5):**
- Discusses alternative approaches
- Identifies optimization opportunities
- Understands trade-offs

### Communication Skills (20 points)
**Clarity (0-7):**
- Explains thought process clearly
- Uses appropriate technical terminology
- Organizes ideas logically

**Collaboration (0-7):**
- Responds well to hints and feedback
- Asks good questions
- Engages in productive discussion

**Problem-Solving Process (0-6):**
- Demonstrates systematic approach
- Recovers well from mistakes
- Shows adaptability

### Pass Thresholds
- **Level 1**: 35/50 points (70%)
- **Level 2**: 40/50 points (80%)
- **Level 3**: 42/50 points (85%)

## Post-Interview Feedback

### Detailed Feedback Template
```markdown
## Interview Performance Summary

**Overall Score:** [X/50] - [Pass/Needs Improvement]

### Strengths
- [Specific positive observations]
- [Technical skills demonstrated well]
- [Communication highlights]

### Areas for Improvement
- [Specific areas to work on]
- [Recommended practice problems]
- [Skills to develop further]

### Interview Readiness
**Current Level:** [Entry/Mid/Senior] level readiness
**Recommended Next Steps:** [Specific actionable advice]

### Pattern Mastery Assessment
**Two Pointer Recognition:** [Excellent/Good/Needs Work]
**Implementation Confidence:** [High/Medium/Low]
**Optimization Thinking:** [Advanced/Developing/Beginning]
```

This interview simulation provides realistic practice that builds both technical skills and interview confidence.
