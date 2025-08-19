"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw, Home } from "lucide-react"
import { CustomIcon } from "@/components/custom-icon"
import Link from "next/link"

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl text-center">
          <CardHeader className="pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <CustomIcon className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              <WifiOff className="h-6 w-6" />
              You're Offline
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              No internet connection detected. Some features may be limited, but you can still use the calculator with
              previously loaded data.
            </p>

            <div className="space-y-2">
              <Button onClick={handleRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Calculator
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tube Feed Tracker works offline with cached data. Connect to the internet to sync your latest
                calculations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
