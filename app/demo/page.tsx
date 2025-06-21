'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Settings, X, Play, Pause, SkipBack, SkipForward } from 'lucide-react'

// Premium Two Pointer Visualization with subtle enhancements
const PremiumTwoPointerDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [pattern, setPattern] = useState('pair-sum')
  const [showSettings, setShowSettings] = useState(false)
  const [currentLog, setCurrentLog] = useState('')
  const [showLog, setShowLog] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [performanceMetrics, setPerformanceMetrics] = useState({
    avgSpeed: 0,
    totalSteps: 0,
    accuracy: 100
  })

  const [customData, setCustomData] = useState({
    'pair-sum': { array: '2,7,11,15', target: '9' },
    'palindrome': { array: 'r,a
