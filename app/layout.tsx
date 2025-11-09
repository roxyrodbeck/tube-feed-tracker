import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tube Feed Tracker",
  description: "Enterprise-grade tracker for tube feed rates with user authentication",
  keywords: ["tube feeding", "enteral nutrition", "medical calculator", "healthcare", "nutrition tracking"],
  authors: [{ name: "Roxana Rodriguez-Becker" }],
  creator: "Roxana Rodriguez-Becker",
  publisher: "Tube Feed Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tubefeedtracker.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tube Feed Tracker",
    description: "Enterprise-grade tracker for tube feed rates with user authentication",
    url: "https://tubefeedtracker.app",
    siteName: "Tube Feed Tracker",
    images: [
      {
        url: "/apple-touch-icon.png",
        width: 512,
        height: 512,
        alt: "Tube Feed Tracker - Medical feeding bag icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tube Feed Tracker",
    description: "Enterprise-grade tracker for tube feed rates with user authentication",
    images: ["/apple-touch-icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/apple-touch-icon.png", type: "image/png" },
      { url: "/icon", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/apple-touch-icon.png",
        color: "#3b82f6",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tube Feed Tracker",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/icon" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <link rel="mask-icon" href="/apple-touch-icon.png" color="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-TileImage" content="/icon" />
        <meta name="application-name" content="Tube Feed Tracker" />
        <meta name="apple-mobile-web-app-title" content="TF Tracker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>

      </body>
    </html>
  )
}
