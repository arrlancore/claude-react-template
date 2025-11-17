import React from 'react'
import { motion } from 'framer-motion'
import { Pattern } from './hooks/usePatternGeneration'

interface PatternSelectorProps {
  patterns: Record<string, Pattern>
  currentPattern: string
  onPatternChange: (patternKey: string) => void
}

export function PatternSelector({
  patterns,
  currentPattern,
  onPatternChange
}: PatternSelectorProps) {
  return (
    <div className="flex justify-center mb-8 gap-4">
      {Object.entries(patterns).map(([key, pattern], index) => (
        <motion.button
          key={key}
          onClick={() => onPatternChange(key)}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden ${
            currentPattern === key
              ? "text-white shadow-lg shadow-purple-500/25"
              : "bg-white/10 text-purple-200 hover:bg-white/20 backdrop-blur-sm"
          }`}
        >
          {/* Active background with gradient */}
          {currentPattern === key && (
            <motion.div
              layoutId="activeBackground"
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
          )}

          {/* Button content */}
          <span className="relative z-10">
            {pattern.name}
          </span>

          {/* Hover effect */}
          <motion.div
            className="absolute inset-0 bg-white/5 opacity-0"
            whileHover={{ opacity: currentPattern === key ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      ))}
    </div>
  )
}
