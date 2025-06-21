import React from 'react'
import { motion } from 'framer-motion'
import { GradientButton } from '../shared/ui/GradientButton'

interface ControlPanelProps {
  isPlaying: boolean
  isFirstStep: boolean
  isLastStep: boolean
  currentStep: number
  totalSteps: number
  onPlay: () => void
  onStepChange: (direction: 'prev' | 'next') => void
}

export function ControlPanel({
  isPlaying,
  isFirstStep,
  isLastStep,
  currentStep,
  totalSteps,
  onPlay,
  onStepChange,
}: ControlPanelProps) {
  const progress = totalSteps > 0 ? (currentStep + 1) / totalSteps : 0

  return (
    <div className="mb-8">
      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <GradientButton
          onClick={onPlay}
          disabled={isPlaying}
          variant="success"
          size="lg"
          isLoading={isPlaying}
          className="transform hover:scale-105"
        >
          {isPlaying ? "Playing..." : "Play Animation"}
        </GradientButton>

        <motion.button
          onClick={() => onStepChange('prev')}
          disabled={isFirstStep}
          whileHover={{ scale: isFirstStep ? 1 : 1.05 }}
          whileTap={{ scale: isFirstStep ? 1 : 0.95 }}
          className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm"
        >
          Previous
        </motion.button>

        <motion.button
          onClick={() => onStepChange('next')}
          disabled={isLastStep}
          whileHover={{ scale: isLastStep ? 1 : 1.05 }}
          whileTap={{ scale: isLastStep ? 1 : 0.95 }}
          className="bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm"
        >
          Next
        </motion.button>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="flex flex-col items-center space-y-3">
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Step Counter with enhanced styling */}
        <div className="text-center">
          <span className="text-purple-200 text-sm">
            Step <span className="text-white font-semibold">{currentStep + 1}</span> of{' '}
            <span className="text-white font-semibold">{totalSteps}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
