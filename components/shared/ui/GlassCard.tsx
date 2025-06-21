import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'dark' | 'light'
}

export function GlassCard({
  children,
  className,
  variant = 'default'
}: GlassCardProps) {
  const variantStyles = {
    default: 'bg-white/5 border-white/10',
    dark: 'bg-black/20 border-white/5',
    light: 'bg-white/10 border-white/20'
  }

  return (
    <div
      className={cn(
        'backdrop-blur-xl rounded-2xl border',
        'shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]',
        'relative',
        'before:absolute before:inset-0 before:rounded-2xl',
        'before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-50',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  )
}
