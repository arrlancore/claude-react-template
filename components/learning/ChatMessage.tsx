import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Target, Users, CheckCircle, X } from 'lucide-react'

interface MessageData {
  type: 'welcome' | 'calibration' | 'quiz' | 'result' | 'problem' | 'celebration'
  content: string
  options?: Array<{
    id: string
    text: string
    action?: string
  }>
  metadata?: Record<string, any>
}

interface ChatMessageProps {
  message: MessageData
  onOptionSelect?: (optionId: string, action?: string) => void
  className?: string
}

export function ChatMessage({ message, onOptionSelect, className = '' }: ChatMessageProps) {
  if (message.type === 'welcome') {
    return (
      <Card className={`max-w-2xl ${className}`}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Ready to master Two Pointer? 🎯</h2>
            <p className="text-slate-600">{message.content}</p>

            {message.options && (
              <div className="flex gap-3 justify-center pt-4">
                {message.options.map(option => (
                  <Button
                    key={option.id}
                    onClick={() => onOptionSelect?.(option.id, option.action)}
                    variant={option.id === 'start' ? 'default' : 'outline'}
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (message.type === 'calibration') {
    return (
      <Card className={`max-w-2xl ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Quick Calibration</h3>
            <p className="text-slate-600">{message.content}</p>

            {message.options && (
              <div className="space-y-2">
                {message.options.map(option => (
                  <Button
                    key={option.id}
                    onClick={() => onOptionSelect?.(option.id, option.action)}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-4"
                  >
                    <span className="font-medium mr-2">{option.id.toUpperCase()})</span>
                    {option.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (message.type === 'result') {
    const { persona } = message.metadata || {}

    return (
      <Card className={`max-w-2xl ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-900">Perfect! You're all set</h3>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-2">Your AI Mentor Profile:</h4>
              <Badge variant="secondary" className="mb-2">{persona?.name || 'Balanced Learner'}</Badge>
              <p className="text-sm text-slate-600">{persona?.ai_approach || 'Thorough explanations with moderate pace'}</p>
            </div>

            <p className="text-slate-600">{message.content}</p>

            {message.options && (
              <div className="flex gap-3 justify-center pt-2">
                {message.options.map(option => (
                  <Button
                    key={option.id}
                    onClick={() => onOptionSelect?.(option.id, option.action)}
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default message type
  return (
    <Card className={`max-w-2xl ${className}`}>
      <CardContent className="p-4">
        <p className="text-slate-700">{message.content}</p>

        {message.options && (
          <div className="flex gap-2 mt-3">
            {message.options.map(option => (
              <Button
                key={option.id}
                onClick={() => onOptionSelect?.(option.id, option.action)}
                size="sm"
                variant="outline"
              >
                {option.text}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
