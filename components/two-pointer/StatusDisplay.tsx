import React from 'react'
import { Pattern, PatternStep } from './hooks/usePatternGeneration'

interface StatusDisplayProps {
  pattern: Pattern
  currentData: PatternStep
  patternType: string
}

export function StatusDisplay({ pattern, currentData, patternType }: StatusDisplayProps) {
  return (
    <div className="text-center mb-6">
      <div className="inline-block bg-black/20 rounded-2xl px-6 py-4 backdrop-blur-sm">
        {patternType === 'pair-sum' && (
          <div className="text-white">
            <span className="text-blue-300">
              Left: {pattern.array[currentData.left]}
            </span>
            <span className="mx-4 text-gray-400">+</span>
            <span className="text-pink-300">
              Right: {pattern.array[currentData.right]}
            </span>
            <span className="mx-4 text-gray-400">=</span>
            <span
              className={`font-bold ${
                currentData.found ? "text-green-400" : "text-yellow-300"
              }`}
            >
              {currentData.sum}
            </span>
            {currentData.found && (
              <span className="ml-4 text-green-400">✓ Found!</span>
            )}
          </div>
        )}

        {patternType === 'palindrome' && (
          <div className="text-white">
            <span className="text-blue-300">
              '{pattern.array[currentData.left]}'
            </span>
            <span className="mx-4 text-gray-400">==</span>
            <span className="text-pink-300">
              '{pattern.array[currentData.right]}'
            </span>
            <span className="ml-4">
              {currentData.match ? (
                <span className="text-green-400">✓ Match</span>
              ) : (
                <span className="text-red-400">✗ No Match</span>
              )}
            </span>
          </div>
        )}

        {patternType === 'reverse' && (
          <div className="text-white">
            {currentData.swap ? (
              <>
                <span className="text-blue-300">
                  Swap {currentData.swap[0]}
                </span>
                <span className="mx-4 text-gray-400">↔</span>
                <span className="text-pink-300">
                  {currentData.swap[1]}
                </span>
              </>
            ) : (
              <span className="text-green-400">✓ Array Reversed!</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
