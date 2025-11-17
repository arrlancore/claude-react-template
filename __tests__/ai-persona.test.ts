import { describe, test, expect } from '@jest/globals';
import { PersonaManager } from '@/lib/ai/persona-manager';
import { TeachingStepManager } from '@/lib/ai/teaching-steps';

describe('PersonaManager', () => {
  test('determines correct persona level from calibration responses', () => {
    const fastLearnerResponses = [
      { question_id: 'experience', answer: 'solved_20_plus' },
      { question_id: 'pattern_recognition', answer: 'definitely_two_pointer' },
      { question_id: 'timeline', answer: 'interview_this_week' }
    ];

    const level = PersonaManager.determinePersonaLevel(fastLearnerResponses);
    expect(level).toBe('fast_learner');
  });

  test('returns balanced_learner for moderate responses', () => {
    const balancedResponses = [
      { question_id: 'experience', answer: 'solved_some' },
      { question_id: 'pattern_recognition', answer: 'maybe_two_pointer' },
      { question_id: 'timeline', answer: 'interview_next_week' }
    ];

    const level = PersonaManager.determinePersonaLevel(balancedResponses);
    expect(level).toBe('balanced_learner');
  });

  test('generates appropriate prompts for each persona', () => {
    const step = TeachingStepManager.getStep(1);
    const prompt = PersonaManager.buildPersonaPrompt('struggling_learner', step!, {
      pattern_name: 'Two Pointer',
      user_message: 'I need help'
    });

    expect(prompt).toContain('gentle');
    expect(prompt).toContain('detailed');
    expect(prompt).toContain('Two Pointer');
  });

  test('returns valid calibration questions', () => {
    const questions = PersonaManager.getCalibrationQuestions();

    expect(questions).toHaveLength(3);
    expect(questions[0].id).toBe('experience');
    expect(questions[1].id).toBe('pattern_recognition');
    expect(questions[2].id).toBe('timeline');
  });
});

describe('TeachingStepManager', () => {
  test('returns correct teaching step', () => {
    const step = TeachingStepManager.getStep(1);

    expect(step?.name).toBe('concept_introduction');
    expect(step?.objective).toContain('intuition');
  });

  test('determines current step from conversation history', () => {
    const context = {
      conversation_history: new Array(10).fill({ role: 'user', content: 'test' })
    };

    const stepId = TeachingStepManager.determineCurrentStep(context);
    expect(stepId).toBe(4); // understanding_check
  });

  test('returns execution style for persona level', () => {
    const execution = TeachingStepManager.getStepExecution(1, 'fast_learner');
    expect(execution).toContain('Brief');
  });
});
