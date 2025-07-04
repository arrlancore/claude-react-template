import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Target, Users, CheckCircle, X } from 'lucide-react'

interface MessageData {
  type: 'welcome' | 'calibration' | 'quiz' | 'result' | 'problem_intro' | 'code_editor' | 'hint' | 'celebration'
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

  if (message.type === 'problem_intro') {
    const { problem } = message.metadata || {}

    return (
      <Card className={`max-w-3xl ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={problem?.difficulty === 'Easy' ? 'default' : problem?.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                  {problem?.difficulty}
                </Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {problem?.timeEstimate}
                </Badge>
              </div>
              {problem?.leetcodeId && (
                <Badge variant="outline">LeetCode #{problem.leetcodeId}</Badge>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{problem?.title}</h3>
              <p className="text-slate-600">{problem?.description}</p>
            </div>

            {problem?.testCases && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Examples:</h4>
                <div className="space-y-3">
                  {problem.testCases.slice(0, 2).map((testCase: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="font-mono bg-white p-2 rounded border">
                        <div><strong>Input:</strong> {JSON.stringify(testCase.input)}</div>
                        <div><strong>Output:</strong> {JSON.stringify(testCase.expected)}</div>
                      </div>
                      <div className="text-slate-600 mt-1">{testCase.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {message.options && (
              <div className="flex gap-3 pt-4">
                {message.options.map(option => (
                  <Button
                    key={option.id}
                    onClick={() => onOptionSelect?.(option.id, option.action)}
                    variant={option.id === 'start_coding' ? 'default' : 'outline'}
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

  if (message.type === 'code_editor') {
    const { problem } = message.metadata || {}

    return (
      <Card className={`max-w-4xl ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Implementation</h3>

            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-green-400">{problem?.template}</pre>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => onOptionSelect?.('run_code', 'execute_code')}>
                Run Tests
              </Button>
              <Button variant="outline" onClick={() => onOptionSelect?.('hint', 'request_hint')}>
                Need Help?
              </Button>
              <Button variant="outline" onClick={() => onOptionSelect?.('submit', 'submit_solution')}>
                Submit Solution
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (message.type === 'hint') {
    const { hint } = message.metadata || {}

    return (
      <Card className={`max-w-2xl border-yellow-200 bg-yellow-50 ${className}`}>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Hint {hint?.level}/4</h3>
            </div>
            <p className="text-yellow-800">{hint?.content}</p>

            {message.options && (
              <div className="flex gap-2 pt-2">
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
          </div>
        </CardContent>
      </Card>
    )
  }

  if (message.type === 'celebration') {
    const { achievement, nextProblem } = message.metadata || {}

    return (
      <Card className={`max-w-2xl border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h3 className="text-xl font-bold text-green-900">Problem Complete! 🎉</h3>
            <p className="text-green-800">{message.content}</p>

            {achievement && (
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  🏆 {achievement}
                </Badge>
              </div>
            )}

            {message.options && (
              <div className="flex gap-3 justify-center pt-4">
                {message.options.map(option => (
                  <Button
                    key={option.id}
                    onClick={() => onOptionSelect?.(option.id, option.action)}
                    variant={option.id === 'continue' ? 'default' : 'outline'}
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
