"use client"

interface User {
  id: string
  email: string
  name: string
}

class AuthManager {
  private user: User | null = null
  private listeners: Array<(user: User | null) => void> = []

  constructor() {
    // Load user from localStorage on initialization
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("tube-feed-user")
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser)
        } catch (error) {
          console.error("Error loading saved user:", error)
          localStorage.removeItem("tube-feed-user")
        }
      }
    }
  }

  getUser(): User | null {
    return this.user
  }

  setUser(user: User | null) {
    this.user = user
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("tube-feed-user", JSON.stringify(user))
      } else {
        localStorage.removeItem("tube-feed-user")
      }
    }
    this.notifyListeners()
  }

  subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.user))
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, action: "login" }),
      })

      const data = await response.json()

      if (data.success) {
        this.setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Network error occurred" }
    }
  }

  async register(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, action: "register" }),
      })

      const data = await response.json()

      if (data.success) {
        this.setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, error: "Network error occurred" }
    }
  }

  logout() {
    this.setUser(null)
  }
}

export const authManager = new AuthManager()
