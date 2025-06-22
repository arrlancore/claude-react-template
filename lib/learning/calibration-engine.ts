import { PersonaType, CalibrationQuestion, CalibrationResult, GuidanceConfig } from '@/lib/types/learning'

const PERSONAS: Record<string, PersonaType> = {
  struggling_learner: {
    id: 'struggling_learner',
    name: 'Supportive Tutor',
    characteristics: ['needs_detailed_explanations', 'benefits_from_encouragement', 'requires_multiple_examples'],
    ai_approach: 'patient, step-by-step, lots of encouragement',
    guidance_config: {
      explanation_depth: 'maximum',
      hint_frequency: 'high',
      celebration_style: 'confidence_building',
      example_count: 'multiple',
      pace_preference: 'patient'
    }
  },
  balanced_learner: {
    id: 'balanced_learner',
    name: 'Encouraging Mentor',
    characteristics: ['standard_progression', 'moderate_pace', 'thorough_understanding'],
    ai_approach: 'thorough explanations, moderate pace, achievement focused',
    guidance_config: {
      explanation_depth: 'standard',
      hint_frequency: 'moderate',
      celebration_style: 'achievement_focused',
      example_count: 'standard',
      pace_preference: 'steady'
    }
  },
  fast_learner: {
    id: 'fast_learner',
    name: 'Challenge Coach',
    characteristics: ['quick_pattern_recognition', 'prefers_challenges', 'minimal_guidance_needed'],
    ai_approach: 'concise explanations, rapid advancement, challenge oriented',
    guidance_config: {
      explanation_depth: 'minimal',
      hint_frequency: 'low',
      celebration_style: 'challenge_oriented',
      example_count: 'minimal',
      pace_preference: 'rapid'
    }
  }
}

export class CalibrationEngine {

  async loadCalibrationQuestions(patternId: string): Promise<CalibrationQuestion[]> {
    try {
      const response = await fetch(`/api/patterns/${patternId}/calibration`)
      if (!response.ok) throw new Error('Failed to load calibration')

      const data = await response.json()
      return data.questions
    } catch (error) {
      console.error('Error loading calibration:', error)
      return []
    }
  }

  calculatePersona(responses: Record<string, string>, questions: CalibrationQuestion[]): CalibrationResult {
    let totalScore = 0

    // Calculate weighted score based on responses
    questions.forEach(question => {
      const userResponse = responses[question.id]
      const selectedOption = question.options.find(opt => opt.id === userResponse)
      if (selectedOption) {
        totalScore += selectedOption.weight
      }
    })

    // Determine persona based on score ranges
    let personaType: PersonaType
    if (totalScore <= 8) {
      personaType = PERSONAS.struggling_learner
    } else if (totalScore <= 20) {
      personaType = PERSONAS.balanced_learner
    } else {
      personaType = PERSONAS.fast_learner
    }

    return {
      total_score: totalScore,
      persona_type: personaType,
      user_responses: responses,
      guidance_config: personaType.guidance_config
    }
  }

  async saveCalibrationResult(userId: string, patternId: string, result: CalibrationResult): Promise<void> {
    try {
      await fetch('/api/learning/calibration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          pattern_id: patternId,
          calibration_result: result
        })
      })
    } catch (error) {
      console.error('Error saving calibration:', error)
    }
  }

  getPersonaDescription(personaType: PersonaType): string {
    const descriptions = {
      struggling_learner: "I'll provide detailed explanations with plenty of examples and encouragement. We'll take our time to build solid understanding.",
      balanced_learner: "I'll give thorough explanations at a steady pace, celebrating your progress as we build mastery together.",
      fast_learner: "I'll keep explanations concise and move quickly. Ready for some challenges?"
    }

    return descriptions[personaType.id as keyof typeof descriptions] || descriptions.balanced_learner
  }

  getPersonaGuidance(personaType: PersonaType): string[] {
    const guidance = {
      struggling_learner: [
        "Focus on understanding concepts deeply",
        "Move at your own pace - no rushing",
        "Get detailed explanations with examples",
        "Receive encouragement and confidence building"
      ],
      balanced_learner: [
        "Thorough explanations with good examples",
        "Steady progression through concepts",
        "Achievement-focused learning",
        "Balanced pace with solid understanding"
      ],
      fast_learner: [
        "Concise, efficient explanations",
        "Quick pattern recognition focus",
        "Challenge-oriented problems",
        "Rapid advancement through material"
      ]
    }

    return guidance[personaType.id as keyof typeof guidance] || guidance.balanced_learner
  }
}

export const calibrationEngine = new CalibrationEngine()
