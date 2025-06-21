import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChatInterface } from '@/components/learning/ChatInterface'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Clock, Target, Brain, TrendingUp } from 'lucide-react'
import { ProgressHeader } from '@/components/learning/ProgressHeader'

interface Props {
  params: {
    patternId: string
    problemId: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const problem = getProblemById(params.patternId, params.problemId)

  if (!problem) {
    return { title: 'Problem Not Found' }
  }

  return {
    title: `${problem.title} - ${problem.patternName}`,
    description: problem.description,
  }
}

function getProblemById(patternId: string, problemId: string) {
  const problems = {
    'two-pointer': {
      'two-sum-ii': {
        id: 'two-sum-ii',
        title: 'Two Sum II - Input Array is Sorted',
        patternName: 'Two Pointer Technique',
        difficulty: 'Easy',
        estimatedTime: '30-45 minutes',
        description: 'Find two numbers in sorted array that sum to target',
        category: 'Foundation',
        level: 1,
        position: 1,
        totalProblems: 8
      },
      'valid-palindrome': {
        id: 'valid-palindrome',
        title: 'Valid Palindrome',
        patternName: 'Two Pointer Technique',
        difficulty: 'Easy',
        estimatedTime: '20-30 minutes',
        description: 'Check if string is palindrome using two pointers',
        category: 'Foundation',
        level: 1,
        position: 2,
        totalProblems: 8
      }
    }
  }

  return problems[patternId as keyof typeof problems]?.[problemId as keyof typeof problems[keyof typeof problems]]
}

export default function ProblemPage({ params }: Props) {
  const problem = getProblemById(params.patternId, params.problemId)

  if (!problem) {
    notFound()
  }

  const sessionId = `${params.patternId}-${params.problemId}-${Date.now()}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">

      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/learn/${params.patternId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Pattern
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">{problem.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span>{problem.patternName}</span>
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    <span>Problem {problem.position} of {problem.totalProblems}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="secondary">{problem.difficulty}</Badge>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                {problem.estimatedTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Problem Header */}
          <ProgressHeader
            patternId={params.patternId}
            problemTitle={problem.title}
            position={problem.position}
            totalProblems={problem.totalProblems}
          />

          {/* Chat Interface */}
          <ErrorBoundary fallback={
            <div className="h-[70vh] flex items-center justify-center bg-white/95 rounded-3xl border border-white/20">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Chat Error</h3>
                <p className="text-slate-600">Please refresh the page to continue learning.</p>
              </div>
            </div>
          }>
            <ChatInterface
              patternId={params.patternId}
              problemId={params.problemId}
              sessionId={sessionId}
              className="h-[70vh]"
            />
          </ErrorBoundary>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" disabled>
              Previous Problem
            </Button>
            <Button disabled>
              Next Problem
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
