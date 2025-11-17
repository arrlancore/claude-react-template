import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '../shared/ui/GlassCard'
import { Clock, Target, Zap, CheckCircle } from 'lucide-react'

export function AlgorithmExplanation() {
  const features = [
    {
      icon: Clock,
      title: "Time Complexity",
      description: "Reduces from O(n²) to O(n)",
      color: "text-blue-400"
    },
    {
      icon: Target,
      title: "Space Efficient",
      description: "O(1) space complexity",
      color: "text-green-400"
    },
    {
      icon: Zap,
      title: "Fast Execution",
      description: "No nested loops required",
      color: "text-yellow-400"
    },
    {
      icon: CheckCircle,
      title: "Interview Ready",
      description: "Common in tech interviews",
      color: "text-purple-400"
    }
  ]

  const useCases = [
    "Finding pairs with specific sum",
    "Palindrome verification",
    "Array reversal in-place",
    "Removing duplicates",
    "Container with most water",
    "Merge sorted arrays"
  ]

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <GlassCard className="p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <div className="mr-3">⚡</div>
            How It Works
          </h3>

          <p className="text-purple-200 leading-relaxed mb-6">
            The two-pointer technique uses two pointers that move toward each
            other or in the same direction. This approach reduces time
            complexity from O(n²) to O(n) for many problems by eliminating the
            need for nested loops.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <div>
                  <div className="text-white text-sm font-medium">{feature.title}</div>
                  <div className="text-purple-300 text-xs">{feature.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </GlassCard>

      <GlassCard className="p-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <div className="mr-3">🎯</div>
            Common Use Cases
          </h3>

          <div className="space-y-3">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center text-purple-200 leading-relaxed"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                  className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3 flex-shrink-0"
                />
                {useCase}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-6 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20"
          >
            <p className="text-sm text-purple-200">
              💡 <strong>Pro Tip:</strong> Master this pattern and you'll solve 40% of array/string interview questions!
            </p>
          </motion.div>
        </motion.div>
      </GlassCard>
    </div>
  )
}
