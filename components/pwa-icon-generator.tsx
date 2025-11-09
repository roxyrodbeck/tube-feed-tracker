"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ImageIcon } from "lucide-react"

export function PWAIconGenerator() {
  const [generating, setGenerating] = useState(false)

  const generatePNGIcon = async (size: number) => {
    return new Promise<string>((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = size
      canvas.height = size

      // Create a white background
      if (ctx) {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, size, size)

        // Load and draw the SVG
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size)
          resolve(canvas.toDataURL("image/png"))
        }
        img.src = "/favicon.svg"
      }
    })
  }

  const downloadIcon = async (size: number, filename: string) => {
    const dataUrl = await generatePNGIcon(size)
    const link = document.createElement("a")
    link.download = filename
    link.href = dataUrl
    link.click()
  }

  const generateAllIcons = async () => {
    setGenerating(true)
    try {
      await downloadIcon(192, "icon-192.png")
      await downloadIcon(512, "icon-512.png")
      await downloadIcon(180, "apple-touch-icon.png")

      // Generate maskable icons with padding
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      for (const size of [192, 512]) {
        canvas.width = size
        canvas.height = size

        if (ctx) {
          // White background
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, size, size)

          // Draw icon with padding for maskable
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            const padding = size * 0.1 // 10% padding
            const iconSize = size - padding * 2
            ctx.drawImage(img, padding, padding, iconSize, iconSize)

            const link = document.createElement("a")
            link.download = `icon-maskable-${size}.png`
            link.href = canvas.toDataURL("image/png")
            link.click()
          }
          img.src = "/favicon.svg"
        }
      }
    } catch (error) {
      console.error("Error generating icons:", error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          PWA Icon Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Generate PNG versions of your favicon for better PWA compatibility across all platforms.
        </p>

        <Button onClick={generateAllIcons} disabled={generating} className="w-full">
          {generating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              Generating Icons...
            </div>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate All PWA Icons
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>This will generate:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>icon-192.png (Android)</li>
            <li>icon-512.png (Android)</li>
            <li>apple-touch-icon.png (iOS)</li>
            <li>icon-maskable-192.png (Adaptive)</li>
            <li>icon-maskable-512.png (Adaptive)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
