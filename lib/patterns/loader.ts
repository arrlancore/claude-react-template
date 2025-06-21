import fs from 'fs/promises'
import path from 'path'
import { PatternConfig, PatternData, ProblemContent } from './types'

class PatternLoader {
  private patternsCache = new Map<string, PatternData>()
  private patternsDir = path.join(process.cwd(), 'patterns')

  async loadPattern(patternId: string): Promise<PatternData | null> {
    if (this.patternsCache.has(patternId)) {
      return this.patternsCache.get(patternId)!
    }

    try {
      const patternDir = path.join(this.patternsDir, patternId)
      const configPath = path.join(patternDir, 'config.json')

      // Check if pattern exists
      const configExists = await fs.access(configPath).then(() => true).catch(() => false)
      if (!configExists) {
        return null
      }

      // Load config
      const configRaw = await fs.readFile(configPath, 'utf-8')
      const config: PatternConfig = JSON.parse(configRaw)

      // Load all problems
      const problems = await this.loadProblems(patternDir, config)

      const patternData: PatternData = { config, problems }
      this.patternsCache.set(patternId, patternData)

      return patternData
    } catch (error) {
      console.error(`Failed to load pattern ${patternId}:`, error)
      return null
    }
  }

  async loadProblem(patternId: string, problemId: string): Promise<ProblemContent | null> {
    const pattern = await this.loadPattern(patternId)
    if (!pattern) return null

    return pattern.problems[problemId] || null
  }

  async listAvailablePatterns(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.patternsDir, { withFileTypes: true })
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
    } catch (error) {
      console.error('Failed to list patterns:', error)
      return []
    }
  }

  private async loadProblems(patternDir: string, config: PatternConfig): Promise<Record<string, ProblemContent>> {
    const problems: Record<string, ProblemContent> = {}
    const problemsDir = path.join(patternDir, 'problems')

    try {
      const allProblems = [
        ...config.levels.level1.problems,
        ...config.levels.level2.problems,
        ...config.levels.level3.problems
      ]

      for (const problemRef of allProblems) {
        const problemContent = await this.loadProblemFile(problemsDir, problemRef.id)
        if (problemContent) {
          problems[problemRef.id] = {
            ...problemContent,
            title: problemRef.title,
            difficulty: problemRef.difficulty,
            estimatedTime: problemRef.estimatedTime,
            category: problemRef.category,
            description: problemRef.description
          }
        }
      }
    } catch (error) {
      console.error('Failed to load problems:', error)
    }

    return problems
  }

  private async loadProblemFile(problemsDir: string, problemId: string): Promise<Partial<ProblemContent> | null> {
    try {
      // Try different filename patterns
      const patterns = [
        `${problemId}.md`,
        `${problemId.replace(/-/g, '_')}.md`,
        problemId.includes('-') ? `${problemId.split('-').map((part, i) =>
          i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
        ).join('')}.md` : null
      ].filter(Boolean)

      for (const pattern of patterns) {
        try {
          const filePath = path.join(problemsDir, pattern!)
          const markdown = await fs.readFile(filePath, 'utf-8')

          // Parse markdown front matter if exists
          const { content, frontMatter } = this.parseMarkdown(markdown)

          return {
            id: problemId,
            markdown: content,
            objectives: frontMatter.objectives || [],
            ...frontMatter
          }
        } catch {
          continue
        }
      }

      return null
    } catch (error) {
      console.error(`Failed to load problem ${problemId}:`, error)
      return null
    }
  }

  private parseMarkdown(content: string): { content: string; frontMatter: any } {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    const match = content.match(frontMatterRegex)

    if (!match) {
      return { content, frontMatter: {} }
    }

    try {
      // Simple YAML-like parsing for basic properties
      const frontMatterText = match[1]
      const frontMatter: any = {}

      frontMatterText.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim()

          // Handle arrays
          if (value.startsWith('[') && value.endsWith(']')) {
            frontMatter[key.trim()] = value
              .slice(1, -1)
              .split(',')
              .map(item => item.trim().replace(/['"]/g, ''))
          } else {
            frontMatter[key.trim()] = value.replace(/['"]/g, '')
          }
        }
      })

      return { content: match[2], frontMatter }
    } catch {
      return { content, frontMatter: {} }
    }
  }
}

export const patternLoader = new PatternLoader()
export { PatternLoader }
