import type { TeachingStep, PersonaLevel } from './types';

export const TEACHING_STEPS: TeachingStep[] = [
  {
    id: 1,
    name: "concept_introduction",
    objective: "Build intuition about why pattern works",
    execution: {
      fast_learner: "Brief analogy, focus on core insight",
      balanced_learner: "Clear analogy + why it works",
      struggling_learner: "Multiple analogies, real-world examples, slower pace"
    }
  },
  {
    id: 2,
    name: "visual_demonstration",
    objective: "Show pattern in action with step-by-step breakdown",
    execution: {
      fast_learner: "Fast-paced walkthrough, minimal explanation",
      balanced_learner: "Step-by-step breakdown with explanations",
      struggling_learner: "Detailed step-by-step, pause for understanding checks"
    }
  },
  {
    id: 3,
    name: "guided_practice",
    objective: "Apply pattern to mini-challenges with guidance",
    execution: {
      fast_learner: "Challenging mini-problems, fewer hints",
      balanced_learner: "Standard mini-challenges with guided hints",
      struggling_learner: "Simple mini-challenges, immediate feedback"
    }
  },
  {
    id: 4,
    name: "understanding_check",
    objective: "Validate comprehension through targeted questions",
    execution: {
      fast_learner: "2 focused questions, pattern recognition emphasis",
      balanced_learner: "3 questions covering concept, application, transfer",
      struggling_learner: "4-5 questions, repeat explanations if needed"
    }
  },
  {
    id: 5,
    name: "real_application",
    objective: "Solve actual LeetCode-style problems",
    execution: {
      fast_learner: "Medium/Hard problems with minimal scaffolding",
      balanced_learner: "Easy to Medium problems with guided support",
      struggling_learner: "Easy problems with extensive scaffolding"
    }
  },
  {
    id: 6,
    name: "mastery_assessment",
    objective: "Evaluate readiness and provide advancement feedback",
    execution: {
      fast_learner: "Speed bonuses, early advancement options",
      balanced_learner: "Comprehensive feedback, clear next steps",
      struggling_learner: "Focus on growth, additional practice opportunities"
    }
  }
];

export class TeachingStepManager {
  static getStep(stepId: number): TeachingStep | null {
    return TEACHING_STEPS.find(step => step.id === stepId) || null;
  }

  static getStepExecution(stepId: number, personaLevel: PersonaLevel): string {
    const step = this.getStep(stepId);
    return step?.execution[personaLevel] || "Standard teaching approach";
  }

  static getNextStepId(currentStepId: number): number | null {
    return currentStepId < TEACHING_STEPS.length ? currentStepId + 1 : null;
  }

  static determineCurrentStep(context: {
    pattern_id?: string;
    problem_id?: string;
    conversation_history?: any[]
  }): number {
    // Simple heuristic - improve with actual progress tracking later
    const historyLength = context.conversation_history?.length || 0;

    if (historyLength <= 2) return 1; // concept_introduction
    if (historyLength <= 5) return 2; // visual_demonstration
    if (historyLength <= 8) return 3; // guided_practice
    if (historyLength <= 12) return 4; // understanding_check
    if (historyLength <= 18) return 5; // real_application
    return 6; // mastery_assessment
  }
}
