"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, Users, Search } from "lucide-react"
import { logger } from "@/lib/logger"

interface AnalyticsData {
  totalCalculations: number
  totalSearches: number
  popularFormulas: Record<string, number>
  calculationTypes: Record<string, number>
  dailyUsage: Record<string, number>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)

  const fetchAnalytics = () => {
    setLoading(true)
    try {
      const data = logger.getCalculationStats(days)
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Usage statistics for the Tube Feed Rate Calculator</p>
        </div>

        <div className="mb-6 flex gap-2">
          {[7, 30, 90].map((period) => (
            <Button key={period} variant={days === period ? "default" : "outline"} onClick={() => setDays(period)}>
              {period} days
            </Button>
          ))}
        </div>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Calculations</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalCalculations}</div>
                <p className="text-xs text-muted-foreground">Last {days} days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Formula Searches</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalSearches}</div>
                <p className="text-xs text-muted-foreground">AI-powered searches</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(analytics.totalCalculations / days)}</div>
                <p className="text-xs text-muted-foreground">Calculations per day</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Days</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(analytics.dailyUsage).length}</div>
                <p className="text-xs text-muted-foreground">Days with activity</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analytics && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Popular Formulas</CardTitle>
                  <CardDescription>Most frequently selected enteral formulas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.popularFormulas)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([formula, count]) => (
                        <div key={formula} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{formula}</span>
                          <span className="text-sm text-gray-500">{count} uses</span>
                        </div>
                      ))}
                    {Object.keys(analytics.popularFormulas).length === 0 && (
                      <p className="text-sm text-gray-500">
                        No formula data yet. Start using formulas to see statistics.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calculation Types</CardTitle>
                  <CardDescription>Distribution of calculation types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.calculationTypes).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{type.replace("_", " ")}</span>
                        <span className="text-sm text-gray-500">{count}</span>
                      </div>
                    ))}
                    {Object.keys(analytics.calculationTypes).length === 0 && (
                      <p className="text-sm text-gray-500">
                        No calculation data yet. Perform calculations to see statistics.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Data Storage</CardTitle>
              <CardDescription>All data is stored locally in your browser</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your usage data is stored locally in your browser's localStorage. No data is sent to external servers.
                You can clear this data by clearing your browser's storage or using the developer tools.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
