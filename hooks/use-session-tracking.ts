"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/hooks/use-auth"
import { logger } from "@/lib/logger"

export function useSessionTracking() {
  const { user } = useAuth()
  const sessionId = useRef<string>()

  useEffect(() => {
    // Generate session ID
    sessionId.current = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Log session start
    logger.logSession({
      sessionId: sessionId.current,
      userId: user?.id,
      totalCalculations: 0,
      totalSearches: 0,
      uniqueFormulasUsed: [],
    })

    // Log session end on page unload
    const handleBeforeUnload = () => {
      if (sessionId.current) {
        console.log("Session ended:", sessionId.current)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      handleBeforeUnload()
    }
  }, [user?.id])

  return sessionId.current
}
