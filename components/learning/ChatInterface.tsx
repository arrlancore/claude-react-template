'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import { useAIChat } from '@/hooks/useAIChat'
import { useProgress } from '@/hooks/useProgress'
import { LoadingSpinner, ErrorState } from '@/components/ui/LoadingStates'
import { Brain, Lightbulb, Code, Play, Heart, Smile, Mic, Send } from 'lucide-react'

interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface ChatInterfaceProps {
  patternId: string
  problemId?: string
  sessionId?: string
  className?: string
}

export function ChatInterface({
  patternId,
  problemId,
  sessionId,
  className = ''
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [hintsUsed, setHintsUsed] = useState(0)
  const [sessionTime, setSessionTime] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const startTime = useRef(Date.now())

  const { sendMessage, isLoading } = useAIChat({
    patternId,
    problemId,
    sessionId
  })

  const { session, createSession, updateProgress, error: progressError } = useProgress(patternId)

  // Show loading while initializing
  if (!session && !progressError) {
    return (
      <div className={`flex items-center justify-center h-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 ${className}`}>
        <LoadingSpinner text="Initializing learning session..." />
      </div>
    )
  }

  // Show error state
  if (progressError) {
    return (
      <div className={`flex items-center justify-center h-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 ${className}`}>
        <ErrorState
          error={progressError}
          onRetry={() => createSession(patternId, problemId)}
        />
      </div>
    )
  }

  // Initialize session
  useEffect(() => {
    if (patternId && !session) {
      createSession(patternId, problemId)
    }
  }, [patternId, problemId, session])

  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 60000)
      setSessionTime(elapsed)

      if (session && elapsed > 0 && elapsed % 5 === 0) {
        updateProgress({ time_spent_minutes: elapsed })
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [session, updateProgress])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px'
    }
  }, [input])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const response = await sendMessage(input.trim())

      // Remove typing indicator and add AI response
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing')
        return [...filtered, {
          id: Date.now().toString(),
          type: 'ai',
          content: response,
          timestamp: new Date()
        }]
      })
    } catch (error) {
      console.error('Chat error:', error)
      // Remove typing indicator and show error
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing')
        return [...filtered, {
          id: Date.now().toString(),
          type: 'ai',
          content: 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date()
        }]
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  const requestHint = () => {
    setInput('Can you give me a hint?')
    setHintsUsed(prev => {
      const newCount = prev + 1
      if (session) {
        updateProgress({ hints_used: newCount })
      }
      return newCount
    })
  }

  const showCode = () => {
    setInput('Can you show me the code structure?')
  }

  const visualize = () => {
    setInput('Can you help me visualize this?')
  }

  return (
    <div className={`flex flex-col h-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 ${className}`}>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl rounded-tl-lg p-4 shadow-xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="p-6">

          {/* Quick Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-3">
              <button
                onClick={requestHint}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-slate-700 hover:text-slate-900 text-sm font-medium transition-all hover:scale-105 flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Get Hint
              </button>
              <button
                onClick={showCode}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-slate-700 hover:text-slate-900 text-sm font-medium transition-all hover:scale-105 flex items-center gap-2"
              >
                <Code className="w-4 h-4 text-green-500" />
                Show Code
              </button>
              <button
                onClick={visualize}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-slate-700 hover:text-slate-900 text-sm font-medium transition-all hover:scale-105 flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-blue-500" />
                Visualize
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Press <kbd className="bg-white/10 px-2 py-1 rounded">⌘</kbd> + <kbd className="bg-white/10 px-2 py-1 rounded">Enter</kbd> to send
            </div>
          </div>

          {/* Input Field */}
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your thoughts or ask a question..."
                className="w-full resize-none bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all max-h-32 text-sm leading-relaxed border border-white/20"
                rows={1}
              />
              <div className="absolute right-4 top-4 flex gap-2">
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl px-8 py-4 font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                AI Response time: 0.8s
              </span>
              <span>Session: {sessionTime} minutes</span>
              {hintsUsed > 0 && <span>Hints used: {hintsUsed}</span>}
            </div>
            <span>
              Understanding: {session?.understanding_level || 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
