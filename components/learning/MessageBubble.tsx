'use client'

import { Heart, Lightbulb, ThumbsUp } from 'lucide-react'

interface Message {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAI = message.type === 'ai'
  const isTyping = message.isTyping

  if (isTyping) {
    return (
      <div className="flex items-start gap-6 animate-in slide-in-from-bottom-4 duration-400">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl rounded-tl-lg p-4 shadow-xl">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (isAI) {
    return (
      <div className="flex items-start gap-6 animate-in slide-in-from-bottom-4 duration-400">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-3xl rounded-tl-lg p-6 max-w-2xl shadow-xl text-white border border-purple-500/20">
          <div className="prose prose-invert text-sm leading-relaxed">
            {renderMessageContent(message.content)}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-purple-200">
              {formatTimestamp(message.timestamp)}
            </div>
            <div className="flex gap-3">
              <button className="text-purple-300 hover:text-white transition-colors text-xs flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                Helpful
              </button>
              <button className="text-purple-300 hover:text-white transition-colors text-xs flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Like
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-6 justify-end animate-in slide-in-from-bottom-4 duration-400">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl rounded-tr-lg p-6 max-w-xl shadow-xl text-white">
        <div className="text-sm leading-relaxed">
          {message.content}
        </div>
        <div className="flex items-center justify-end mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-purple-100">
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
        <span className="text-white text-xs font-semibold">You</span>
      </div>
    </div>
  )
}

function renderMessageContent(content: string) {
  // Basic markdown-like rendering for AI messages
  const lines = content.split('\n')

  return lines.map((line, index) => {
    // Code blocks
    if (line.startsWith('```')) {
      return null // Handle code blocks separately if needed
    }

    // Bold text
    if (line.includes('**')) {
      const parts = line.split('**')
      return (
        <p key={index} className="mb-4">
          {parts.map((part, i) =>
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
          )}
        </p>
      )
    }

    // Italic text
    if (line.includes('*')) {
      const parts = line.split('*')
      return (
        <p key={index} className="mb-4">
          {parts.map((part, i) =>
            i % 2 === 1 ? <em key={i}>{part}</em> : part
          )}
        </p>
      )
    }

    // Regular paragraph
    if (line.trim()) {
      return <p key={index} className="mb-4">{line}</p>
    }

    return null
  }).filter(Boolean)
}

function formatTimestamp(timestamp: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - timestamp.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minutes ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hours ago`

  return timestamp.toLocaleDateString()
}
