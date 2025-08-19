"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface ThemeToggleProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export function ThemeToggle({ isDarkMode, toggleDarkMode }: ThemeToggleProps) {
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full" aria-label="Toggle theme">
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
