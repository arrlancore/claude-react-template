import { useState, useMemo, useCallback } from 'react'

export interface PatternStep {
  left: number
  right: number
  found: boolean
  sum?: number
  match?: boolean
  swap?: [any, any] | null
  arrayState?: any[]  // Track array state at each step for animations
  log: string
}

export interface Pattern {
  name: string
  array: any[]
  target: any
  description: string
  steps: PatternStep[]
}

export interface CustomData {
  'pair-sum': { array: string; target: string }
  palindrome: { array: string; target: string }
  reverse: { array: string; target: string }
}

export function usePatternGeneration() {
  const [customData, setCustomData] = useState<CustomData>({
    'pair-sum': { array: '1,3,6,8,11,15', target: '14' },
    palindrome: { array: 'r,a,c,e,c,a,r', target: '' },
    reverse: { array: '1,2,3,4,5,6', target: '' },
  })

  const parseArray = useCallback((str: string, isNumeric = true) => {
    return str.split(',').map((item) => {
      const trimmed = item.trim()
      return isNumeric && !isNaN(Number(trimmed)) ? Number(trimmed) : trimmed
    })
  }, [])

  const generatePairSumSteps = useCallback((arr: number[], target: number): PatternStep[] => {
    const steps: PatternStep[] = []
    let left = 0
    let right = arr.length - 1

    while (left < right) {
      const sum = arr[left] + arr[right]
      steps.push({
        left,
        right,
        found: sum === target,
        sum,
        arrayState: [...arr], // Array doesn't change for pair sum
        log: `Check if ${arr[left]} + ${arr[right]} = ${target}. Sum is ${sum}. ${
          sum === target
            ? 'Found target!'
            : sum > target
            ? 'Sum too large, move right pointer left'
            : 'Sum too small, move left pointer right'
        }`,
      })

      if (sum === target) break
      if (sum > target) right--
      else left++
    }

    return steps
  }, [])

  const generatePalindromeSteps = useCallback((arr: string[]): PatternStep[] => {
    const steps: PatternStep[] = []
    let left = 0
    let right = arr.length - 1

    while (left <= right) {
      const match = arr[left] === arr[right]
      steps.push({
        left,
        right,
        found: left >= right,
        match,
        arrayState: [...arr], // Array doesn't change for palindrome check
        log: `Compare '${arr[left]}' with '${arr[right]}'. ${
          match ? 'Characters match!' : "Characters don't match - not a palindrome"
        } ${left >= right ? 'Reached center - palindrome confirmed!' : ''}`,
      })

      if (!match) break
      left++
      right--
    }

    return steps
  }, [])

  const generateReverseSteps = useCallback((arr: any[]): PatternStep[] => {
    const steps: PatternStep[] = []
    let workingArray = [...arr] // Create working copy to modify
    let left = 0
    let right = arr.length - 1

    // Add initial state
    steps.push({
      left,
      right,
      found: false,
      swap: null,
      arrayState: [...workingArray],
      log: `Starting array reversal with [${workingArray.join(', ')}]. Two pointers will meet in the middle.`,
    })

    while (left < right) {
      // Record the values that will be swapped
      const leftVal = workingArray[left]
      const rightVal = workingArray[right]

      // Actually perform the swap using temporary variable
      const temp = workingArray[left]
      workingArray[left] = workingArray[right]
      workingArray[right] = temp

      steps.push({
        left,
        right,
        found: false,
        swap: [leftVal, rightVal],
        arrayState: [...workingArray], // Capture state after swap
        log: `Swapped positions ${left} and ${right}: ${leftVal} ↔ ${rightVal}. Array: [${workingArray.join(', ')}]`,
      })

      left++
      right--
    }

    // Final completion step
    steps.push({
      left: Math.floor(arr.length / 2),
      right: Math.floor(arr.length / 2),
      found: true,
      swap: null,
      arrayState: [...workingArray],
      log: `Array reversal complete! Final result: [${workingArray.join(', ')}]`,
    })

    return steps
  }, [])

  const patterns = useMemo((): Record<string, Pattern> => {
    const pairSumArray = parseArray(customData['pair-sum'].array, true) as number[]
    const palindromeArray = parseArray(customData.palindrome.array, false) as string[]
    const reverseArray = parseArray(customData.reverse.array, true)

    return {
      'pair-sum': {
        name: 'Pair Sum',
        array: pairSumArray,
        target: Number(customData['pair-sum'].target),
        description: 'Find two numbers that sum to target',
        steps: generatePairSumSteps(pairSumArray, Number(customData['pair-sum'].target)),
      },
      palindrome: {
        name: 'Palindrome Check',
        array: palindromeArray,
        target: null,
        description: 'Check if string is palindrome',
        steps: generatePalindromeSteps(palindromeArray),
      },
      reverse: {
        name: 'Array Reversal',
        array: reverseArray,
        target: null,
        description: 'Reverse array in-place',
        steps: generateReverseSteps(reverseArray),
      },
    }
  }, [customData, parseArray, generatePairSumSteps, generatePalindromeSteps, generateReverseSteps])

  const updateCustomData = useCallback((patternType: keyof CustomData, field: string, value: string) => {
    setCustomData(prev => ({
      ...prev,
      [patternType]: {
        ...prev[patternType],
        [field]: value,
      },
    }))
  }, [])

  return {
    patterns,
    customData,
    updateCustomData,
  }
}
