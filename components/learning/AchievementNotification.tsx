'use client'

import React, { useEffect, useState } from 'react'
import { Achievement } from '@/lib/types/learning'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Trophy, Sparkles } from 'lucide-react'

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export function AchievementNotification({
  achievement,
  onClose,
  autoClose = true,
  duration = 4000
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)

    // Auto close
    if (autoClose) {
      const closeTimer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => {
        clearTimeout(timer)
        clearTimeout(closeTimer)
      }
    }

    return () => clearTimeout(timer)
  }, [autoClose, duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const rarityColors = {
    common: 'border-gray-400 bg-gray-50',
    uncommon: 'border-green-400 bg-green-50',
    rare: 'border-blue-400 bg-blue-50',
    epic: 'border-purple-400 bg-purple-50',
    legendary: 'border-orange-400 bg-orange-50',
    mythic: 'border-pink-400 bg-pink-50'
  }

  const rarityGlow = {
    common: 'shadow-gray-200',
    uncommon: 'shadow-green-200',
    rare: 'shadow-blue-200',
    epic: 'shadow-purple-200',
    legendary: 'shadow-orange-200',
    mythic: 'shadow-pink-200'
  }

  const colorClass = rarityColors[achievement.rarity as keyof typeof rarityColors] || rarityColors.common
  const glowClass = rarityGlow[achievement.rarity as keyof typeof rarityGlow] || rarityGlow.common

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible && !isLeaving
        ? 'transform translate-x-0 opacity-100'
        : 'transform translate-x-full opacity-0'
    }`}>
      <Card className={`w-80 border-2 ${colorClass} ${glowClass} shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Achievement Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl">
                {achievement.icon || <Trophy className="w-6 h-6" />}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 truncate">
                  {achievement.name}
                </h3>
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${
                    achievement.rarity === 'legendary' || achievement.rarity === 'mythic'
                      ? 'border-yellow-400 text-yellow-700'
                      : ''
                  }`}
                >
                  {achievement.rarity}
                </Badge>
              </div>

              <p className="text-sm text-gray-700 mb-2">
                {achievement.description}
              </p>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  +{achievement.points} points
                </Badge>
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface AchievementToastProps {
  achievements: Achievement[]
  onAchievementClose: (achievementId: string) => void
}

export function AchievementToast({ achievements, onAchievementClose }: AchievementToastProps) {
  return (
    <>
      {achievements.map((achievement, index) => (
        <div
          key={achievement.id}
          style={{
            top: `${1 + index * 5.5}rem` // Stack multiple notifications
          }}
        >
          <AchievementNotification
            achievement={achievement}
            onClose={() => onAchievementClose(achievement.id)}
            duration={5000}
          />
        </div>
      ))}
    </>
  )
}
