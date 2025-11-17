import React from 'react'
import { motion } from 'framer-motion'
import { ArrayElement } from './ArrayElement'
import { Pattern, PatternStep } from './hooks/usePatternGeneration'
import { GlassCard } from '../shared/ui/GlassCard'

interface VisualizationCanvasProps {
  pattern: Pattern
  currentData: PatternStep
  children?: React.ReactNode
}

export function VisualizationCanvas({
  pattern,
  currentData,
  children
}: VisualizationCanvasProps) {
  return (
    <GlassCard className="relative p-8 pb-16 mb-8">
      {children}

      {/* Pattern Info - simple fade in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          {pattern.name}
        </h2>
        <p className="text-purple-200">
          {pattern.description}
        </p>
        {pattern.target && (
          <p className="text-yellow-300 mt-2">
            Target: {pattern.target}
          </p>
        )}
      </motion.div>

      {/* Array Visualization - show current step's array state */}
      <div className="flex justify-center items-center mb-8">
        <div className="flex gap-3">
          {(currentData.arrayState || pattern.array).map((item, index) => (
            <ArrayElement
              key={index}
              value={item}
              index={index}
              isLeft={index === currentData.left}
              isRight={index === currentData.right}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  )
}
