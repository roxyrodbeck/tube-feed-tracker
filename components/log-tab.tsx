"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { History, Calculator, Trash2, Download, Clock, FlaskConical, TrendingUp, Calendar } from "lucide-react"
import type { CalculationLog } from "@/lib/logger"

interface LogTabProps {
  sessionId?: string
}

export function LogTab({ sessionId }: LogTabProps) {
  const [calculationLogs, setCalculationLogs] = useState<CalculationLog[]>([])
  const [loading, setLoading] = useState(true)

  const loadLogs = () => {
    setLoading(true)
    try {
      const calculations = JSON.parse(localStorage.getItem("tube-feed-calculations") || "[]")

      // Sort by timestamp (newest first)
      setCalculationLogs(
        calculations.sort(
          (a: CalculationLog, b: CalculationLog) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        ),
      )
    } catch (error) {
      console.error("Error loading logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearAllLogs = () => {
    if (confirm("Are you sure you want to clear all calculation logs? This action cannot be undone.")) {
      localStorage.removeItem("tube-feed-calculations")
      setCalculationLogs([])
    }
  }

  const exportLogs = () => {
    const data = {
      calculations: calculationLogs,
      exportDate: new Date().toISOString(),
      totalCalculations: calculationLogs.length,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tube-feed-calculations-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getCalculationTypeLabel = (type: string) => {
    switch (type) {
      case "feed_rate":
        return "Feed Rate"
      case "total_volume":
        return "Total Volume"
      case "total_hours":
        return "Total Hours"
      default:
        return type
    }
  }

  useEffect(() => {
    loadLogs()

    // Refresh logs every 5 seconds to catch new entries
    const interval = setInterval(loadLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Calculation History</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">History of tube feeding calculations and results</p>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">Total: {calculationLogs.length} calculations</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={loadLogs} variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={exportLogs} variant="outline" size="sm" disabled={calculationLogs.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button onClick={clearAllLogs} variant="outline" size="sm" disabled={calculationLogs.length === 0}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {calculationLogs.length === 0 ? (
        <Alert>
          <History className="h-4 w-4" />
          <AlertDescription>
            No calculations logged yet. Start using the calculator to see your calculation history here.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {calculationLogs.map((log) => (
            <Card key={log.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-sm">{getCalculationTypeLabel(log.calculationType)}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Calculation
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(log.timestamp)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Inputs:</span>
                      <div className="text-gray-600 dark:text-gray-400">
                        {log.inputs.milliliters && `${log.inputs.milliliters} mL`}
                        {log.inputs.hours && ` • ${log.inputs.hours} hrs`}
                        {log.inputs.milPerHour && ` • ${log.inputs.milPerHour} mL/hr`}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Result:</span>
                      <div className="text-gray-600 dark:text-gray-400">
                        {log.outputs.milliliters && `${log.outputs.milliliters?.toFixed(2)} mL`}
                        {log.outputs.hours && `${log.outputs.hours?.toFixed(2)} hrs`}
                        {log.outputs.milPerHour && `${log.outputs.milPerHour?.toFixed(2)} mL/hr`}
                      </div>
                    </div>
                  </div>

                  {log.selectedFormula && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FlaskConical className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900 dark:text-green-100">
                          {log.selectedFormula.name}
                        </span>
                      </div>
                      <div className="text-xs text-green-800 dark:text-green-200 space-y-1">
                        <div>Brand: {log.selectedFormula.brand}</div>
                        <div>Calories: {log.selectedFormula.caloriesPerMl} cal/mL</div>
                        {log.selectedFormula.totalCalories && (
                          <div className="font-medium">
                            Total Calories: {log.selectedFormula.totalCalories.toFixed(0)} cal
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {log.duration && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Completed in {log.duration.toFixed(1)}s
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Data Storage Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All calculation logs are stored locally in your browser. Data persists between sessions but will be lost
              if you clear your browser storage. Use the Export button to save your calculations externally.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
