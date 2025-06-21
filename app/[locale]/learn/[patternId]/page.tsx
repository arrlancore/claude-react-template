import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Target, Users, Play, CheckCircle, Circle, ArrowRight } from 'lucide-react'

interface Props {
  params: {
    patternId: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pattern = getPatternById(params.patternId)

  if (!pattern) {
    return {
      title: 'Pattern Not Found',
    }
  }

  return {
    title: `${pattern.name} - PatternLift`,
    description: pattern.description,
  }
}

// Simulated pattern data - will be replaced with actual pattern loader
function getPatternById(patternId: string) {
  const patterns = {
    'two-pointer': {
      id: 'two-pointer',
      name: 'Two Pointer Technique',
      description: 'Master array and string problems with strategic pointer movement',
      difficulty: 'Beginner',
      estimatedTime: '6-12 hours',
      interviewFreq: 'Very High',
      companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],

      levels: [
        {
          id: 'level-1',
          name: 'Interview Ready',
          description: 'Master core patterns for technical interviews',
          estimatedTime: '4-8 hours',
          problems: 8,
          objective: 'Recognize and solve standard Two Pointer problems confidently'
        },
        {
          id: 'level-2',
          name: 'Fluent Mastery',
          description: 'Handle all variations with confidence',
          estimatedTime: '2-4 hours',
          problems: 4,
          objective: 'Apply patterns to complex variations and edge cases'
        },
        {
          id: 'level-3',
          name: 'Expert Optimization',
          description: 'Master advanced optimizations',
          estimatedTime: '3-5 hours',
          problems: 4,
          objective: 'Optimize solutions and teach pattern to others'
        }
      ],

      benefits: [
        'Reduce time complexity from O(n²) to O(n)',
        'Recognize Two Pointer opportunities instantly',
        'Handle sorted arrays and palindromes efficiently',
        'Master 3Sum and container optimization problems'
      ]
    }
  }

  return patterns[patternId as keyof typeof patterns]
}

export default function PatternOverviewPage({ params }: Props) {
  const pattern = getPatternById(params.patternId)

  if (!pattern) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link href="/learn" className="hover:text-purple-600">Learn</Link>
          <ArrowRight className="w-4 h-4" />
          <span>{pattern.name}</span>
        </div>

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="default">{pattern.difficulty}</Badge>
            <Badge variant="outline">{pattern.interviewFreq} frequency</Badge>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {pattern.name}
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            {pattern.description}
          </p>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium">{pattern.estimatedTime}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">16 total problems</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">5+ companies</span>
            </div>
          </div>
        </div>

        {/* Learning Path */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Your Learning Journey
          </h2>

          <div className="space-y-6">
            {pattern.levels.map((level, index) => (
              <Card key={level.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-purple-600">{index + 1}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{level.name}</CardTitle>
                        <CardDescription>{level.description}</CardDescription>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-slate-500">{level.estimatedTime}</div>
                      <div className="text-sm text-slate-500">{level.problems} problems</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">{level.objective}</p>

                  {index === 0 && (
                    <Link href={`/learn/${pattern.id}/two-sum-ii`}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start Level 1
                      </Button>
                    </Link>
                  )}

                  {index > 0 && (
                    <Button variant="outline" disabled className="w-full">
                      <Circle className="w-4 h-4 mr-2" />
                      Complete Level {index} to Unlock
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            What You'll Master
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {pattern.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Companies */}
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Used by Engineers at
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {pattern.companies.map((company) => (
              <Badge key={company} variant="outline">
                {company}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
