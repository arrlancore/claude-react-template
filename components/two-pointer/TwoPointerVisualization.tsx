"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { useAnimationState } from './hooks/useAnimationState'
import { usePatternGeneration } from './hooks/usePatternGeneration'
import { useVisualizationSettings } from './hooks/useVisualizationSettings'
import { PatternSelector } from './PatternSelector'
import { VisualizationCanvas } from './VisualizationCanvas'
import { AnimatedLog } from './AnimatedLog'
import { StatusDisplay } from './StatusDisplay'
import { ControlPanel } from './ControlPanel'
import { SettingsModal } from './SettingsModal'
import { AlgorithmExplanation } from './AlgorithmExplanation'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { KeyboardIndicator } from './KeyboardIndicator'
import { FadeIn, StaggerContainer, StaggerItem } from '../shared/animations/FadeIn'

export default function TwoPointerVisualization() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { patterns, customData, updateCustomData } = usePatternGeneration()
  const {
    currentPattern,
    showSettings,
    handlePatternChange,
    openSettings,
    closeSettings,
    applySettings,
  } = useVisualizationSettings()

  const pattern = patterns[currentPattern]
  const currentData = pattern?.steps[0] || { left: 0, right: 0, found: false, log: '' }

  const {
    isPlaying,
    currentStep,
    currentLog,
    showLog,
    handlePlay,
    handleStepChange,
    showLogMessage,
    isFirstStep,
    isLastStep,
  } = useAnimationState({
    totalSteps: pattern?.steps.length || 0,
  })

  const actualCurrentData = pattern?.steps[currentStep] || currentData

  // Mouse tracking for dynamic lighting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Handle pattern change - reset animation state
  useEffect(() => {
    // Reset when pattern changes
    handleStepChange('prev') // This will reset to step 0
  }, [currentPattern])

  // Show log when step changes
  useEffect(() => {
    const stepData = pattern?.steps[currentStep]
    if (stepData?.log && currentStep > 0) {
      showLogMessage(stepData.log)
    }
  }, [currentStep, pattern?.steps, showLogMessage])

  const handlePatternChangeWithReset = (newPattern: string) => {
    handlePatternChange(newPattern)
  }

  const handlePlayWithLog = () => {
    const initialStep = pattern?.steps[0]
    handlePlay(initialStep)
  }

  const handleCustomDataChangeWrapper = (field: string, value: string) => {
    updateCustomData(currentPattern as keyof typeof customData, field, value)
  }

  // Keyboard shortcuts
  const keyboardShortcuts = [
    {
      key: 'Space',
      callback: handlePlayWithLog,
      description: 'Play/Resume animation'
    },
    {
      key: 'ArrowLeft',
      callback: () => !isFirstStep && handleStepChange('prev'),
      description: 'Previous step'
    },
    {
      key: 'ArrowRight',
      callback: () => !isLastStep && handleStepChange('next'),
      description: 'Next step'
    },
    {
      key: 'r',
      callback: () => handleStepChange('prev'), // Reset to start
      description: 'Reset animation'
    },
    {
      key: '1',
      callback: () => handlePatternChangeWithReset('pair-sum'),
      description: 'Switch to Pair Sum'
    },
    {
      key: '2',
      callback: () => handlePatternChangeWithReset('palindrome'),
      description: 'Switch to Palindrome'
    },
    {
      key: '3',
      callback: () => handlePatternChangeWithReset('reverse'),
      description: 'Switch to Reverse'
    },
    {
      key: 's',
      callback: openSettings,
      description: 'Open settings'
    }
  ]

  useKeyboardShortcuts({
    shortcuts: keyboardShortcuts,
    enabled: !showSettings // Disable when modal is open
  })

  if (!pattern) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 relative overflow-hidden"
      style={{
        background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.15), transparent 80%), linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(88, 28, 135) 50%, rgb(15, 23, 42) 100%)`
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: 1.2,
            opacity: 0.6
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: 1.2,
            opacity: 0.4
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header - simple fade in only */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            Two Pointer Pattern
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            An elegant algorithmic technique using two pointers to traverse data
            structures efficiently
          </p>
        </motion.div>

        {/* Pattern Selector */}
        <PatternSelector
          patterns={patterns}
          currentPattern={currentPattern}
          onPatternChange={handlePatternChangeWithReset}
        />

        {/* Main Visualization */}
        <VisualizationCanvas pattern={pattern} currentData={actualCurrentData}>
          {/* Settings Button */}
          <motion.button
            onClick={openSettings}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm group"
          >
            <Settings className="w-5 h-5 text-white transition-transform duration-300" />
          </motion.button>

          {/* Animated Log */}
          <AnimatedLog message={currentLog} isVisible={showLog} />
        </VisualizationCanvas>

        {/* Status Display */}
        <FadeIn delay={0.6}>
          <StatusDisplay
            pattern={pattern}
            currentData={actualCurrentData}
            patternType={currentPattern}
          />
        </FadeIn>

        {/* Controls */}
        <ControlPanel
          isPlaying={isPlaying}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          currentStep={currentStep}
          totalSteps={pattern.steps.length}
          onPlay={handlePlayWithLog}
          onStepChange={handleStepChange}
        />

        {/* Algorithm Explanation */}
        <FadeIn delay={1.0}>
          <AlgorithmExplanation />
        </FadeIn>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          currentPattern={currentPattern}
          customData={customData}
          onClose={closeSettings}
          onCustomDataChange={handleCustomDataChangeWrapper}
          onApply={applySettings}
        />

        {/* Keyboard Shortcuts Indicator */}
        <KeyboardIndicator shortcuts={keyboardShortcuts} />
      </div>
    </div>
  )
}
