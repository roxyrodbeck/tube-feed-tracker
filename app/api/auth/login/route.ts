import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory user store (in production, use a database)
const users: Array<{
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}> = []

// Simple hash function for demo purposes
function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, action } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (action === "register") {
      // Check if user already exists
      const existingUser = users.find((user) => user.email === email.toLowerCase())
      if (existingUser) {
        return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
      }

      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
      }

      // Create new user
      const hashedPassword = simpleHash(password)
      const newUser = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || email.split("@")[0],
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)

      return NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      })
    } else {
      // Login
      const user = users.find((user) => user.email === email.toLowerCase())
      if (!user) {
        return NextResponse.json({ error: "No account found with this email" }, { status: 400 })
      }

      const hashedPassword = simpleHash(password)
      if (hashedPassword !== user.password) {
        return NextResponse.json({ error: "Invalid password" }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      })
    }
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
