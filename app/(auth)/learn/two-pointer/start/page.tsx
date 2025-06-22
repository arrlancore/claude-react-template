'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalibrationQuestion, CalibrationResult } from '@/lib/types/learning'
import { CalibrationQuiz } from '@/components/learning/CalibrationQuiz'
import { PersonaResult } from '@/components/learning/PersonaResult'
import { PatternPreview } from '@/components/learning/PatternPreview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Brain, Target, Zap } from 'lucide-react'

type OnboardingStep = 'welcome' | 'preview' | 'calibration' | 'result' | 'loading'

export default function TwoPointerStartPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [calibrationQuestions, setCalibrationQuestions] = useState<CalibrationQuestion[]>([])
  const [calibrationResult, setCalibrationResult] = useState<CalibrationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadCalibrationQuestions()
  }, [])

  const loadCalibrationQuestions = async () => {
    try {
      const response = await fetch('/api/patterns/two-pointer/calibration')
      if (response.ok) {
        const data = await response.json()
        setCalibrationQuestions(data.questions)
      }
    } catch (error) {
      console.error('Failed to load calibration questions:', error)
    }
  }

  const handleStartCalibration = () => {
    if (calibrationQuestions.length > 0) {
      setCurrentStep('calibration')
    }
  }

  const handleCalibrationComplete = async (result: CalibrationResult) => {
    setCalibrationResult(result)
    setIsLoading(true)
    setCurrentStep('loading')

    try {
      // Save calibration result
      await fetch('/api/learning/calibration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'test-user', // TODO: Get from auth
          pattern_id: 'two-pointer',
          calibration_result: result
        })
      })

      // Create initial session with persona
      await fetch('/api/learning/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'test-user',
          pattern_id: 'two-pointer',
          persona_type: result.persona_type.id
        })
      })

      setCurrentStep('result')
    } catch (error) {
      console.error('Failed to save calibration:', error)
      setCurrentStep('result') // Continue anyway
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinueToLearning = () => {
    // Navigate to first problem with session context
    router.push('/learn/two-pointer/two-sum-ii')
  }

  const handleSkipCalibration = () => {
    // Use default balanced learner persona
    const defaultResult: CalibrationResult = {
      total_score: 15,
      persona_type: {
        id: 'balanced_learner',
        name: 'Encouraging Mentor',
        characteristics: ['standard_progression'],
        ai_approach: 'thorough explanations, moderate pace',
        guidance_config: {
          explanation_depth: 'standard',
          hint_frequency: 'moderate',
          celebration_style: 'achievement_focused',
          example_count: 'standard',
          pace_preference: 'steady'
        }
      },
      user_responses: {},
      guidance_config: {
        explanation_depth: 'standard',
        hint_frequency: 'moderate',
        celebration_style: 'achievement_focused',
        example_count: 'standard',
        pace_preference: 'steady'
      }
    }

    handleCalibrationComplete(defaultResult)
  }

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <h3 className="text-lg font-semibold mb-2">Setting Up Your Learning Experience</h3>
            <p className="text-gray-600">Personalizing your AI mentor...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {currentStep === 'welcome' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Master Two Pointer Pattern
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Skip the grinding. Learn the thinking.
                Start with 8 essential problems that make you interview-ready.
              </p>

              <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Most students become interview-ready in 6-8 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span>89% interview success rate</span>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors cursor-pointer"
                    onClick={() => setCurrentStep('preview')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    What is Two Pointer?
                  </CardTitle>
                  <CardDescription>
                    See an interactive demo of how the pattern works
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Watch Demo
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={handleStartCalibration}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    Start Learning
                  </CardTitle>
                  <CardDescription>
                    Quick 2-minute assessment to personalize your experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    Begin Journey
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-600">Core Problems</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">6-8h</div>
                <div className="text-sm text-gray-600">Time to Master</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'preview' && (
          <div className="space-y-6">
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep('welcome')}
                className="mb-4"
              >
                ← Back to Start
              </Button>
            </div>

            <PatternPreview
              onComplete={() => setCurrentStep('calibration')}
            />
          </div>
        )}

        {currentStep === 'calibration' && calibrationQuestions.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep('welcome')}
                className="mb-4"
              >
                ← Back to Start
              </Button>
            </div>

            <CalibrationQuiz
              questions={calibrationQuestions}
              onComplete={handleCalibrationComplete}
              onSkip={handleSkipCalibration}
            />
          </div>
        )}

        {currentStep === 'result' && calibrationResult && (
          <div className="space-y-6">
            <PersonaResult
              result={calibrationResult}
              onContinue={handleContinueToLearning}
            />
          </div>
        )}
      </div>
    </div>
  )
}
