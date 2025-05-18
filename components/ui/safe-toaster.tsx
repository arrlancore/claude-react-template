"use client"

import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function SafeToaster() {
  const { toasts } = useToast()
  const [isMounted, setIsMounted] = React.useState(false)

  // Only render on client
  React.useEffect(() => {
    setIsMounted(true)

    // Cleanup function
    return () => {
      setIsMounted(false)
    }
  }, [])

  // Safeguard against rendering during SSR or during page transitions
  if (!isMounted) {
    return null
  }

  return (
    <ToastProvider key="safe-toast-provider">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
