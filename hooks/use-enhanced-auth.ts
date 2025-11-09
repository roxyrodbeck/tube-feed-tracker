"use client"

import { useState, useEffect } from "react"
import { enhancedAuthManager } from "@/lib/auth-enhanced"

interface User {
  id: string
  email: string
  name: string
  createdAt: string
  lastLogin: string
  preferences?: {
    theme: "light" | "dark" | "system"
    defaultFormula?: string
    notifications: boolean
  }
}

interface AuthSession {
  user: User
  token: string
  expiresAt: string
}

export function useEnhancedAuth() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session state
    setSession(enhancedAuthManager.getSession())
    setLoading(false)

    // Subscribe to auth changes
    const unsubscribe = enhancedAuthManager.subscribe((newSession) => {
      setSession(newSession)
    })

    return unsubscribe
  }, [])

  return {
    session,
    user: session?.user || null,
    loading,
    isAuthenticated: !!session,
    login: enhancedAuthManager.login.bind(enhancedAuthManager),
    register: enhancedAuthManager.register.bind(enhancedAuthManager),
    logout: enhancedAuthManager.logout.bind(enhancedAuthManager),
    updateProfile: enhancedAuthManager.updateProfile.bind(enhancedAuthManager),
    changePassword: enhancedAuthManager.changePassword.bind(enhancedAuthManager),
    getUserStats: enhancedAuthManager.getUserStats.bind(enhancedAuthManager),
  }
}
