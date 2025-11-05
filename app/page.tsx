"use client"

import { useState } from "react"
import { MainTabs } from "@/components/main-tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/user-menu"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { useSessionTracking } from "@/hooks/use-session-tracking"

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const sessionId = useSessionTracking()

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-cover bg-center p-4 ${
        isDarkMode ? "bg-[url(/images/tube-feed-dark.jpg)]" : "bg-[url(/images/tube-feed-light.jpg)]"
      }`}
    >
      <div className="w-full max-w-4xl">
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
          <div className="p-6">
            <div className="flex justify-end items-center mb-6">
              <div className="flex items-center gap-2">
                <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <UserMenu />
              </div>
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tube Feed Tracker</h1>
            </div>

            <MainTabs sessionId={sessionId} />

            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Copyright 2025, Roxana Rodriguez-Becker</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                <a
                  href="https://tubefeedtracker-about.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  About
                </a>{" "}
                this Web App
              </p>
            </div>
          </div>
        </div>
      </div>

      <PWAInstallPrompt />
    </div>
  )
}
