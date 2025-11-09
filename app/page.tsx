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
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 dark:opacity-40"
        style={{ backgroundImage: "url(/tube-feed-background.jpg)" }}
      />

      <div className="w-full max-w-4xl relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{ backgroundImage: "url(/tubes-header.png)" }}
            />
            <div className="relative bg-white/70 dark:bg-gray-800/70">
              <div className="p-6 pb-0">
                <div className="flex justify-end items-center mb-6">
                  <div className="flex items-center gap-2">
                    <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                    <UserMenu />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tube Feed Tracker</h1>
                </div>
              </div>

              <div className="px-6">
                <MainTabs sessionId={sessionId} />
              </div>
            </div>
          </div>

          <div className="p-6 pt-6">
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
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
