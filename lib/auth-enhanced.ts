"use client"

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

class EnhancedAuthManager {
  private session: AuthSession | null = null
  private listeners: Array<(session: AuthSession | null) => void> = []
  private readonly SESSION_KEY = "tube-feed-auth-session"
  private readonly USERS_KEY = "tube-feed-users"

  constructor() {
    if (typeof window !== "undefined") {
      this.loadSession()
      this.setupSessionExpiry()
    }
  }

  private loadSession() {
    try {
      const savedSession = localStorage.getItem(this.SESSION_KEY)
      if (savedSession) {
        const session = JSON.parse(savedSession)

        // Check if session is expired
        if (new Date(session.expiresAt) > new Date()) {
          this.session = session
        } else {
          this.clearSession()
        }
      }
    } catch (error) {
      console.error("Error loading session:", error)
      this.clearSession()
    }
  }

  private saveSession(session: AuthSession) {
    this.session = session
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
    this.notifyListeners()
  }

  private clearSession() {
    this.session = null
    localStorage.removeItem(this.SESSION_KEY)
    this.notifyListeners()
  }

  private setupSessionExpiry() {
    // Check session expiry every minute
    setInterval(() => {
      if (this.session && new Date(this.session.expiresAt) <= new Date()) {
        this.clearSession()
      }
    }, 60000)
  }

  private generateToken(): string {
    return btoa(Date.now() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, "")
  }

  private hashPassword(password: string): string {
    // Simple hash for demo - use bcrypt in production
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return hash.toString()
  }

  private getUsers(): User[] {
    try {
      const users = localStorage.getItem(this.USERS_KEY)
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  getSession(): AuthSession | null {
    return this.session
  }

  getUser(): User | null {
    return this.session?.user || null
  }

  subscribe(listener: (session: AuthSession | null) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.session))
  }

  async register(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      const users = this.getUsers()

      // Check if user exists
      if (users.find((u) => u.email === email.toLowerCase())) {
        return { success: false, error: "User already exists with this email" }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: "system",
          notifications: true,
        },
      }

      // Save user with hashed password
      const userWithPassword = {
        ...newUser,
        password: this.hashPassword(password),
      }

      users.push(userWithPassword)
      this.saveUsers(users)

      // Create session
      const session: AuthSession = {
        user: newUser,
        token: this.generateToken(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }

      this.saveSession(session)
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: "Registration failed" }
    }
  }

  async login(email: string, password: string, rememberMe = true): Promise<{ success: boolean; error?: string }> {
    try {
      const users = this.getUsers()
      const userWithPassword = users.find((u) => u.email === email.toLowerCase())

      if (!userWithPassword) {
        return { success: false, error: "No account found with this email" }
      }

      if (this.hashPassword(password) !== (userWithPassword as any).password) {
        return { success: false, error: "Invalid password" }
      }

      // Update last login
      const updatedUser: User = {
        ...userWithPassword,
        lastLogin: new Date().toISOString(),
      }

      // Update user in storage
      const updatedUsers = users.map((u) =>
        u.email === email.toLowerCase() ? { ...u, lastLogin: updatedUser.lastLogin } : u,
      )
      this.saveUsers(updatedUsers)

      // Create session
      const expiryTime = rememberMe
        ? 7 * 24 * 60 * 60 * 1000 // 7 days
        : 24 * 60 * 60 * 1000 // 1 day

      const session: AuthSession = {
        user: updatedUser,
        token: this.generateToken(),
        expiresAt: new Date(Date.now() + expiryTime).toISOString(),
      }

      this.saveSession(session)
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Login failed" }
    }
  }

  logout() {
    this.clearSession()
  }

  async updateProfile(
    updates: Partial<Pick<User, "name" | "preferences">>,
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.session) {
      return { success: false, error: "Not authenticated" }
    }

    try {
      const users = this.getUsers()
      const updatedUser = { ...this.session.user, ...updates }

      // Update user in storage
      const updatedUsers = users.map((u) => (u.id === this.session!.user.id ? { ...u, ...updates } : u))
      this.saveUsers(updatedUsers)

      // Update session
      this.saveSession({
        ...this.session,
        user: updatedUser,
      })

      return { success: true }
    } catch (error) {
      console.error("Profile update error:", error)
      return { success: false, error: "Failed to update profile" }
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!this.session) {
      return { success: false, error: "Not authenticated" }
    }

    try {
      const users = this.getUsers()
      const userWithPassword = users.find((u) => u.id === this.session!.user.id) as any

      if (!userWithPassword) {
        return { success: false, error: "User not found" }
      }

      if (this.hashPassword(currentPassword) !== userWithPassword.password) {
        return { success: false, error: "Current password is incorrect" }
      }

      // Update password
      const updatedUsers = users.map((u) =>
        u.id === this.session!.user.id ? { ...u, password: this.hashPassword(newPassword) } : u,
      )
      this.saveUsers(updatedUsers)

      return { success: true }
    } catch (error) {
      console.error("Password change error:", error)
      return { success: false, error: "Failed to change password" }
    }
  }

  // Get user statistics
  getUserStats() {
    if (!this.session) return null

    const calculations = JSON.parse(localStorage.getItem("tube-feed-calculations") || "[]")
    const userCalculations = calculations.filter((calc: any) => calc.userId === this.session!.user.id)

    return {
      totalCalculations: userCalculations.length,
      joinDate: this.session.user.createdAt,
      lastLogin: this.session.user.lastLogin,
      sessionExpiry: this.session.expiresAt,
    }
  }
}

export const enhancedAuthManager = new EnhancedAuthManager()
