import { useEffect, useCallback } from 'react'

interface KeyboardShortcut {
  key: string
  callback: () => void
  description: string
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

export function useKeyboardShortcuts({
  shortcuts,
  enabled = true
}: UseKeyboardShortcutsProps) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    // Don't trigger if user is typing in input fields
    if (event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement) {
      return
    }

    const shortcut = shortcuts.find(s => {
      if (s.key === 'Space') {
        return event.code === 'Space' || event.key === ' '
      }
      return event.key === s.key || event.code === s.key
    })

    if (shortcut) {
      event.preventDefault()
      shortcut.callback()
    }
  }, [shortcuts, enabled])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return { shortcuts }
}
