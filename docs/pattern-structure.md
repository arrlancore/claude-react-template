# Pattern Structure Documentation

## Overview

This document describes the complete structure and configuration schema for DSA learning patterns in the platform. Each pattern follows a standardized structure to ensure consistency and enable the AI learning engine to provide personalized, adaptive learning experiences.

## Directory Structure

### Current Implementation Structure

```
patterns/
├── README.md
└── two-pointer/                                    # Pattern root directory
    ├── config.json                                 # Main configuration file
    ├── achievements/                               # Achievement definitions
    │   └── definitions.json
    ├── assessments/                                # Assessment configurations
    │   ├── initial-calibration.json
    │   ├── pattern-recognition-tests.json
    │   └── mastery-validation.json
    ├── explanations/                               # Educational content
    │   ├── core-concepts.md
    │   ├── interview-tips.md
    │   ├── optimization-strategies.md
    │   └── pattern-variations.md
    ├── problems/                                   # Problem definitions
    │   ├── 01-two-sum-ii.md                      # Problem markdown
    │   ├── 01-two-sum-ii/                        # Problem-specific resources
    │   │   ├── execution.ts                       # Code execution logic
    │   │   ├── templates.json                     # Code templates
    │   │   └── test-cases.json                    # Test cases
    │   ├── 02-valid-palindrome.md
    │   ├── ... (more problems)
    │   └── 12-squares-sorted-array.md
    ├── prompts/                                   # AI prompt templates
    │   ├── adaptive/                              # Adaptive learning prompts
    │   │   ├── balanced-learner.md
    │   │   ├── fast-learner.md
    │   │   └── struggling-learner.md
    │   └── socratic/                              # Socratic method prompts
    │       ├── hint-escalation.md
    │       ├── mastery-validation.md
    │       ├── pattern-discovery.md
    │       └── pattern-transfer.md
    ├── curriculum.md                              # Curriculum documentation (to ignore)
    └── user-simulation.md                         # User simulation (to ignore)
```

### Planned Enhanced Structure

```
patterns/
├── README.md
└── two-pointer/
    ├── config.json                               # Enhanced main configuration
    ├── levels/                                   # Level-specific configurations
    │   ├── level-1-interview-ready.json
    │   ├── level-2-fluent-mastery.json
    │   └── level-3-expert-optimization.json
    ├── problems/                                 # Problem definitions with enhancements
    │   ├── 01-two-sum-ii.md
    │   ├── 01-two-sum-ii/
    │   │   ├── execution.ts
    │   │   ├── templates.json
    │   │   └── test-cases.json
    │   └── ... (all 12 problems)
    ├── prompts/                                  # AI prompt templates
    │   ├── socratic/
    │   ├── adaptive/
    │   └── assessment/
    │       ├── calibration.md
    │       ├── progress-check.md
    │       └── final-mastery.md
    ├── assessments/                              # Assessment configurations
    │   ├── initial-calibration.json
    │   ├── pattern-recognition-tests.json
    │   └── mastery-validation.json
    ├── explanations/                             # Educational content
    │   ├── core-concepts.md
    │   ├── pattern-variations.md
    │   ├── optimization-strategies.md
    │   └── interview-tips.md
    ├── achievements/                             # Achievement system
    │   └── definitions.json
    └── diagrams/                                 # Visual diagrams (planned)
        ├── pattern-decision-tree.mmd
        ├── optimization-flowchart.mmd
        └── complexity-analysis.mmd
```

## Configuration Schema

### Main Configuration (`config.json`)

The main configuration file follows this structure:

```typescript
interface PatternConfig {
  patternId: string                               // Unique pattern identifier
  metadata: PatternMetadata                       // Pattern metadata
  levels: Record<string, LevelDefinition>         // Level definitions
  curriculum: CurriculumStructure                 // Learning progression
  ai_framework: AIFramework                       // AI interaction settings
  content_paths: ContentPaths                     // File path references
}

interface PatternMetadata {
  id: string                                      // Pattern ID
  name: string                                    // Display name
  description: string                             // Pattern description
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: {
    level1: string                                // e.g., "4-8 hours"
    level2: string                                // e.g., "2-4 hours"
    level3: string                                // e.g., "3-5 hours"
    total: string                                 // e.g., "9-17 hours"
  }
  prerequisites: string[]                         // Required knowledge
  companies: string[]                             // Companies that use this
  interviewFrequency: "very_high" | "high" | "medium" | "low"
}

interface LevelDefinition {
  id: string                                      // Level identifier
  name: string                                    // Level display name
  description: string                             // Level description
  objective: string                               // Learning objective
  estimatedTime: string                           // Time estimate
  problems: ProblemReference[]                    // Problems in this level
  completionCriteria: CompletionCriteria          // Requirements to complete
  achievements: string[]                          // Available achievements
}

interface ProblemReference {
  id: string                                      // Problem identifier
  title: string                                   // Problem title
  difficulty: "easy" | "medium" | "hard"
  estimatedTime: string                           // Time estimate
  category: "foundation" | "extension" | "mastery"
  description: string                             // Brief description
  filePath?: string                               // Path to markdown file
  resourcesPath?: string                          // Path to resources directory
}
```

