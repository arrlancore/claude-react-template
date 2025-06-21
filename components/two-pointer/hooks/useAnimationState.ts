import { useState, useEffect, useCallback } from 'react'

export interface AnimationState {
  isPlaying: boolean
  currentStep: number
  currentLog: string
  showLog: boolean
}

export interface UseAnimationStateProps {
  totalSteps: number
  animationInterval?: number
  logDisplayDuration?: number
}

export function useAnimationState({
  totalSteps,
  animationInterval = 1500,
  logDisplayDuration = 3000
}: UseAnimationStateProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentLog, setCurrentLog] = useState('')
  const [showLog, setShowLog] = useState(false)

  const showLogMessage = useCallback((message: string) => {
    setCurrentLog(message)
    setShowLog(true)

    setTimeout(() => {
      setShowLog(false)
    }, logDisplayDuration)
  }, [logDisplayDuration])

  const handlePlay = useCallback((stepData?: { log?: string }) => {
    setCurrentStep(0)
    setIsPlaying(true)

    if (stepData?.log) {
      showLogMessage(stepData.log)
    }
  }, [showLogMessage])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(0)
    setShowLog(false)
  }, [])

  const handleStepChange = useCallback((direction: 'next' | 'prev') => {
    const newStep = direction === 'next'
      ? Math.min(totalSteps - 1, currentStep + 1)
      : Math.max(0, currentStep - 1)

    setCurrentStep(newStep)
  }, [currentStep, totalSteps])

  const goToStep = useCallback((step: number) => {
    const clampedStep = Math.max(0, Math.min(totalSteps - 1, step))
    setCurrentStep(clampedStep)
  }, [totalSteps])

  // Auto-play animation
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1
          if (nextStep >= totalSteps) {
            setIsPlaying(false)
            return prev
          }
          return nextStep
        })
      }, animationInterval)
    }

    return () => clearInterval(interval)
  }, [isPlaying, totalSteps, animationInterval])

  // Show log on step change
  useEffect(() => {
    if (currentStep > 0) { // Don't show log for initial step during setup
      const event = new CustomEvent('stepChanged', { detail: { step: currentStep } })
      window.dispatchEvent(event)
    }
  }, [currentStep])

  return {
    // State
    isPlaying,
    currentStep,
    currentLog,
    showLog,

    // Actions
    handlePlay,
    handlePause,
    handleReset,
    handleStepChange,
    goToStep,
    showLogMessage,

    // Computed
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: totalSteps > 0 ? (currentStep + 1) / totalSteps : 0
  }
}
