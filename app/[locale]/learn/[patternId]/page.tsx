import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Target, Users, Play, CheckCircle, Circle, ArrowRight, Zap, Eye, ArrowLeft, Brain } from 'lucide-react'
import { TwoPointerDemo } from '@/components/learning/TwoPointerDemo'
import { ProblemCard } from '@/components/learning/ProblemCard'
import { ChatInterface } from '@/components/learning/ChatInterface'
import { LearningChat } from '@/components/learning/LearningChat'
import { ErrorBoundary } from '@/components/ErrorBoundary'

interface Props {
  params: {
    patternId: string
  }
  searchParams: {
    start?: string
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
      description: 'The algorithm pattern that unlocks 40% of array and string interview questions',
      difficulty: 'Beginner',
      estimatedTime: '6-8 hours',
      interviewFreq: 'Very High',
      successRate: '89% interview success',
      companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'],

      levels: [
        {
          id: 'level-1',
          name: 'Interview Ready',
          description: 'Master core Two Pointer patterns for interview success',
          estimatedTime: '4-6 hours',
          problems: 8,
          objective: 'Solve standard Two Pointer questions confidently',
          icon: '🎯'
        },
        {
          id: 'level-2',
          name: 'Fluent Mastery',
          description: 'Handle all variations with confidence',
          estimatedTime: '2-3 hours',
          problems: 4,
          objective: 'Apply patterns to complex variations and edge cases',
          icon: '🚀'
        },
        {
          id: 'level-3',
          name: 'Expert Optimization',
          description: 'Master advanced optimizations and trade-offs',
          estimatedTime: '3-4 hours',
          problems: 4,
          objective: 'Multiple approaches and senior-level interview discussions',
          icon: '💎'
        }
      ],

      level1Problems: [
        {
          title: 'Two Sum II',
          description: 'Strategic pointer movement on sorted arrays',
          difficulty: 'Easy' as const,
          time: '30-45',
          category: 'foundation' as const
        },
        {
          title: 'Valid Palindrome',
          description: 'Pattern transfer to string problems',
          difficulty: 'Easy' as const,
          time: '20-30',
          category: 'foundation' as const
        },
        {
          title: 'Container With Water',
          description: 'Optimization thinking with greedy movement',
          difficulty: 'Medium' as const,
          time: '35-45',
          category: 'foundation' as const
        },
        {
          title: 'Move Zeroes',
          description: 'Fast-slow pointer variation',
          difficulty: 'Easy' as const,
          time: '25-35',
          category: 'foundation' as const
        },
        {
          title: '3Sum',
          description: 'Fixed element + two pointers combination',
          difficulty: 'Medium' as const,
          time: '45-60',
          category: 'advanced' as const
        },
        {
          title: 'Remove Duplicates',
          description: 'In-place modifications while traversing',
          difficulty: 'Easy' as const,
          time: '20-30',
          category: 'advanced' as const
        },
        {
          title: 'Sort Colors',
          description: 'Three-pointer coordination',
          difficulty: 'Medium' as const,
          time: '40-50',
          category: 'advanced' as const
        },
        {
          title: 'Remove Nth Node',
          description: 'Pattern transfer to linked lists',
          difficulty: 'Medium' as const,
          time: '35-45',
          category: 'mastery' as const
        }
      ],

      benefits: [
        'Reduce time complexity from O(n²) to O(n)',
        'Recognize Two Pointer opportunities instantly',
        'Handle sorted arrays and palindromes efficiently',
        'Master 3Sum and container optimization problems'
      ],

      prerequisites: [
        'Basic array manipulation',
        'Simple loops (for, while)',
        'Function writing'
      ],

      helpful: [
        'Seen array problems before',
        'Basic time complexity (O(n), O(n²))'
      ]
    }
  }

  return patterns[patternId as keyof typeof patterns]
}

export default function PatternOverviewPage({ params, searchParams }: Props) {
  const pattern = getPatternById(params.patternId)

  if (!pattern) {
    notFound()
  }

  // Show chat interface if start=true
  if (searchParams.start === 'true') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <ErrorBoundary fallback={
              <div className="h-[80vh] flex items-center justify-center bg-white/95 rounded-3xl border border-white/20">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Chat Error</h3>
                  <p className="text-slate-600">Please refresh the page to continue learning.</p>
                </div>
              </div>
            }>
              <LearningChat
                patternId={pattern.id}
                className="h-[85vh] bg-white/95 rounded-3xl border border-white/20 shadow-2xl"
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    )
  }

  // Show overview page (default)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link href="/learn" className="hover:text-purple-600">Learn</Link>
          <ArrowRight className="w-4 h-4" />
          <span>{pattern.name}</span>
        </div>

        {/* Hero Section */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="default">{pattern.difficulty}</Badge>
            <Badge variant="outline">{pattern.interviewFreq} frequency</Badge>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Master Two Pointer Technique
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            {pattern.description}
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 text-center mb-8">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="font-medium">{pattern.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="font-medium">{pattern.successRate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="font-medium">16 problems</span>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex items-center justify-center gap-4">
            <Link href={`/learn/${pattern.id}?start=true`}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Eye className="w-5 h-5 mr-2" />
              See How It Works
            </Button>
          </div>
        </header>

        {/* Demo Section */}
        <section className="mb-16">
          <TwoPointerDemo />
        </section>

        {/* What You'll Master - Level 1 Problems */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
            What You'll Master
          </h2>
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Level 1: Interview Ready (4-6 hours)
            </h3>
            <p className="text-slate-600">
              Master these 8 core problems and you're interview-confident
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {pattern.level1Problems.map((problem, index) => (
              <ProblemCard
                key={index}
                title={problem.title}
                description={problem.description}
                difficulty={problem.difficulty}
                time={problem.time}
                category={problem.category}
              />
            ))}
          </div>
        </section>

        {/* Learning Journey */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Your Learning Journey
          </h2>

          <div className="space-y-6">
            {pattern.levels.map((level, index) => (
              <Card key={level.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                        {level.icon}
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
                  <p className="text-sm text-slate-600 mb-4">
                    <strong>Goal:</strong> {level.objective}
                  </p>

                  {index === 0 && (
                    <Link href={`/learn/${pattern.id}?start=true`}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                        <Play className="w-4 h-4 mr-2" />
                        Begin Your Journey
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
        </section>

        {/* Prerequisites */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Prerequisites
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Required:</h3>
              <div className="space-y-2">
                {pattern.prerequisites.map((req, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Helpful:</h3>
              <div className="space-y-2">
                {pattern.helpful.map((help, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{help}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ready to Start */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to Master Two Pointer?
          </h2>
          <div className="space-y-2 mb-8 text-slate-600">
            <p>✅ Start immediately after signup</p>
            <p>✅ 6-8 hour time investment</p>
            <p>✅ Interview-ready outcome guaranteed</p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href={`/learn/${pattern.id}?start=true`}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Try Free Preview
            </Button>
          </div>

          <p className="text-sm text-slate-500 mt-4">
            Join 2,000+ developers who've mastered algorithmic thinking
          </p>
        </section>

        {/* Companies */}
        <div className="max-w-3xl mx-auto text-center mt-16">
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
