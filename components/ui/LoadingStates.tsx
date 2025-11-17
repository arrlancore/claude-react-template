import { AlertCircle, Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className="flex items-center justify-center gap-3 p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-600`} />
      {text && <span className="text-slate-600">{text}</span>}
    </div>
  )
}

interface ErrorStateProps {
  error: string
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="w-8 h-8 text-red-600" />
      <div className="text-center">
        <h3 className="font-semibold text-red-800 mb-1">Error</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
