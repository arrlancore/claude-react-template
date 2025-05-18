"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000 // 5 seconds

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  // Safety check to ensure we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        // Clear all timeouts if we're removing all toasts
        toastTimeouts.forEach((timeout, id) => {
          clearTimeout(timeout);
          toastTimeouts.delete(id);
        });

        return {
          ...state,
          toasts: [],
        }
      }

      // Clear the specific timeout
      if (action.toastId && toastTimeouts.has(action.toastId)) {
        clearTimeout(toastTimeouts.get(action.toastId));
        toastTimeouts.delete(action.toastId);
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)

    // Handle page transitions and browser navigation
    const handleBeforeUnload = () => {
      // Clear all timeouts when page is about to unload
      toastTimeouts.forEach((timeout) => {
        clearTimeout(timeout)
      })
      toastTimeouts.clear()
    }

    // Handle visibility change (user tabs away/returns)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Dismiss all toasts when page is hidden
        dispatch({ type: "DISMISS_TOAST" })
      }
    }

    // Handle router changes in Next.js
    const handleRouteChange = () => {
      // Dismiss all toasts on route change
      dispatch({ type: "DISMISS_TOAST" })
    }

    // Only add listeners in browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      // Handle browser back/forward buttons
      window.addEventListener('popstate', handleRouteChange)

      // Try to detect Next.js router events if available
      if (typeof window.history !== 'undefined') {
        const originalPushState = window.history.pushState
        window.history.pushState = function() {
          handleRouteChange()
          return originalPushState.apply(window.history, arguments as any)
        }
      }
    }

    // Cleanup function to remove event listener and clear timeouts
    return () => {
      // Remove the state setter from listeners
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }

      // Remove event listeners
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('popstate', handleRouteChange)
      }
    }
  }, []) // Empty dependency array so this only runs on mount/unmount

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
