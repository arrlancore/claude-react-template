import type { PersonaLevel, PersonaConfig, TeachingStep } from './types';

export class PersonaManager {
  private static readonly CORE_PERSONA_RULES = `
You are a patient DSA pattern mentor using the Socratic method.
NEVER give direct answers - guide discovery through questions.
Celebrate pattern recognition immediately when it occurs.
Connect new learning to previous insights.
End responses with engaging questions or clear next steps.
Use analogies appropriate for developers, not elementary examples.
`.trim();

  private static readonly personas: Record<PersonaLevel, PersonaConfig> = {
    fast_learner: {
      core_identity: "Efficient DSA pattern coach",
      explanation_depth: "concise",
      challenge_level: "advanced",
      hint_style: "minimal",
      celebration_style: "Achievement-focused, unlocks new challenges",
      pace_preference: "Streamlined explanations, faster progression"
    },
    balanced_learner: {
      core_identity: "Patient DSA pattern mentor",
      explanation_depth: "balanced",
      challenge_level: "standard",
      hint_style: "progressive",
      celebration_style: "Encouraging, builds momentum",
      pace_preference: "Standard pacing with thorough explanations"
    },
    struggling_learner: {
      core_identity: "Supportive DSA pattern tutor",
      explanation_depth: "detailed",
      challenge_level: "reinforcement",
      hint_style: "gentle",
      celebration_style: "Confidence-building, emphasizes progress over speed",
      pace_preference: "Patient pacing, ensures understanding before advancing"
    }
  };

  static getPersona(level: PersonaLevel): PersonaConfig {
    return this.personas[level];
  }

  static buildPersonaPrompt(
    level: PersonaLevel,
    step: TeachingStep,
    context: Record<string, string> = {}
  ): string {
    const persona = this.getPersona(level);

    return `${this.CORE_PERSONA_RULES}

CURRENT PERSONA: ${persona.core_identity}
- Explanation depth: ${persona.explanation_depth}
- Challenge level: ${persona.challenge_level}
- Hint style: ${persona.hint_style}
- Celebration approach: ${persona.celebration_style}

TEACHING STEP: ${step.name}
Objective: ${step.objective}
Execution for ${level}: ${step.execution[level]}

STUDENT CONTEXT:
${Object.entries(context).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

Generate response following core Socratic principles while adapting execution style for this persona level.`;
  }

  static determinePersonaLevel(responses: Array<{ question_id: string; answer: string }>): PersonaLevel {
    let score = 0;

    for (const response of responses) {
      switch (response.question_id) {
        case 'experience':
          if (response.answer.includes('solved_20_plus')) score += 2;
          else if (response.answer.includes('solved_some')) score += 1;
          break;

        case 'pattern_recognition':
          if (response.answer.includes('definitely_two_pointer')) score += 2;
          else if (response.answer.includes('maybe_two_pointer')) score += 1;
          break;

        case 'timeline':
          if (response.answer.includes('interview_this_week')) score += 1;
          else if (response.answer.includes('building_skills')) score -= 1;
          break;
      }
    }

    if (score >= 4) return 'fast_learner';
    if (score >= 2) return 'balanced_learner';
    return 'struggling_learner';
  }

  static getCalibrationQuestions() {
    return [
      {
        id: 'experience',
        question: 'Have you solved algorithm problems before?',
        options: [
          { id: 'never_solved', text: 'Complete beginner', value: 'never_solved' },
          { id: 'solved_some', text: 'Solved 1-20 problems', value: 'solved_some' },
          { id: 'solved_20_plus', text: 'Solved 20+ problems', value: 'solved_20_plus' }
        ]
      },
      {
        id: 'pattern_recognition',
        question: 'Array [1,3,5,7,9], find if 12 exists. Best approach?',
        options: [
          { id: 'check_each', text: 'Check each element one by one', value: 'check_each' },
          { id: 'maybe_two_pointer', text: 'Use two pointers from ends', value: 'maybe_two_pointer' },
          { id: 'definitely_two_pointer', text: 'Binary search (log n)', value: 'definitely_two_pointer' }
        ]
      },
      {
        id: 'timeline',
        question: 'Your learning timeline?',
        options: [
          { id: 'interview_this_week', text: 'Interview this week (need essentials)', value: 'interview_this_week' },
          { id: 'interview_next_week', text: 'Interview next week (solid understanding)', value: 'interview_next_week' },
          { id: 'building_skills', text: 'Building skills (no rush)', value: 'building_skills' }
        ]
      }
    ];
  }
}
