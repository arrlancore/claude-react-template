'use client'

import React, { useState } from 'react'
import { CalibrationQuestion, CalibrationResult } from '@/lib/types/learning'
import { calibrationEngine } from '@/lib/learning/calibration-engine'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Brain, Clock } from 'lucide-react'

interface CalibrationQuizProps {
  questions: CalibrationQuestion[]
  onComplete: (result: CalibrationResult) => void
  onSkip?: () => void
}

export function CalibrationQuiz({ questions, onComplete, onSkip }: CalibrationQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [selectedOption, setSelectedOption] = useState<string>('')

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
  }

  const handleNext = () => {
    if (!selectedOption) return

    const newResponses = {
      ...responses,
      [questions[currentQuestion].id]: selectedOption
    }
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption('')
    } else {
      // Calculate result
      const result = calibrationEngine.calculatePersona(newResponses, questions)
      onComplete(result)
    }
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-purple-600">
          <Brain className="w-6 h-6" />
          <span className="font-semibold">Quick Calibration</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              ~2 minutes
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="border-2 border-purple-100">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            {currentQ.text}
          </CardTitle>
          <CardDescription>
            Select the option that best describes you
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {currentQ.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedOption === option.id
                  ? 'border-purple-500 bg-purple-50 text-purple-900'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedOption === option.id
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300'
                }`}>
                  {selectedOption === option.id && (
                    <CheckCircle className="w-4 h-4 text-white fill-current" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-medium">
                    {option.id}) {option.text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        {onSkip && currentQuestion === 0 && (
          <Button variant="ghost" onClick={onSkip} className="text-gray-500">
            Skip Assessment
          </Button>
        )}

        <div className="ml-auto space-x-3">
          {currentQuestion > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setCurrentQuestion(currentQuestion - 1)
                setSelectedOption(responses[questions[currentQuestion - 1].id] || '')
              }}
            >
              Previous
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}
