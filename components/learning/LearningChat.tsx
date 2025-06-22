'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import { ChatMessage } from './ChatMessage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Send, ArrowLeft, Brain } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ProblemEngine, ProblemProgress } from '@/lib/problem-engine'

interface Message {
  id: string
  type: 'ai' | 'user' | 'component'
  content: string
  timestamp: Date
  component?: {
    type: string
    data: any
  }
}

interface LearningChatProps {
  patternId: string
  className?: string
}

export function LearningChat({ patternId, className = '' }: LearningChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [currentStep, setCurrentStep] = useState('welcome')
  const [calibrationData, setCalibrationData] = useState<any>({})
  const [problemProgress, setProblemProgress] = useState<ProblemProgress>(ProblemEngine.createProgressState())
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    initializeWelcomeMessage()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initializeWelcomeMessage = () => {
    const welcomeMessage: Message = {
      id: 'welcome-1',
      type: 'component',
      content: '',
      timestamp: new Date(),
      component: {
        type: 'welcome',
        data: {
          type: 'welcome',
          content: 'Let me understand where you\'re starting so I can guide you perfectly.',
          options: [
            { id: 'start', text: 'Start Learning', action: 'begin_calibration' },
            { id: 'demo', text: 'See How It Works', action: 'show_demo' }
          ]
        }
      }
    }
    setMessages([welcomeMessage])
  }

  const handleOptionSelect = async (optionId: string, action?: string) => {
    // Add user response
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: `Selected: ${optionId}`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    setIsLoading(true)

    // Handle different actions
    if (action === 'begin_calibration') {
      await handleCalibrationStart()
    } else if (action === 'show_demo') {
      await handleShowDemo()
    } else if (action?.startsWith('calibration_')) {
      await handleCalibrationResponse(optionId, action)
    } else if (action === 'start_learning') {
      await handleStartLearning()
    } else if (action === 'show_code_editor') {
      await handleShowCodeEditor()
    } else if (action === 'show_visualization') {
      await handleShowVisualization()
    } else if (action === 'request_hint') {
      await handleRequestHint()
    } else if (action === 'execute_code') {
      await handleExecuteCode()
    } else if (action === 'submit_solution') {
      await handleSubmitSolution()
    } else if (action === 'continue_next_problem') {
      await handleContinueToNextProblem()
    }

    setIsLoading(false)
  }

  const handleCalibrationStart = async () => {
    const calibrationMessage: Message = {
      id: `cal-${Date.now()}`,
      type: 'component',
      content: '',
      timestamp: new Date(),
      component: {
        type: 'calibration',
        data: {
          type: 'calibration',
          content: 'Question 1: Have you seen Two Sum before?',
          options: [
            { id: 'a', text: 'Never heard of it', action: 'calibration_beginner' },
            { id: 'b', text: 'Seen it, haven\'t solved it', action: 'calibration_intermediate' },
            { id: 'c', text: 'Solved it before', action: 'calibration_advanced' }
          ]
        }
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, calibrationMessage])
    }, 1000)
  }

  const handleCalibrationResponse = async (optionId: string, action: string) => {
    setCalibrationData(prev => ({ ...prev, q1: action }))

    const nextQuestion: Message = {
      id: `cal2-${Date.now()}`,
      type: 'component',
      content: '',
      timestamp: new Date(),
      component: {
        type: 'calibration',
        data: {
          type: 'calibration',
          content: 'Question 2: Array [1,3,5,7,9], find pair that sums to 12',
          options: [
            { id: 'a', text: 'Check every possible pair', action: 'approach_brute' },
            { id: 'b', text: 'Use two pointers from ends', action: 'approach_optimal' },
            { id: 'c', text: 'Use hash map', action: 'approach_hash' },
            { id: 'd', text: 'Not sure', action: 'approach_unsure' }
          ]
        }
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, nextQuestion])
    }, 1000)
  }

  const handleShowDemo = async () => {
    const demoMessage: Message = {
      id: `demo-${Date.now()}`,
      type: 'ai',
      content: 'Here\'s how Two Pointer works! Watch the pointers move strategically to find the solution.',
      timestamp: new Date()
    }

    setTimeout(() => {
      setMessages(prev => [...prev, demoMessage])
      // After demo, offer to start learning
      setTimeout(() => {
        const followUp: Message = {
          id: `followup-${Date.now()}`,
          type: 'component',
          content: '',
          timestamp: new Date(),
          component: {
            type: 'result',
            data: {
              type: 'result',
              content: 'Cool, right? Ready to master this pattern yourself?',
              options: [
                { id: 'yes', text: 'Yes, let\'s learn!', action: 'begin_calibration' }
              ]
            }
          }
        }
        setMessages(prev => [...prev, followUp])
      }, 3000)
    }, 1000)
  }

  const handleStartLearning = async () => {
    const startMessage: Message = {
      id: `start-${Date.now()}`,
      type: 'ai',
      content: 'Perfect! Let\'s begin with your first problem. This teaches the foundation of strategic pointer movement.',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, startMessage])
    setCurrentStep('learning')

    // Start with first problem after a short delay
    setTimeout(() => {
      startFirstProblem()
    }, 2000)
  }

  const startFirstProblem = () => {
    const firstProblem = ProblemEngine.getProblemByIndex(0)
    if (!firstProblem) return

    const problemIntroMessage: Message = {
      id: `problem-intro-${Date.now()}`,
      type: 'component',
      content: '',
      timestamp: new Date(),
      component: {
        type: 'problem_intro',
        data: {
          type: 'problem_intro',
          content: `Let's start with ${firstProblem.title}. This problem teaches the core Two Pointer pattern.`,
          options: [
            { id: 'start_coding', text: 'Start Coding', action: 'show_code_editor' },
            { id: 'see_demo', text: 'See Demo First', action: 'show_visualization' }
          ],
          metadata: { problem: firstProblem }
        }
      }
    }

    setMessages(prev => [...prev, problemIntroMessage])
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // TODO: Send to AI API
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: `I understand you said: "${input}". Let me help you with that!`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleShowCodeEditor = async () => {
    const currentProblem = ProblemEngine.getProblemByIndex(problemProgress.currentProblem)
    if (!currentProblem) return

    const codeEditorMessage: Message = {
      id: `code-editor-${Date.now()}`,
      type: 'component',
      content: '',
      timestamp: new Date(),
      component: {
        type: 'code_editor',
        data: {
          type: 'code_editor',
          content: 'Here\'s your coding environment. Fill in the TODO sections!',
          metadata: { problem: currentProblem }
        }
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, codeEditorMessage])
    }, 1000)
  }

  const handleShowVisualization = async () => {
    const demoMessage: Message = {
      id: `demo-${Date.now()}`,
      type: 'ai',
      content: 'Here\'s how Two Pointer works on this problem! Watch the strategic movement.',
      timestamp: new Date()
    }

    setTimeout(() => {
      setMessages(prev => [...prev, demoMessage])
      // After demo, offer to start coding
      setTimeout(() => {
        const followUp: Message = {
          id: `followup-${Date.now()}`,
          type: 'component',
          content: '',
          timestamp: new Date(),
          component: {
            type: 'result',
            data: {
              type: 'result',
              content: 'Now you see the pattern! Ready to implement it yourself?',
              options: [
                { id: 'start_coding', text: 'Let\'s Code!', action: 'show_code_editor' }
              ]
            }
          }
        }
        setMessages(prev => [...prev, followUp])
      }, 3000)
    }, 1000)
  }

  const handleRequestHint = async () => {
    const currentProblem = ProblemEngine.getProblemByIndex(problemProgress.currentProblem)
    if (!currentProblem) return

    const currentHintLevel = (problemProgress.hintsUsed[currentProblem.id] || 0) + 1
    const hint = currentProblem.hints.find(h => h.level === currentHintLevel)

    if (hint) {
      // Update hints used
      setProblemProgress(prev => ({
        ...prev,
        hintsUsed: {
          ...prev.hintsUsed,
          [currentProblem.id]: currentHintLevel
        }
      }))

      const hintMessage: Message = {
        id: `hint-${Date.now()}`,
        type: 'component',
        content: '',
        timestamp: new Date(),
        component: {
          type: 'hint',
          data: {
            type: 'hint',
            content: '',
            options: [
              { id: 'thanks', text: 'Thanks!', action: 'continue_coding' },
              { id: 'more_help', text: 'Still stuck', action: 'request_hint' }
            ],
            metadata: { hint }
          }
        }
      }

      setTimeout(() => {
        setMessages(prev => [...prev, hintMessage])
      }, 1000)
    } else {
      const noMoreHintsMessage: Message = {
        id: `no-hints-${Date.now()}`,
        type: 'ai',
        content: 'You\'ve used all available hints for this problem. Try implementing what you\'ve learned!',
        timestamp: new Date()
      }

      setTimeout(() => {
        setMessages(prev => [...prev, noMoreHintsMessage])
      }, 1000)
    }
  }

  const handleExecuteCode = async () => {
    const executeMessage: Message = {
      id: `execute-${Date.now()}`,
      type: 'ai',
      content: 'Running your code against test cases... 🔄',
      timestamp: new Date()
    }

    setTimeout(() => {
      setMessages(prev => [...prev, executeMessage])

      // Simulate test results
      setTimeout(() => {
        const resultMessage: Message = {
          id: `result-${Date.now()}`,
          type: 'ai',
          content: '✅ Test 1 passed!\n❌ Test 2 failed: Expected [1,3] but got []\n\nLooks like your pointer movement logic needs work. Need a hint?',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, resultMessage])
      }, 2000)
    }, 500)
  }

  const handleSubmitSolution = async () => {
    const currentProblem = ProblemEngine.getProblemByIndex(problemProgress.currentProblem)
    if (!currentProblem) return

    const submitMessage: Message = {
      id: `submit-${Date.now()}`,
      type: 'ai',
      content: 'Evaluating your solution... 🔍',
      timestamp: new Date()
    }

    setTimeout(() => {
      setMessages(prev => [...prev, submitMessage])

      // Simulate successful completion
      setTimeout(() => {
        handleProblemCompletion()
      }, 2000)
    }, 500)
  }

  const handleProblemCompletion = () => {
    const currentProblem = ProblemEngine.getProblemByIndex(problemProgress.currentProblem)
    if (!currentProblem) return

    // Update progress
    setProblemProgress(prev => ({
      ...prev,
      completedProblems: [...prev.completedProblems, currentProblem.id],
      achievements: [...prev.achievements, 'First Problem Complete!']
    }))

    const celebrationMessage: Message = {
      id: `celebration-${Date.now()}`,
      type: 'component',
      content: '',
      timestamp: new Date(),
      component: {
        type: 'celebration',
        data: {
          type: 'celebration',
          content: `Excellent work! You've mastered ${currentProblem.title}. You now understand strategic pointer movement!`,
          options: [
            { id: 'continue', text: 'Next Problem', action: 'continue_next_problem' },
            { id: 'review', text: 'Review This Problem', action: 'review_problem' }
          ],
          metadata: {
            achievement: 'First Problem Complete!',
            nextProblem: ProblemEngine.getProblemByIndex(problemProgress.currentProblem + 1)?.title
          }
        }
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, celebrationMessage])
    }, 1000)
  }

  const handleContinueToNextProblem = async () => {
    // Move to next problem
    setProblemProgress(prev => ({
      ...prev,
      currentProblem: prev.currentProblem + 1
    }))

    const nextProblem = ProblemEngine.getProblemByIndex(problemProgress.currentProblem + 1)

    if (nextProblem) {
      const transitionMessage: Message = {
        id: `transition-${Date.now()}`,
        type: 'ai',
        content: `Great! Let's move to problem ${problemProgress.currentProblem + 2}: ${nextProblem.title}. This builds on what you just learned.`,
        timestamp: new Date()
      }

      setTimeout(() => {
        setMessages(prev => [...prev, transitionMessage])

        // Show next problem intro
        setTimeout(() => {
          const problemIntroMessage: Message = {
            id: `problem-intro-${Date.now()}`,
            type: 'component',
            content: '',
            timestamp: new Date(),
            component: {
              type: 'problem_intro',
              data: {
                type: 'problem_intro',
                content: `This problem shows how the SAME Two Pointer pattern applies to different contexts.`,
                options: [
                  { id: 'start_coding', text: 'Start Coding', action: 'show_code_editor' },
                  { id: 'see_demo', text: 'See Demo First', action: 'show_visualization' }
                ],
                metadata: { problem: nextProblem }
              }
            }
          }
          setMessages(prev => [...prev, problemIntroMessage])
        }, 2000)
      }, 1000)
    } else {
      // Level 1 complete!
      const completionMessage: Message = {
        id: `level-complete-${Date.now()}`,
        type: 'component',
        content: '',
        timestamp: new Date(),
        component: {
          type: 'celebration',
          data: {
            type: 'celebration',
            content: '🎉 Level 1 Complete! You\'re now Interview Ready with Two Pointer patterns!',
            options: [
              { id: 'level_2', text: 'Continue to Level 2', action: 'start_level_2' },
              { id: 'finish', text: 'I\'m satisfied!', action: 'finish_learning' }
            ],
            metadata: {
              achievement: 'Interview Ready!',
              nextProblem: null
            }
          }
        }
      }

      setTimeout(() => {
        setMessages(prev => [...prev, completionMessage])
      }, 1000)
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Simple Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <Link href={`/learn/${patternId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-slate-900">Two Pointer Mastery</span>
        </div>

        <div className="w-16"></div> {/* Spacer for balance */}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => {
          if (message.type === 'component' && message.component) {
            return (
              <div key={message.id} className="flex justify-start">
                <ChatMessage
                  message={message.component.data}
                  onOptionSelect={handleOptionSelect}
                />
              </div>
            )
          }

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.type === 'user'}
            />
          )
        })}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-xs">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white/95 backdrop-blur-xl border-t border-white/20">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type your response..."
            className="flex-1 resize-none border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={1}
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
