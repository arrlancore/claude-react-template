import React from 'react'
import { motion } from 'framer-motion'

interface ScaleTransitionProps {
  children: React.ReactNode
  isActive?: boolean
  scaleFrom?: number
  scaleTo?: number
  duration?: number
  className?: string
}

export function ScaleTransition({
  children,
  isActive = false,
  scaleFrom = 1,
  scaleTo = 1.1,
  duration = 0.3,
  className
}: ScaleTransitionProps) {
  return (
    <motion.div
      animate={{
        scale: isActive ? scaleTo : scaleFrom,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface PulseProps {
  children: React.ReactNode
  isActive?: boolean
  className?: string
}

export function Pulse({ children, isActive = false, className }: PulseProps) {
  return (
    <motion.div
      animate={isActive ? {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      } : {}}
      transition={{
        duration: 1.5,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface BounceProps {
  children: React.ReactNode
  trigger?: boolean
  className?: string
}

export function Bounce({ children, trigger = false, className }: BounceProps) {
  return (
    <motion.div
      animate={trigger ? {
        y: [0, -10, 0],
        scale: [1, 1.1, 1]
      } : {}}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10,
        duration: 0.6
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
