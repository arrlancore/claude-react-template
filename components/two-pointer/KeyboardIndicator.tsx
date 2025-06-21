import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard } from 'lucide-react'

interface KeyboardShortcut {
  key: string
  description: string
}

interface KeyboardIndicatorProps {
  shortcuts: KeyboardShortcut[]
}

export function KeyboardIndicator({ shortcuts }: KeyboardIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-xl border border-white/20 transition-all duration-300"
      >
        <Keyboard className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 bg-black/80 backdrop-blur-xl rounded-xl border border-white/20 p-4 min-w-64"
          >
            <h3 className="text-white font-semibold mb-3 text-sm">Keyboard Shortcuts</h3>
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={shortcut.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-300">{shortcut.description}</span>
                  <kbd className="bg-white/20 text-white px-2 py-1 rounded text-xs font-mono">
                    {shortcut.key === 'Space' ? '␣' :
                     shortcut.key === 'ArrowLeft' ? '←' :
                     shortcut.key === 'ArrowRight' ? '→' :
                     shortcut.key}
                  </kbd>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
