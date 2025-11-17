import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { patternId: string } }
) {
  try {
    const { patternId } = params

    // Load calibration questions for the pattern
    const calibrationPath = path.join(
      process.cwd(),
      'patterns',
      patternId,
      'assessments',
      'initial-calibration.json'
    )

    const calibrationContent = await fs.readFile(calibrationPath, 'utf-8')
    const calibrationData = JSON.parse(calibrationContent)

    return NextResponse.json({
      pattern_id: patternId,
      assessment_id: calibrationData.assessment_id,
      title: calibrationData.title,
      description: calibrationData.description,
      duration_minutes: calibrationData.duration_minutes,
      questions: calibrationData.questions,
      persona_mapping: calibrationData.persona_mapping,
      guidance_customization: calibrationData.guidance_customization
    })

  } catch (error) {
    console.error('Error loading calibration:', error)

    // Return fallback calibration questions
    return NextResponse.json({
      pattern_id: params.patternId,
      assessment_id: 'fallback-calibration',
      title: 'Quick Assessment',
      description: 'Help us personalize your learning experience',
      duration_minutes: 3,
      questions: [
        {
          id: 'experience_check',
          type: 'multiple_choice',
          text: 'Have you worked with algorithms before?',
          options: [
            { id: 'A', text: 'Complete beginner', weight: 1, follow_up: "Perfect! We'll start from the basics." },
            { id: 'B', text: 'Some experience', weight: 5, follow_up: "Great! We'll build on what you know." },
            { id: 'C', text: 'Quite experienced', weight: 10, follow_up: "Excellent! We'll focus on advanced concepts." }
          ]
        },
        {
          id: 'timeline',
          type: 'multiple_choice',
          text: 'What\'s your timeline?',
          options: [
            { id: 'A', text: 'Learning for fun', weight: 3, follow_up: "We'll take our time and explore deeply." },
            { id: 'B', text: 'Preparing for interviews', weight: 7, follow_up: "We'll focus on interview-relevant skills." },
            { id: 'C', text: 'Interview next week', weight: 10, follow_up: "Let's get you ready quickly!" }
          ]
        }
      ]
    })
  }
}
