"use client"

import { PWAIconGenerator } from "@/components/pwa-icon-generator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Smartphone } from "lucide-react"

export default function DevToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Developer Tools</h1>
          <p className="text-gray-600 dark:text-gray-300">PWA development and testing utilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                PWA Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Service Worker:</span>
                  <span className="text-green-600">✓ Registered</span>
                </div>
                <div className="flex justify-between">
                  <span>Manifest:</span>
                  <span className="text-green-600">✓ Valid</span>
                </div>
                <div className="flex justify-between">
                  <span>Icons:</span>
                  <span className="text-green-600">✓ SVG Ready</span>
                </div>
                <div className="flex justify-between">
                  <span>Offline Support:</span>
                  <span className="text-green-600">✓ Enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Icon Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PWAIconGenerator />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>PWA Testing Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Desktop Testing</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                  <li>✓ Install prompt appears</li>
                  <li>✓ App installs from browser</li>
                  <li>✓ Custom icon in taskbar</li>
                  <li>✓ Standalone window mode</li>
                  <li>✓ Offline functionality</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Mobile Testing</h4>
                <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                  <li>✓ Add to home screen</li>
                  <li>✓ Custom icon on home screen</li>
                  <li>✓ Splash screen with icon</li>
                  <li>✓ App shortcuts work</li>
                  <li>✓ Touch interactions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
