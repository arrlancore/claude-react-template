export interface PatternMetadata {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: {
    level1: string
    level2: string
    level3: string
    total: string
  }
  prerequisites: string[]
  companies: string[]
  interviewFrequency: 'very_high' | 'high' | 'medium' | 'low'
}

export interface LevelDefinition {
  id: string
  name: string
  description: string
  objective: string
  estimatedTime: string
  problems: ProblemReference[]
  successCriteria: {
    patternRecognitionSpeed: number
    implementationAccuracy: number
    transferSuccessRate: number
  }
}

export interface ProblemReference {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: string
  category: 'foundation' | 'extension' | 'mastery'
  description: string
  leetcodeId?: number
}

export interface PatternConfig {
  patternId: string
  metadata: PatternMetadata
  levels: {
    level1: LevelDefinition
    level2: LevelDefinition
    level3: LevelDefinition
  }
  progressionLogic: {
    level1Completion: CompletionCriteria
    level2Unlock: UnlockCriteria
    level3Unlock: UnlockCriteria
  }
}

export interface CompletionCriteria {
  requiredProblems: number
  minMasteryScore: number
  patternRecognitionTest: boolean
}

export interface UnlockCriteria {
  levelCompletion: boolean
  userChoice: boolean
}

export interface ProblemContent {
  id: string
  title: string
  description: string
  difficulty: string
  estimatedTime: string
  category: string
  objectives: string[]
  markdown: string
}

export interface PatternData {
  config: PatternConfig
  problems: Record<string, ProblemContent>
}
