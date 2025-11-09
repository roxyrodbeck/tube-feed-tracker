"use client"

export interface CalculationLog {
  id: string
  timestamp: string
  sessionId: string
  userId?: string
  calculationType: "feed_rate" | "total_volume" | "total_hours"
  inputs: {
    milliliters?: number
    hours?: number
    milPerHour?: number
  }
  outputs: {
    milliliters?: number
    hours?: number
    milPerHour?: number
  }
  selectedFormula?: {
    name: string
    brand: string
    caloriesPerMl: number
    totalCalories?: number
  }
  duration?: number
}

export interface FormulaSearchLog {
  id: string
  timestamp: string
  sessionId: string
  userId?: string
  searchQuery: string
  resultsCount: number
  selectedFormula?: string
  searchDuration?: number
}

export interface SessionLog {
  sessionId: string
  userId?: string
  startTime: string
  endTime?: string
  totalCalculations: number
  totalSearches: number
  uniqueFormulasUsed: string[]
}

class ClientLogger {
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private saveToLocalStorage(key: string, data: any) {
    try {
      const existing = localStorage.getItem(key)
      const logs = existing ? JSON.parse(existing) : []
      logs.push({
        ...data,
        id: data.id || this.generateId(),
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem(key, JSON.stringify(logs))
      return data
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      return data
    }
  }

  logCalculation(data: Omit<CalculationLog, "id" | "timestamp">): CalculationLog {
    const logEntry = this.saveToLocalStorage("tube-feed-calculations", data)
    console.log("Calculation logged:", logEntry)
    return logEntry
  }

  logFormulaSearch(data: Omit<FormulaSearchLog, "id" | "timestamp">): FormulaSearchLog {
    const logEntry = this.saveToLocalStorage("tube-feed-searches", data)
    console.log("Search logged:", logEntry)
    return logEntry
  }

  logSession(data: Omit<SessionLog, "startTime">): SessionLog {
    const sessionData = {
      ...data,
      startTime: new Date().toISOString(),
    }
    const logEntry = this.saveToLocalStorage("tube-feed-sessions", sessionData)
    console.log("Session logged:", logEntry)
    return logEntry
  }

  getCalculationStats(days = 7) {
    try {
      const calculations = JSON.parse(localStorage.getItem("tube-feed-calculations") || "[]")
      const searches = JSON.parse(localStorage.getItem("tube-feed-searches") || "[]")

      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

      const recentCalculations = calculations.filter((calc: CalculationLog) => new Date(calc.timestamp) > cutoffDate)
      const recentSearches = searches.filter((search: FormulaSearchLog) => new Date(search.timestamp) > cutoffDate)

      const stats = {
        totalCalculations: recentCalculations.length,
        totalSearches: recentSearches.length,
        popularFormulas: {} as Record<string, number>,
        calculationTypes: {} as Record<string, number>,
        dailyUsage: {} as Record<string, number>,
      }

      recentCalculations.forEach((calc: CalculationLog) => {
        const date = calc.timestamp.split("T")[0]
        stats.dailyUsage[date] = (stats.dailyUsage[date] || 0) + 1
        stats.calculationTypes[calc.calculationType] = (stats.calculationTypes[calc.calculationType] || 0) + 1

        if (calc.selectedFormula) {
          stats.popularFormulas[calc.selectedFormula.name] = (stats.popularFormulas[calc.selectedFormula.name] || 0) + 1
        }
      })

      return stats
    } catch (error) {
      console.error("Error getting stats:", error)
      return {
        totalCalculations: 0,
        totalSearches: 0,
        popularFormulas: {},
        calculationTypes: {},
        dailyUsage: {},
      }
    }
  }
}

export const logger = new ClientLogger()
