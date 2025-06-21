"use client"
import React from 'react'

// Simple component without framer-motion to test basic functionality
export default function SimpleTwoPointerVisualization() {
  const patterns = {
    'pair-sum': {
      name: 'Pair Sum',
      array: [1, 3, 6, 8, 11, 15],
      target: 14,
      description: 'Find two numbers that sum to target',
      steps: [
        { left: 0, right: 5, sum: 16, log: 'Check if 1 + 15 = 14. Sum is 16. Too large, move right pointer left.' },
        { left: 0, right: 4, sum: 12, log: 'Check if 1 + 11 = 14. Sum is 12. Too small, move left pointer right.' },
        { left: 1, right: 4, sum: 14, log: 'Check if 3 + 11 = 14. Sum is 14. Found target!' }
      ]
    }
  }

  const currentPattern = patterns['pair-sum']
  const currentStep = 0
  const currentData = currentPattern.steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Two Pointer Pattern
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            An elegant algorithmic technique using two pointers to traverse data
            structures efficiently
          </p>
        </div>

        {/* Main Visualization */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10">
          {/* Pattern Info */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentPattern.name}
            </h2>
            <p className="text-purple-200">{currentPattern.description}</p>
            <p className="text-yellow-300 mt-2">
              Target: {currentPattern.target}
            </p>
          </div>

          {/* Array Visualization */}
          <div className="flex justify-center items-center mb-8">
            <div className="flex gap-3">
              {currentPattern.array.map((item, index) => {
                const isLeft = index === currentData.left
                const isRight = index === currentData.right

                return (
                  <div
                    key={index}
                    className={`relative w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-500 transform ${
                      isLeft || isRight
                        ? "scale-110 shadow-2xl z-10"
                        : "scale-100 hover:scale-105"
                    } ${
                      isLeft
                        ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white ring-4 ring-blue-300/50"
                        : isRight
                          ? "bg-gradient-to-br from-pink-400 to-pink-600 text-white ring-4 ring-pink-300/50"
                          : "bg-white/10 text-white border border-white/20"
                    }`}
                  >
                    {item}

                    {/* Pointer Labels */}
                    {isLeft && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          LEFT
                        </div>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500 mx-auto"></div>
                      </div>
                    )}

                    {isRight && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="bg-pink-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          RIGHT
                        </div>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-pink-500 mx-auto"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Status Display */}
          <div className="text-center mb-6">
            <div className="inline-block bg-black/20 rounded-2xl px-6 py-4 backdrop-blur-sm">
              <div className="text-white">
                <span className="text-blue-300">
                  Left: {currentPattern.array[currentData.left]}
                </span>
                <span className="mx-4 text-gray-400">+</span>
                <span className="text-pink-300">
                  Right: {currentPattern.array[currentData.right]}
                </span>
                <span className="mx-4 text-gray-400">=</span>
                <span className="font-bold text-yellow-300">
                  {currentData.sum}
                </span>
              </div>
            </div>
          </div>

          {/* Log Display */}
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl px-6 py-3 border border-white/20 max-w-3xl mx-auto">
              <p className="text-white text-sm font-medium text-center">
                {currentData.log}
              </p>
            </div>
          </div>
        </div>

        {/* Algorithm Explanation */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
            <div className="text-purple-200 leading-relaxed">
              The two-pointer technique uses two pointers that move toward each
              other or in the same direction. This approach reduces time
              complexity from O(n²) to O(n) for many problems by eliminating the
              need for nested loops.
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">
              Common Use Cases
            </h3>
            <div className="text-purple-200 leading-relaxed">
              • Finding pairs with specific sum
              <br />
              • Palindrome verification
              <br />
              • Array reversal in-place
              <br />
              • Removing duplicates
              <br />• Container with most water
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
