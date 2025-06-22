'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react'

interface TwoPointerStep {
  left: number
  right: number
  sum: number
  action: string
  explanation: string
  found?: boolean
}

interface PatternPreviewProps {
  onComplete?: () => void
}

export function PatternPreview({ onComplete }: PatternPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [userInteraction, setUserInteraction] = useState(false)

  const array = [2, 7, 11, 15]
  const target = 9

  const steps: TwoPointerStep[] = [
    {
      left: 0,
      right: 3,
      sum: 17,
      action: 'start',
      explanation: 'Start with pointers at both ends. Sum = 2 + 15 = 17'
    },
    {
      left: 0,
      right: 2,
      sum: 13,
      action: 'move_right',
      explanation: 'Sum too high (17 > 9), move right pointer left. Sum = 2 + 11 = 13'
    },
    {
      left: 0,
      right: 1,
      sum: 9,
      action: 'move_right',
      explanation: 'Still too high (13 > 9), move right pointer left. Sum = 2 + 7 = 9',
      found: true
    }
  ]

  const currentStepData = steps[currentStep]

  const handlePlay = () => {
    setIsPlaying(true)
    setUserInteraction(false)

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 2000)
  }

  const handleUserNext = () => {
    setUserInteraction(true)
    setIsPlaying(false)
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleUserPrev = () => {
    setUserInteraction(true)
    setIsPlaying(false)
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setUserInteraction(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <span>Two Pointer Pattern Preview</span>
        </CardTitle>
        <CardDescription>
          Watch how two pointers efficiently find a pair that sums to {target}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Array Visualization */}
        <div className="flex justify-center items-center gap-4">
          {array.map((value, index) => {
            const isLeft = index === currentStepData.left
            const isRight = index === currentStepData.right
            const isActive = isLeft || isRight

            return (
              <div key={index} className="relative">
                {/* Pointer Labels */}
                {isLeft && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                      LEFT
                    </div>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500 mx-auto"></div>
                  </div>
                )}

                {isRight && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      RIGHT
                    </div>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500 mx-auto"></div>
                  </div>
                )}

                {/* Array Element */}
                <div className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  isActive
                    ? isLeft
                      ? 'border-blue-500 bg-blue-100 text-blue-900'
                      : 'border-red-500 bg-red-100 text-red-900'
                    : 'border-gray-300 bg-gray-50 text-gray-700'
                }`}>
                  {value}
                </div>

                {/* Index Label */}
                <div className="text-center text-xs text-gray-500 mt-1">
                  {index}
                </div>
              </div>
            )
          })}
        </div>

        {/* Current State Display */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="text-blue-600">
              <div className="text-sm font-medium">Left Pointer</div>
              <div className="text-lg font-bold">
                array[{currentStepData.left}] = {array[currentStepData.left]}
              </div>
            </div>

            <div className="text-gray-800">
              <div className="text-sm font-medium">Current Sum</div>
              <div className="text-xl font-bold">
                {array[currentStepData.left]} + {array[currentStepData.right]} = {currentStepData.sum}
              </div>
              <div className={`text-sm font-medium ${
                currentStepData.found
                  ? 'text-green-600'
                  : currentStepData.sum > target
                    ? 'text-red-600'
                    : 'text-orange-600'
              }`}>
                {currentStepData.found
                  ? '✓ Found target!'
                  : currentStepData.sum > target
                    ? 'Too high'
                    : 'Too low'}
              </div>
            </div>

            <div className="text-red-600">
              <div className="text-sm font-medium">Right Pointer</div>
              <div className="text-lg font-bold">
                array[{currentStepData.right}] = {array[currentStepData.right]}
              </div>
            </div>
          </div>
        </div>

        {/* Step Explanation */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="font-medium text-purple-900 mb-2">
            Step {currentStep + 1}: {currentStepData.action.replace('_', ' ').toUpperCase()}
          </div>
          <div className="text-purple-800">
            {currentStepData.explanation}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUserPrev}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <Button
            variant={isPlaying ? "outline" : "default"}
            onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
            disabled={currentStep >= steps.length - 1 && !isPlaying}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="ml-2">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleUserNext}
            disabled={currentStep >= steps.length - 1}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index <= currentStep ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Completion Message */}
        {currentStep >= steps.length - 1 && (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-800 font-medium mb-2">
                🎉 Pattern Complete!
              </div>
              <div className="text-green-700 text-sm">
                You just saw how Two Pointer technique solves this in O(n) time instead of O(n²) brute force.
                This same pattern works for many similar problems!
              </div>
            </div>

            {onComplete && (
              <Button
                onClick={onComplete}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Ready to Learn This Pattern!
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
