# PatternLift - AI System

## Overview

The AI system powers the adaptive learning experience in PatternLift using Google's Gemini AI models. It provides personalized assessments, intelligent guidance, solution validation, and interactive chat capabilities.

## Architecture

### Core Components

```
lib/ai/
├── index.ts              # Main exports and system initialization
├── types.ts              # TypeScript interfaces and types
├── gemini.ts            # Gemini API client with streaming support
├── adaptive-engine.ts   # Core adaptive learning logic
├── prompt-templates.ts  # Structured prompt management
└── utils.ts             # Utility functions and helpers

app/api/ai/
├── assess/route.ts      # User assessment endpoint
├── guide/route.ts       # Learning guidance endpoint
├── validate/route.ts    # Solution validation endpoint
└── chat/route.ts        # Interactive chat endpoint
```

### AI Models Used

- **Gemini 1.5 Pro**: Complex operations (assessments, validation)
- **Gemini 1.5 Flash**: Real-time operations (guidance, chat)

## Features

### 1. Adaptive Assessment (`/api/ai/assess`)

Evaluates user skill level and learning preferences:

```typescript
const assessment = await fetch('/api/ai/assess', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user123',
    pattern_id: 'two-pointer',
    assessment_type: 'initial',
    user_input: 'I have 2 years coding experience...',
    context: {
      experience: 'intermediate',
      background: 'Computer Science graduate'
    }
  })
});
```

**Response:**
```typescript
{
  user_level: 'intermediate',
  learning_pace: 'balanced',
  recommended_path: ['level-1-problems', 'focus-on-optimization'],
  confidence_score: 85,
  next_action: 'start_learning'
}
```

### 2. Intelligent Guidance (`/api/ai/guide`)

Provides adaptive hints and explanations:

```typescript
const guidance = await fetch('/api/ai/guide', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user123',
    pattern_id: 'two-pointer',
    problem_id: 'two-sum-ii',
    user_input: 'I think I need to use a nested loop...',
    context: {
      current_level: 1,
      attempts: 2,
      hint_level: 2,
      user_profile: {
        learning_pace: 'balanced',
        preferred_style: 'visual'
      }
    }
  })
});
```

### 3. Solution Validation (`/api/ai/validate`)

Analyzes solution correctness and pattern understanding:

```typescript
const validation = await fetch('/api/ai/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user123',
    pattern_id: 'two-pointer',
    problem_id: 'two-sum-ii',
    user_solution: 'function twoSum(numbers, target) { ... }',
    solution_approach: 'Used two pointers from start and end...'
  })
});
```

### 4. Interactive Chat (`/api/ai/chat`)

Conversational support during learning:

```typescript
const chat = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user123',
    message: 'Why is the two pointer technique more efficient?',
    context: {
      pattern_id: 'two-pointer',
      problem_id: 'two-sum-ii',
      conversation_history: [...],
      user_profile: {...}
    }
  })
});
```

## Environment Setup

### Required Environment Variables

```bash
# Google AI API Key (required)
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# Model Configuration (optional - defaults provided)
GEMINI_PRO_MODEL=gemini-1.5-pro
GEMINI_FLASH_MODEL=gemini-1.5-flash

# Cost Management (optional - defaults provided)
DEFAULT_AI_MONTHLY_LIMIT=3.00
AI_COST_WARNING_THRESHOLD=0.80
```

### Getting Started

1. **Get Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Generate an API key
   - Add to your `.env.local` file

2. **Initialize AI System:**
   ```typescript
   import { initializeAISystem } from '@/lib/ai';

   const aiSystem = initializeAISystem();
   if (aiSystem.isReady) {
     console.log('AI system ready!');
   }
   ```

3. **Health Check:**
   ```typescript
   import { checkAISystemHealth } from '@/lib/ai';

   const health = await checkAISystemHealth();
   console.log(`AI Status: ${health.status}`);
   ```

## Prompt Templates

The system uses structured prompt templates for consistent AI interactions:

### Assessment Templates
- `initial_assessment`: First-time user evaluation
- `progress_assessment`: Ongoing progress evaluation

### Guidance Templates
- `socratic_guidance`: Discovery-based learning
- `adaptive_hint`: Escalating hint system

