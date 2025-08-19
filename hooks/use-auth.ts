"use client"

import { useState, useEffect } from "react"
import { authManager } from "@/lib/auth"

interface User {
  id: string
  email: string
  name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user state
    setUser(authManager.getUser())
    setLoading(false)

    // Subscribe to auth changes
    const unsubscribe = authManager.subscribe((newUser) => {
      setUser(newUser)
    })

    return unsubscribe
  }, [])

  return {
    user,
    loading,
    login: authManager.login.bind(authManager),
    register: authManager.register.bind(authManager),
    logout: authManager.logout.bind(authManager),
  }
}
