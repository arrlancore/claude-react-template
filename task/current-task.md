# Interactive Message Elements Implementation Plan

## Overview
Build interactive chat elements for DSA pattern learning to replace hardcoded simulations in demo-chat.

## Core Components

### 1. Pattern Recognition Buttons
```typescript
interface PatternChoice {
  id: string
  label: string
  confidence: 'high' | 'medium' | 'low'
}

// Component: PatternChoiceButtons
// Location: components/chat/interactive/PatternChoiceButtons.tsx
// Purpose: "Which pattern applies?" selections
```

### 2. Strategic Decision Quizzes
```typescript
interface StrategyQuiz {
  scenario: ArrayScenario
  question: string
  options: ChoiceOption[]
}

// Component: StrategyQuiz
// Location: components/chat/interactive/StrategyQuiz.tsx
// Purpose: "Which pointer moves?" decisions
```

### 3. Reasoning Input Fields
```typescript
interface ReasoningPrompt {
  question: string
  placeholder: string
  hints: string[]
}

// Component: ReasoningPrompt
// Location: components/chat/interactive/ReasoningPrompt.tsx
// Purpose: "Explain why" text inputs
```

### 4. Code Insight Buttons
```typescript
interface CodeInsight {
  id: string
  text: string
  icon: string
}

// Component: CodeInsightButtons
// Location: components/chat/interactive/CodeInsightButtons.tsx
// Purpose: Post-submission actions
```

### 5. Progress Control Buttons
```typescript
interface ProgressControl {
  current: string
  options: ActionButton[]
}

// Component: ProgressButtons
// Location: components/chat/interactive/ProgressButtons.tsx
// Purpose: Pacing control
```

## Implementation Tasks

### Phase 1: Core Architecture
- [ ] Create `InteractiveMessage` interface
- [ ] Update `MessageBubble` to handle interactive elements
- [ ] Build `InteractiveElement` wrapper component
- [ ] Implement response handling system

### Phase 2: Basic Components
- [ ] Build `PatternChoiceButtons`
- [ ] Build `StrategyQuiz` with array visualization
- [ ] Build `ReasoningPrompt` with hint system
- [ ] Build `CodeInsightButtons`
- [ ] Build `ProgressButtons`

### Phase 3: Integration
- [ ] Update message types in chat system
- [ ] Add interactive response handling
- [ ] Create simulation triggers for testing
- [ ] Update demo-chat to use new components

### Phase 4: DSA Enhancements
- [ ] Add `ArrayVisualization` component
- [ ] Build `PatternConnectionMap`
- [ ] Implement context-aware rendering
- [ ] Add learning state management

## File Structure
```
components/
├── chat/
│   ├── interactive/
│   │   ├── PatternChoiceButtons.tsx
│   │   ├── StrategyQuiz.tsx
│   │   ├── ReasoningPrompt.tsx
│   │   ├── CodeInsightButtons.tsx
│   │   ├── ProgressButtons.tsx
│   │   ├── ArrayVisualization.tsx
│   │   └── InteractiveElement.tsx
│   └── MessageBubble.tsx (update)
```

## Testing Strategy
- Add keyword triggers to demo-chat:
  - "pattern quiz" → PatternChoiceButtons
  - "strategy" → StrategyQuiz
  - "explain" → ReasoningPrompt
  - "code review" → CodeInsightButtons

## Success Criteria
- All 5 interactive components functional
- Smooth integration with existing chat flow
- No breaking changes to current demo
- Ready for AI integration in next phase