### Problem Structure

Each problem consists of:

#### Markdown File (`problems/XX-problem-name.md`)

```markdown
# Problem Title

## Problem Overview
**Difficulty**: Easy/Medium/Hard
**Time Estimate**: XX minutes
**Pattern Category**: Foundation/Extension/Mastery
**LeetCode**: #XXX

## Learning Objectives
- [ ] Objective 1
- [ ] Objective 2

## Pattern Discovery
### Core Insight Questions
...

## Implementation Template
```language
// Template code
```

## Test Cases
...

## Success Criteria
...
```

#### Resources Directory (`problems/XX-problem-name/`)

- **test-cases.json**: Comprehensive test cases with metadata
- **templates.json**: Code templates for different languages
- **execution.ts**: Problem-specific execution logic

### Test Cases Schema (`test-cases.json`)

```typescript
interface TestCasesConfig {
  metadata: {
    problemId: string
    inputFormat: string                           // e.g., "array,number"
    outputFormat: string                          // e.g., "array"
    functionName: string                          // e.g., "twoSum"
    comparisonStrategy: string                    // How to compare results
  }
  testCases: TestCase[]
}

interface TestCase {
  input: Record<string, any>                      // Input parameters
  expected: any[]                                 // Expected outputs (array for multiple valid)
  explanation: string                             // Test case explanation
}
```

### Assessments Structure

#### Initial Calibration (`assessments/initial-calibration.json`)

```typescript
interface Assessment {
  assessment_id: string
  title: string
  description: string
  duration_minutes: number
  questions: AssessmentQuestion[]
}

interface AssessmentQuestion {
  id: string
  type: "multiple_choice" | "code_completion" | "explanation"
  text: string
  options?: AssessmentOption[]
}

interface AssessmentOption {
  id: string
  text: string
  weight: number                                  // Scoring weight
  follow_up: string                               // Feedback message
}
```

### Achievements System (`achievements/definitions.json`)

```typescript
interface AchievementsConfig {
  achievements: Achievement[]
}

interface Achievement {
  id: string                                      // Unique identifier
  name: string                                    // Display name
  description: string                             // Achievement description
  category: "speed" | "recognition" | "mastery" | "persistence"
  icon: string                                    // Unicode emoji
  unlock_condition: string                        // Condition logic
  points: number                                  // Point value
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}
```

### Prompts Structure

#### Socratic Prompts (`prompts/socratic/`)

- **pattern-discovery.md**: Guides pattern recognition
- **hint-escalation.md**: Progressive hint system
- **pattern-transfer.md**: Helps connect patterns across problems
- **mastery-validation.md**: Validates deep understanding

#### Adaptive Prompts (`prompts/adaptive/`)

- **fast-learner.md**: For quick learners who need less explanation
- **balanced-learner.md**: Standard pacing and explanation
- **struggling-learner.md**: Extra support and encouragement

### Explanations Structure (`explanations/`)

- **core-concepts.md**: Fundamental pattern concepts
- **pattern-variations.md**: Different variations and applications
- **optimization-strategies.md**: Performance optimization techniques
- **interview-tips.md**: Interview-specific advice and strategies

## AI Framework Integration

### Persona System

The AI system uses different personas based on learner needs:

```typescript
interface PersonaConfig {
  tone: string                                    // Communication style
  explanation_style: string                      // How concepts are explained
  hint_approach: string                           // Hint delivery method
  celebration_style: string                      // How achievements are celebrated
  prompt_file: string                             // Reference to prompt template
}
```

### Adaptive Learning

The system adapts based on:
- Completion time vs expected time
- Accuracy rates
- Hint usage patterns
- Struggle indicators
- Pattern recognition speed

### Hint System

Progressive hint system with 4 levels:
1. **Conceptual**: High-level guidance
2. **Strategic**: Decision-making hints
3. **Implementation**: Code-specific help
4. **Solution**: Direct guidance when needed

## Content Guidelines

### Problem Selection Criteria

Each problem must:
- Serve a specific learning purpose
- Build incrementally on previous knowledge
- Demonstrate pattern variations
- Include comprehensive test cases
- Have clear success criteria

### Quality Standards

- **Markdown**: Consistent formatting and structure
- **Code**: Clean, commented templates
- **Tests**: Edge cases and typical scenarios covered
- **Explanations**: Clear, beginner-friendly language
- **Prompts**: Socratic method principles

### Accessibility

- Clear learning objectives
- Multiple explanation styles
- Progressive difficulty
- Comprehensive feedback
- Achievement motivation

## File Naming Conventions

- Problems: `XX-kebab-case-name.md` (where XX is sequential number)
- Resources: `XX-kebab-case-name/` directory
- Configs: `kebab-case-name.json`
- Prompts: `kebab-case-name.md`
- Explanations: `kebab-case-name.md`

## Validation Requirements

Each pattern must include:
- [ ] Complete config.json with all required fields
- [ ] 8+ problems for Level 1 (Interview Ready)
- [ ] 4+ problems for Level 2 (Fluent Mastery)
- [ ] Advanced problems for Level 3 (Expert)
- [ ] Comprehensive test cases for each problem
- [ ] Socratic and adaptive prompts
- [ ] Achievement definitions
- [ ] Educational explanations
- [ ] Assessment configurations

