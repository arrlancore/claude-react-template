export interface Problem {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeEstimate: string
  category: 'foundation' | 'advanced' | 'mastery'
  leetcodeId?: number
  template: string
  testCases: TestCase[]
  hints: Hint[]
}

export interface TestCase {
  input: Record<string, any>
  expected: any
  explanation: string
}

export interface Hint {
  level: number
  trigger: string
  type: 'conceptual' | 'strategic' | 'implementation' | 'solution'
  content: string
}

export interface ProblemProgress {
  currentProblem: number
  completedProblems: string[]
  achievements: string[]
  codeSubmissions: Record<string, string>
  hintsUsed: Record<string, number>
}

export class ProblemEngine {
  private static readonly PROBLEMS: Problem[] = [
    {
      id: 'two-sum-ii',
      title: 'Two Sum II - Input Array is Sorted',
      description: 'Given a sorted array, find two numbers that add up to a specific target.',
      difficulty: 'Easy',
      timeEstimate: '30-45 min',
      category: 'foundation',
      leetcodeId: 167,
      template: `def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            # TODO: Which pointer should move?
            pass
        else:
            # TODO: Which pointer should move?
            pass

    return []`,
      testCases: [
        {
          input: { numbers: [2,7,11,15], target: 9 },
          expected: [1,2],
          explanation: "2 + 7 = 9, return indices 1 and 2"
        },
        {
          input: { numbers: [2,3,4], target: 6 },
          expected: [1,3],
          explanation: "2 + 4 = 6, return indices 1 and 3"
        }
      ],
      hints: [
        {
          level: 1,
          trigger: "no_progress_3_minutes",
          type: "conceptual",
          content: "Think about what each pointer represents. Left pointer is at the SMALLEST available value, right pointer is at the LARGEST available value."
        },
        {
          level: 2,
          trigger: "wrong_direction_movement",
          type: "strategic",
          content: "If the sum is too high, which pointer should we move to make it smaller? Remember: left=smallest, right=largest."
        },
        {
          level: 3,
          trigger: "implementation_stuck",
          type: "implementation",
          content: "When sum < target, move left++. When sum > target, move right--. The loop continues until left >= right."
        },
        {
          level: 4,
          trigger: "multiple_failures",
          type: "solution",
          content: "Here's the pattern: Always move the pointer that helps you get closer to the target."
        }
      ]
    },
    {
      id: 'valid-palindrome',
      title: 'Valid Palindrome',
      description: 'Check if a string is a palindrome, considering only alphanumeric characters.',
      difficulty: 'Easy',
      timeEstimate: '20-30 min',
      category: 'foundation',
      leetcodeId: 125,
      template: `def isPalindrome(s):
    left, right = 0, len(s) - 1

    while left < right:
        # Skip non-alphanumeric characters
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        # TODO: Compare characters and move pointers
        pass

    return True`,
      testCases: [
        {
          input: { s: "A man, a plan, a canal: Panama" },
          expected: true,
          explanation: "After removing non-alphanumeric: 'amanaplanacanalpanama' is palindrome"
        },
        {
          input: { s: "race a car" },
          expected: false,
          explanation: "After removing non-alphanumeric: 'raceacar' is not palindrome"
        }
      ],
      hints: [
        {
          level: 1,
          trigger: "no_progress_3_minutes",
          type: "conceptual",
          content: "This uses the SAME pointer movement as Two Sum II, but instead of comparing sums, you're comparing characters."
        },
        {
          level: 2,
          trigger: "character_comparison_stuck",
          type: "strategic",
          content: "Convert both characters to lowercase before comparing. If they don't match, it's not a palindrome."
        }
      ]
    }
  ]

  static getProblemById(id: string): Problem | null {
    return this.PROBLEMS.find(p => p.id === id) || null
  }

  static getProblemByIndex(index: number): Problem | null {
    return this.PROBLEMS[index] || null
  }

  static getTotalProblems(): number {
    return this.PROBLEMS.length
  }

  static getNextProblem(currentId: string): Problem | null {
    const currentIndex = this.PROBLEMS.findIndex(p => p.id === currentId)
    if (currentIndex === -1 || currentIndex >= this.PROBLEMS.length - 1) {
      return null
    }
    return this.PROBLEMS[currentIndex + 1]
  }

  static createProgressState(): ProblemProgress {
    return {
      currentProblem: 0,
      completedProblems: [],
      achievements: [],
      codeSubmissions: {},
      hintsUsed: {}
    }
  }
}
