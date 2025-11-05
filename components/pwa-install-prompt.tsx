"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X, Smartphone, Monitor } from "lucide-react"
import { trackPWAInstall } from "@/lib/analytics"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
        setIsInstalled(true)
      }
    }

    checkInstalled()

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay if not installed
      setTimeout(() => {
        if (!isInstalled) {
          setShowPrompt(true)
        }
      }, 5000) // Show after 5 seconds
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)

      // Track PWA installation
      trackPWAInstall()
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setShowPrompt(false)
      trackPWAInstall()
    }

    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true")
  }

  // Don't show if already installed or dismissed this session
  if (isInstalled || !showPrompt || sessionStorage.getItem("pwa-prompt-dismissed")) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Download className="h-4 w-4 text-blue-600" />
              Install App
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Install Tube Feed Tracker for quick access and offline use!
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Smartphone className="h-3 w-3" />
            <span>Works on mobile</span>
            <Monitor className="h-3 w-3 ml-2" />
            <span>& desktop</span>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleInstallClick} size="sm" className="flex-1">
              <Download className="h-3 w-3 mr-1" />
              Install
            </Button>
            <Button onClick={handleDismiss} variant="outline" size="sm">
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
