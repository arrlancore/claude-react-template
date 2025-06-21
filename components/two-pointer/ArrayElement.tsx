import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ArrayElementProps {
  value: any
  index: number
  isLeft?: boolean
  isRight?: boolean
  className?: string
}

export function ArrayElement({
  value,
  index,
  isLeft = false,
  isRight = false,
  className
}: ArrayElementProps) {
  const isHighlighted = isLeft || isRight

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }} // Appear instantly
      whileHover={{
        scale: isHighlighted ? 1.05 : 1.02, // Subtle hover only
        transition: { duration: 0.15 }
      }}
      animate={isHighlighted ? { scale: 1.1 } : { scale: 1 }} // Only animate when highlighted
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg",
        className
      )}
    >
      <div
        className={cn(
          "w-full h-full rounded-xl flex items-center justify-center",
          "transition-all duration-300 ease-out",
          isLeft
            ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white ring-4 ring-blue-300/50"
            : isRight
            ? "bg-gradient-to-br from-pink-400 to-pink-600 text-white ring-4 ring-pink-300/50"
            : "bg-white/10 text-white border border-white/20",
          isHighlighted && "shadow-2xl z-10"
        )}
      >
        <span>{value}</span>
      </div>

      {/* Pointer Labels - only animate when appearing */}
      {isLeft && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg">
            LEFT
          </div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500 mx-auto"></div>
        </motion.div>
      )}

      {isRight && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-pink-500 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg">
            RIGHT
          </div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-pink-500 mx-auto"></div>
        </motion.div>
      )}
    </motion.div>
  )
}