## Extension Points

The structure supports future enhancements:
- Interactive visualizations (components)
- Video explanations
- Peer learning features
- Company-specific tracks
- Advanced analytics
- Multi-language support

## Gap Analysis: Current vs Curriculum Requirements

### ✅ Currently Implemented
- Basic pattern configuration in `config.json`
- Problem definitions with markdown files
- **14 total problems**: 8 (Level 1) + 4 (Level 2) + 2 (Level 3)
- Comprehensive test cases with execution logic
- Assessment system (initial calibration, mastery validation)
- Achievement system with gamification
- AI prompts (socratic and adaptive)
- Educational explanations

### 🎯 **Problem Distribution Strategy**
- **Level 1**: 8 problems (pure Two Pointer fundamentals)
- **Level 2**: 4 problems (advanced Two Pointer variations)
- **Level 3**: 2 problems (Two Pointer + supporting patterns)
- **Visualizations**: 4 key problems get interactive animations
  - Two Sum II (basic pointer movement)
  - Valid Palindrome (pattern transfer)
  - Container With Water (optimization strategy)
  - Three Sum (multi-pointer coordination)

### ❌ Missing Components (From Curriculum Requirements)

#### 1. Separate Level Configuration Files
**Expected**: Individual level files for granular control
```
levels/
├── level-1-interview-ready.json      # MISSING
├── level-2-fluent-mastery.json       # MISSING
└── level-3-expert-optimization.json  # MISSING
```

#### 2. Interactive Visualizations
**Expected**: React components for visual learning
```
components/                           # MISSING DIRECTORY
├── TwoSumVisualization.tsx
├── PalindromeChecker.tsx
├── ContainerAnimation.tsx
└── SharedAnimations/
    ├── PointerMovement.tsx
    ├── ArrayHighlight.tsx
    └── ComparisonVisualization.tsx
```

#### 3. Session Management Schema
**Expected**: Database schemas for learning sessions
```sql
-- MISSING DATABASE SCHEMAS
learning_sessions (id, user_id, pattern_id, level, current_score, best_score)
problem_attempts (id, session_id, problem_id, best_time, accuracy)
```

#### 4. Multi-Pattern Support (Level 3) ✅ **PLANNED**
**Strategy**: Problems combining Two Pointer with supporting patterns
```typescript
interface MultiPatternProblem {
  id: string
  title: string
  primaryPattern: "two-pointer"           // Always Two Pointer as main
  supportingPatterns: string[]            // ["hash-map", "sorting"]
  adaptiveHints: Record<string, string>   // Hints for unknown patterns
  category: "multi-pattern"
}

// Level 3 Problems (Following Curriculum):
// 1. Meeting Rooms II (Two Pointer + Sorting + Greedy)
// 2. Merge Intervals Optimized (Two Pointer + Sorting)

// Adaptive Hints Strategy:
const adaptiveHints = {
  "sorting": "Just arranges data for your Two Pointer technique / Prepares intervals for Two Pointer merging",
  "greedy": "Helps decide pointer movement - same logic you know"
}
```

#### 5. Interview Simulation Mode
**Expected**: AI interviewer with time-limited challenges
```typescript
// MISSING COMPONENT
interface InterviewSimulation {
  interviewer_persona: string
  time_limit: number
  communication_assessment: boolean
}
```

#### 6. Progress Tracking Metrics
**Expected**: Real-time learning analytics
```typescript
// MISSING TRACKING
interface ProgressMetrics {
  understanding_level: number    // 0-100
  pattern_recognition_speed: number
  hint_usage_frequency: number
  adaptive_triggers: string[]
}
```

#### 7. Visual Diagrams
**Expected**: Mermaid diagrams for pattern visualization
```
diagrams/                            # MISSING DIRECTORY
├── pattern-decision-tree.mmd
├── optimization-flowchart.mmd
└── complexity-analysis.mmd
```

#### 8. Enhanced Prompt Categories
**Expected**: Additional prompt categories
```
prompts/assessment/                   # MISSING DIRECTORY
├── calibration.md
├── progress-check.md
└── final-mastery.md
```

### 🛠 Implementation Roadmap

#### Phase 1: Core Structure Enhancement
1. Create separate level configuration files
2. Add missing prompt categories
3. Create visual diagrams directory structure

#### Phase 2: Interactive Components
1. Build React visualization components
2. Implement step-by-step animations
3. Add user interaction modes

#### Phase 3: Advanced Features
1. Implement session management database schemas
2. Build multi-pattern problem support
3. Create interview simulation mode

#### Phase 4: Analytics & Optimization
1. Implement real-time progress tracking
2. Add adaptive response triggers
3. Build comprehensive analytics dashboard

## Implementation Notes

- Config validation occurs at pattern load time
- Caching strategies for frequently accessed content
- Hot reloading support for development
- Version tracking for content updates
- A/B testing capabilities for different approaches
- Gradual migration from monolithic config to modular level files
