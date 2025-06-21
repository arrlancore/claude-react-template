import { useState, useCallback } from 'react'

export function useVisualizationSettings() {
  const [currentPattern, setCurrentPattern] = useState('pair-sum')
  const [showSettings, setShowSettings] = useState(false)

  const handlePatternChange = useCallback((newPattern: string) => {
    setCurrentPattern(newPattern)
  }, [])

  const openSettings = useCallback(() => {
    setShowSettings(true)
  }, [])

  const closeSettings = useCallback(() => {
    setShowSettings(false)
  }, [])

  const applySettings = useCallback(() => {
    setShowSettings(false)
    // Additional logic for applying settings can be added here
  }, [])

  return {
    // State
    currentPattern,
    showSettings,

    // Actions
    handlePatternChange,
    openSettings,
    closeSettings,
    applySettings,
  }
}
