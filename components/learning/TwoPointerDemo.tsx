'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface DemoState {
  array: number[]
  target: number
  left: number
  right: number
  currentSum: number
  found: boolean
  step: number
  isPlaying: boolean
}

const initialState: DemoState = {
  array: [2, 7, 11, 15],
  target: 9,
  left: 0,
  right: 3,
  currentSum: 17,
  found: false,
  step: 0,
  isPlaying: false
}

export function TwoPointerDemo() {
  const [state, setState] = useState<DemoState>(initialState)

  const steps = [
    { left: 0, right: 3, sum: 17, message: "Start: left=2, right=15. Sum=17 > target=9" },
    { left: 0, right: 2, sum: 13, message: "Sum too high, move right left: left=2, right=11. Sum=13 > 9" },
    { left: 0, right: 1, sum: 9, message: "Move right left again: left=2, right=7. Sum=9 = target! ✓" }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (state.isPlaying && state.step < steps.length) {
      interval = setTimeout(() => {
        const currentStep = steps[state.step]
        setState(prev => ({
          ...prev,
          left: currentStep.left,
          right: currentStep.right,
          currentSum: currentStep.sum,
          found: currentStep.sum === state.target,
          step: prev.step + 1
        }))

        if (state.step === steps.length - 1) {
          setState(prev => ({ ...prev, isPlaying: false }))
        }
      }, 2000)
    }
    return () => clearTimeout(interval)
  }, [state.isPlaying, state.step, state.target])

  const handlePlay = () => {
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }

  const handleReset = () => {
    setState({ ...initialState })
  }

  const getCurrentMessage = () => {
    if (state.step === 0) return "Click play to see Two Pointer in action"
    return steps[state.step - 1]?.message || ""
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">Two Pointer Visualization</h3>
          <p className="text-sm text-gray-600">Array: [2, 7, 11, 15] | Target: 9</p>
        </div>

        {/* Array Visualization */}
        <div className="flex justify-center gap-3 mb-6">
          {state.array.map((num, index) => {
            const isLeft = index === state.left
            const isRight = index === state.right
            const isHighlighted = isLeft || isRight

            return (
              <div
                key={index}
                className={`
                  relative w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-500
                  ${isLeft ? 'bg-blue-500 text-white ring-4 ring-blue-300' :
                    isRight ? 'bg-red-500 text-white ring-4 ring-red-300' :
                    'bg-gray-100 text-gray-700'}
                  ${isHighlighted ? 'scale-110' : 'scale-100'}
                `}
              >
                {num}
                {isLeft && (
                  <div className="absolute -top-8 text-xs font-medium text-blue-600">
                    LEFT
                  </div>
                )}
                {isRight && (
                  <div className="absolute -top-8 text-xs font-medium text-red-600">
                    RIGHT
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Status */}
        <div className="text-center mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-lg font-medium mb-2">
              {state.array[state.left]} + {state.array[state.right]} = {state.currentSum}
              {state.found && <span className="text-green-600 ml-2">✓ Found!</span>}
            </div>
            <p className="text-sm text-gray-600">{getCurrentMessage()}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={handlePlay}
            variant={state.isPlaying ? "secondary" : "default"}
            size="sm"
          >
            {state.isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {state.isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