### Validation Templates
- `solution_validation`: Comprehensive solution analysis

### Chat Templates
- `conversational_ai`: Natural conversation support

## Cost Management

### Token Usage Optimization
- **Smart Model Selection**: Flash for speed, Pro for quality
- **Response Caching**: Reduces redundant API calls
- **Token Estimation**: Prevents unexpected costs
- **Rate Limiting**: Controls usage patterns

### Cost Tracking
```typescript
import { AIUtils } from '@/lib/ai';

// Calculate monthly costs
const monthlyCost = AIUtils.calculateMonthlyCost(usageRecords);

// Check if approaching limits
const nearLimit = AIUtils.isNearCostLimit(usageRecords, 3.0);

// Format cost display
const formattedCost = AIUtils.formatCost(0.0234); // "$0.0234"
```

## Performance Features

### Response Time Optimization
- Streaming responses for real-time feel
- Parallel processing where possible
- Intelligent caching strategies

### Quality Assurance
- Response validation
- Fallback mechanisms
- Error handling with retry logic

## Security & Privacy

### Data Protection
- No conversation data stored in logs
- User inputs sanitized before processing
- API keys secured in environment variables

### Rate Limiting
- Per-user request limits
- Abuse prevention mechanisms
- Graceful degradation under load

## Usage Examples

### Basic Assessment Flow
```typescript
import { createAdaptiveEngine } from '@/lib/ai';

const engine = createAdaptiveEngine();

// 1. Initial assessment
const assessment = await engine.assessUser({
  user_id: 'user123',
  pattern_id: 'two-pointer',
  assessment_type: 'initial',
  user_input: 'Intermediate developer, familiar with arrays'
});

// 2. Provide guidance based on assessment
const guidance = await engine.provideGuidance({
  user_id: 'user123',
  pattern_id: 'two-pointer',
  problem_id: 'two-sum-ii',
  user_input: 'Not sure how to start...',
  context: {
    current_level: 1,
    attempts: 1,
    hint_level: 1,
    user_profile: {
      learning_pace: assessment.learning_pace,
      preferred_style: 'visual',
      experience_level: assessment.user_level
    }
  }
});
```

### Custom Prompt Usage
```typescript
import { getPromptManager } from '@/lib/ai';

const promptManager = getPromptManager();

// Render a template
const rendered = promptManager.renderTemplate('socratic_guidance', {
  pattern_name: 'Two Pointer',
  problem_description: 'Find two numbers that sum to target',
  user_input: 'I want to use nested loops',
  hint_level: '2',
  learning_pace: 'balanced',
  learning_style: 'visual'
});

if (rendered) {
  console.log(rendered.prompt);
}
```

## Error Handling

The system includes comprehensive error handling:

```typescript
import { AIUtils } from '@/lib/ai';

try {
  const response = await engine.assessUser(request);
} catch (error) {
  const errorInfo = AIUtils.handleAIError(error);

  if (errorInfo.shouldRetry) {
    // Implement retry logic
  } else {
    // Show fallback response
    console.log(errorInfo.fallbackResponse);
  }
}
```

## Monitoring & Analytics

### Usage Tracking
All AI operations are tracked for:
- Token usage and costs
- Response times
- User interaction patterns
- System performance metrics

### Health Monitoring
- Continuous health checks
- Performance monitoring
- Cost threshold alerts
- Error rate tracking

## Development

### Adding New Templates
1. Add template to `PromptTemplateManager.initializeTemplates()`
2. Define required variables
3. Set model preference and parameters
4. Test with validation function

### Extending Functionality
1. Add new methods to `AdaptiveEngine`
2. Create corresponding API routes
3. Update type definitions
4. Add comprehensive error handling

## Future Enhancements

### Planned Features
- Response caching with Redis
- Advanced rate limiting
- Multi-language support
- Voice interaction capabilities
- Enhanced personalization

### Optimization Opportunities
- Model fine-tuning for DSA domain
- Advanced prompt engineering
- Predictive cost management
- Real-time adaptation algorithms

---

## Support

For AI system issues:
1. Check environment variables
2. Verify API key validity
3. Review error logs
4. Test with health check endpoint

For development questions, refer to the type definitions in `lib/ai/types.ts` and example usage in the API routes.
