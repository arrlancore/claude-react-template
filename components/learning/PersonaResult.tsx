'use client'

import React from 'react'
import { CalibrationResult } from '@/lib/types/learning'
import { calibrationEngine } from '@/lib/learning/calibration-engine'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Zap, Target, Heart, ArrowRight } from 'lucide-react'

interface PersonaResultProps {
  result: CalibrationResult
  onContinue: () => void
}

export function PersonaResult({ result, onContinue }: PersonaResultProps) {
  const { persona_type, guidance_config } = result

  const personaIcons = {
    struggling_learner: Heart,
    balanced_learner: Target,
    fast_learner: Zap
  }

  const personaColors = {
    struggling_learner: 'text-green-600 bg-green-100',
    balanced_learner: 'text-blue-600 bg-blue-100',
    fast_learner: 'text-purple-600 bg-purple-100'
  }

  const Icon = personaIcons[persona_type.id as keyof typeof personaIcons] || Target
  const colorClass = personaColors[persona_type.id as keyof typeof personaColors] || 'text-blue-600 bg-blue-100'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className={`p-4 rounded-full ${colorClass}`}>
            <Icon className="w-8 h-8" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Perfect! I'll be your {persona_type.name}
          </h2>
          <p className="text-gray-600">
            {calibrationEngine.getPersonaDescription(persona_type)}
          </p>
        </div>
      </div>

      {/* Guidance Strategy */}
      <Card className="border-2 border-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Your Personalized Learning Experience
          </CardTitle>
          <CardDescription>
            Based on your responses, here's how I'll guide you:
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="font-medium text-gray-800">Explanation Style</div>
              <Badge variant="secondary" className="capitalize">
                {guidance_config.explanation_depth} detail
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-gray-800">Learning Pace</div>
              <Badge variant="secondary" className="capitalize">
                {guidance_config.pace_preference}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-gray-800">Help & Hints</div>
              <Badge variant="secondary" className="capitalize">
                {guidance_config.hint_frequency} frequency
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-gray-800">Celebration Style</div>
              <Badge variant="secondary" className="capitalize">
                {guidance_config.celebration_style.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <div className="font-medium text-purple-900 mb-2">What this means for you:</div>
            <ul className="space-y-1 text-purple-800">
              {calibrationEngine.getPersonaGuidance(persona_type).map((guidance, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{guidance}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Two Pointer Journey</CardTitle>
          <CardDescription>
            {persona_type.id === 'fast_learner' && "You'll move quickly through 8 essential problems"}
            {persona_type.id === 'balanced_learner' && "You'll work through 8 problems with thorough understanding"}
            {persona_type.id === 'struggling_learner' && "We'll take our time with 8 carefully structured problems"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Level 1: Interview Ready</div>
                <div className="text-sm text-gray-600">8 core problems</div>
              </div>
              <Badge>
                {persona_type.id === 'fast_learner' && '4-6 hours'}
                {persona_type.id === 'balanced_learner' && '6-8 hours'}
                {persona_type.id === 'struggling_learner' && '8-10 hours'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
              <div>
                <div className="font-medium">Level 2: Fluent Mastery</div>
                <div className="text-sm text-gray-600">Advanced variations</div>
              </div>
              <Badge variant="outline">Optional</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
              <div>
                <div className="font-medium">Level 3: Expert Optimization</div>
                <div className="text-sm text-gray-600">Complex problems</div>
              </div>
              <Badge variant="outline">Advanced</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center">
        <Button
          onClick={onContinue}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          Start Learning Journey
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        <p className="text-sm text-gray-500 mt-3">
          Don't worry - you can always adjust the pace as we go!
        </p>
      </div>
    </div>
  )
}
