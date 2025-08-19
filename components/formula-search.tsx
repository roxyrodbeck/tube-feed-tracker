"use client"

import type React from "react"

import { useState } from "react"
import { Search, Loader2, Calculator, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { logger } from "@/lib/logger"

interface Formula {
  name: string
  brand: string
  caloriesPerMl: number
  proteinPerMl: number
  description: string
  indications: string[]
  osmolality?: number
  fiberContent?: string
  specialFeatures?: string[]
}

interface FormulaSearchProps {
  onFormulaSelect: (formula: Formula) => void
  sessionId?: string
}

export function FormulaSearch({ onFormulaSelect, sessionId }: FormulaSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Formula[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null)

  const logSearch = (searchQuery: string, resultsCount: number, selectedFormula?: string, duration?: number) => {
    if (!sessionId) return

    logger.logFormulaSearch({
      sessionId,
      searchQuery,
      resultsCount,
      selectedFormula,
      searchDuration: duration,
    })
  }

  const searchFormulas = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setSearchStartTime(Date.now())

    try {
      const response = await fetch("/api/search-formulas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error("Failed to search formulas")
      }

      const data = await response.json()
      const formulas = data.formulas || []
      setResults(formulas)
      setHasSearched(true)

      // Log the search
      const duration = searchStartTime ? (Date.now() - searchStartTime) / 1000 : undefined
      logSearch(query, formulas.length, undefined, duration)
    } catch (error) {
      console.error("Error searching formulas:", error)
      setResults([])
      logSearch(query, 0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormulaSelect = (formula: Formula) => {
    onFormulaSelect(formula)

    // Log formula selection
    logSearch(query, results.length, formula.name)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchFormulas()
    }
  }

  const popularSearches = [
    "Kate Farms",
    "plant-based",
    "diabetes",
    "high calorie",
    "fiber-free",
    "elemental",
    "COPD",
    "kidney disease",
  ]

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Search for enteral nutrition formulas designed specifically for tube feeding. Try brands like Kate Farms,
          Abbott, or conditions like diabetes, COPD.
        </AlertDescription>
      </Alert>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search enteral formulas (e.g., 'Kate Farms', 'diabetes', 'high calorie')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={searchFormulas} disabled={isLoading || !query.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {!hasSearched && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search) => (
              <Button
                key={search}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(search)
                  setTimeout(() => searchFormulas(), 100)
                }}
                className="text-xs"
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}

      {hasSearched && results.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <p>No enteral formulas found for "{query}".</p>
          <p className="text-sm mt-2">
            Try searching for brands like "Kate Farms", "Abbott", or conditions like "diabetes", "COPD".
          </p>
        </div>
      )}

      <div className="space-y-3">
        {results.map((formula, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{formula.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{formula.brand}</p>
                </div>
                <Button size="sm" onClick={() => handleFormulaSelect(formula)} className="ml-2">
                  <Calculator className="h-4 w-4 mr-1" />
                  Use Formula
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">{formula.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Calories:</span> {formula.caloriesPerMl} cal/mL
                </div>
                <div>
                  <span className="font-medium">Protein:</span> {(formula.proteinPerMl * 1000).toFixed(1)}g/L
                </div>
                {formula.osmolality && (
                  <div>
                    <span className="font-medium">Osmolality:</span> {formula.osmolality} mOsm/kg
                  </div>
                )}
                {formula.fiberContent && (
                  <div>
                    <span className="font-medium">Fiber:</span> {formula.fiberContent}
                  </div>
                )}
              </div>

              <div>
                <span className="font-medium text-sm">Tube Feeding Indications:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formula.indications.map((indication, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {indication}
                    </Badge>
                  ))}
                </div>
              </div>

              {formula.specialFeatures && formula.specialFeatures.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Special Features:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formula.specialFeatures.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
