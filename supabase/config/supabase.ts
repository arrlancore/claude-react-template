import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client for browser/client-side usage
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: { 'x-my-custom-header': 'dsa-pattern-master' },
  },
})

// Admin client for server-side usage (requires service role key)
export const supabaseAdmin = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
    })
  : null

// Helper function to get user ID from session
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  return user
}

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error getting user profile:', error)
    return null
  }

  return data
}

// Helper function to check if user has active subscription
export const hasActiveSubscription = async (userId: string) => {
  const profile = await getUserProfile(userId)
  if (!profile) return false

  return profile.subscription_status === 'active' || profile.subscription_status === 'trial'
}

// Helper function for MVP - check if user can access two-pointer pattern
export const canAccessTwoPointer = async (userId: string) => {
  // For MVP, all users can access two-pointer pattern
  return await hasActiveSubscription(userId)
}

// Database configuration constants
export const DB_CONFIG = {
  // MVP: Only two-pointer pattern is active
  ACTIVE_PATTERNS: ['two-pointer'],

  // AI usage limits
  DEFAULT_MONTHLY_AI_LIMIT: 3.00, // $3.00
  TRIAL_DURATION_DAYS: 14,

  // Learning session settings
  SESSION_TIMEOUT_HOURS: 24,
  MAX_CONCURRENT_SESSIONS: 1,

  // Two pointer specific configuration
  TWO_POINTER: {
    LEVEL_1_PROBLEMS: [
      'two-sum-ii',
      'valid-palindrome',
      'container-with-water',
      'move-zeroes',
      'three-sum',
      'remove-duplicates',
      'sort-colors',
      'remove-nth-node'
    ],
    MASTERY_THRESHOLD: 80,
    UNDERSTANDING_THRESHOLD: 75,
  },
} as const

// Type guards for runtime validation
export const isValidPatternId = (id: string): id is 'two-pointer' => {
  return DB_CONFIG.ACTIVE_PATTERNS.includes(id)
}

export const isValidTwoPointerProblem = (problem: string): problem is Database['public']['Tables']['learning_sessions']['Row']['stage_progress'] => {
  return DB_CONFIG.TWO_POINTER.LEVEL_1_PROBLEMS.includes(problem)
}

// Error handling utilities
export class SupabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'SupabaseError'
  }
}

export const handleSupabaseError = (error: any): never => {
  console.error('Supabase error:', error)

  if (error.code === 'PGRST116') {
    throw new SupabaseError('Resource not found', 'NOT_FOUND')
  }

  if (error.code === '23505') {
    throw new SupabaseError('Resource already exists', 'DUPLICATE')
  }

  if (error.message?.includes('JWT')) {
    throw new SupabaseError('Authentication required', 'AUTH_REQUIRED')
  }

  throw new SupabaseError(error.message || 'Database operation failed', error.code)
}
