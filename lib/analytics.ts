"use client"

// Google Analytics helper functions
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
      page_path: url,
    })
  }
}

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track medical calculations
export const trackCalculation = (calculationType: string, hasFormula: boolean) => {
  trackEvent("calculation_completed", "medical_calculator", calculationType, hasFormula ? 1 : 0)
}

// Track formula searches
export const trackFormulaSearch = (query: string, resultsCount: number) => {
  trackEvent("formula_search", "ai_search", query, resultsCount)
}

// Track PWA installation
export const trackPWAInstall = () => {
  trackEvent("pwa_install", "engagement", "app_installed")
}

// Track authentication events
export const trackAuth = (action: "login" | "register" | "logout") => {
  trackEvent(action, "authentication", action)
}
