'use client'

import { useProgress } from '@/hooks/useProgress'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, Target, TrendingUp } from 'lucide-react'

interface ProgressHeaderProps {
  patternId: string
  problemTitle: string
  position: number
  totalProblems: number
}

export function ProgressHeader({
  patternId,
  problemTitle,
  position,
  totalProblems
}: ProgressHeaderProps) {
  const { session } = useProgress(patternId)

  if (!session) return null

  const progress = session.stage_progress
  const understandingLevel = session.understanding_level
  const completionPercent = (progress.problems_completed.length / totalProblems) * 100

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Badge>{progress.level === 1 ? 'Foundation' : progress.level === 2 ? 'Advanced' : 'Expert'}</Badge>
          <Badge variant="outline">Problem {position} of {totalProblems}</Badge>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            {progress.time_spent_minutes}m
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Target className="w-4 h-4" />
            {progress.hints_used} hints
          </div>
          <div className="flex items-center gap-2 text-purple-600">
            <TrendingUp className="w-4 h-4" />
            {understandingLevel}% understanding
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{problemTitle}</span>
          <span className="text-slate-500">Progress: {completionPercent.toFixed(0)}%</span>
        </div>

        <div className="space-y-2">
          <Progress value={understandingLevel} className="h-2" />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Understanding Level</span>
            <span>{understandingLevel}/100</span>
          </div>
        </div>
      </div>
    </div>
  )
}
