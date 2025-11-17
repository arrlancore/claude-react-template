import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedLogProps {
  message: string
  isVisible: boolean
  className?: string
}

export function AnimatedLog({ message, isVisible, className }: AnimatedLogProps) {
  return (
    <div className="absolute bottom-0 left-8 right-8 h-16 flex items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={message} // Re-animate when message changes
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.9,
              filter: "blur(10px)"
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)"
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.9,
              filter: "blur(10px)"
            }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1.0]
            }}
            className={cn(className)}
          >
            <motion.div
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl px-6 py-3 border border-white/20 max-w-3xl"
              initial={{ boxShadow: "0 0 0 0 rgba(168, 85, 247, 0)" }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(168, 85, 247, 0)",
                  "0 0 20px 5px rgba(168, 85, 247, 0.3)",
                  "0 0 0 0 rgba(168, 85, 247, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.p
                className="text-white text-sm font-medium text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {message}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
