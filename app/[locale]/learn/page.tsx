import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Learn DSA Patterns - PatternLift',
  description: 'Master data structures and algorithms through AI-guided pattern learning',
}

const patterns = [
  {
    id: 'two-pointer',
    name: 'Two Pointer Technique',
    description: 'Master array and string problems with strategic pointer movement',
    difficulty: 'Beginner',
    estimatedTime: '6-12 hours',
    problems: 12,
    interviewFreq: 'Very High',
    companies: ['Google', 'Microsoft', 'Amazon', 'Meta'],
    progress: 0,
    isAvailable: true
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    description: 'Optimize subarray and substring problems efficiently',
    difficulty: 'Beginner',
    estimatedTime: '8-14 hours',
    problems: 10,
    interviewFreq: 'High',
    companies: ['Google', 'Amazon', 'Netflix'],
    progress: 0,
    isAvailable: false
  },
  {
    id: 'fast-slow-pointers',
    name: 'Fast & Slow Pointers',
    description: 'Detect cycles and find middle elements in linked lists',
    difficulty: 'Intermediate',
    estimatedTime: '6-10 hours',
    problems: 8,
    interviewFreq: 'High',
    companies: ['LinkedIn', 'Microsoft', 'Apple'],
    progress: 0,
    isAvailable: false
  }
]

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Master DSA Patterns
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Learn algorithmic thinking through AI-guided pattern mastery.
            Start with core patterns that unlock 90% of interview problems.
          </p>
        </div>

        {/* Pattern Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {patterns.map((pattern) => (
            <Card
              key={pattern.id}
              className={`relative transition-all duration-300 ${
                pattern.isAvailable
                  ? 'hover:shadow-xl hover:scale-105 cursor-pointer'
                  : 'opacity-60'
              }`}
            >
              {!pattern.isAvailable && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={pattern.difficulty === 'Beginner' ? 'default' : 'secondary'}>
                    {pattern.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {pattern.interviewFreq}
                  </Badge>
                </div>

                <CardTitle className="text-xl">{pattern.name}</CardTitle>
                <CardDescription className="text-sm">
                  {pattern.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>{pattern.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span>{pattern.problems} problems</span>
                    </div>
                  </div>

                  {/* Companies */}
                  <div>
                    <div className="text-xs text-slate-500 mb-2">Used at:</div>
                    <div className="flex flex-wrap gap-1">
                      {pattern.companies.slice(0, 3).map((company) => (
                        <Badge key={company} variant="outline" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                      {pattern.companies.length > 3 && (
                        <span className="text-xs text-slate-500">
                          +{pattern.companies.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  {pattern.progress > 0 && (
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{pattern.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${pattern.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  {pattern.isAvailable && (
                    <Link href={`/learn/${pattern.id}`}>
                      <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg py-3 text-center font-semibold transition-all mt-4">
                        {pattern.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                      </div>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Why Pattern-Based Learning?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900">5x Faster Learning</h3>
              <p className="text-sm text-slate-600">
                Master patterns that solve 90% of problems instead of grinding hundreds of random questions.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900">AI-Guided Discovery</h3>
              <p className="text-sm text-slate-600">
                Learn through Socratic questioning that builds deep understanding, not memorization.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Interview Ready</h3>
              <p className="text-sm text-slate-600">
                Complete each pattern to become confident with that technique in real interviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
