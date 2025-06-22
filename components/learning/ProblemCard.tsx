import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

interface ProblemCardProps {
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  time: string
  category: 'foundation' | 'advanced' | 'mastery'
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Hard: 'bg-red-100 text-red-700 border-red-200'
}

const categoryIcons = {
  foundation: '🔧',
  advanced: '⚡',
  mastery: '🎯'
}

export function ProblemCard({ title, description, difficulty, time, category }: ProblemCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryIcons[category]}</span>
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <Badge variant="outline" className={difficultyColors[difficulty]}>
          {difficulty}
        </Badge>
      </div>
      <p className="text-gray-600 text-xs mb-3 leading-relaxed">{description}</p>
      <div className="flex items-center text-xs text-gray-500">
        <Clock className="w-3 h-3 mr-1" />
        ~{time} min
      </div>
    </div>
  )
}
