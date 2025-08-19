"use client"

import { useState, useEffect } from "react"
import { FormulaSearch } from "@/components/formula-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, Info } from "lucide-react"

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

interface FormulaTabProps {
  calculationData: {
    milliliters: number | null
    hours: number | null
    milPerHour: number | null
    isCalculated: boolean
  }
  sessionId?: string
  onFormulaSelect?: (formula: Formula) => void
  selectedFormula?: Formula | null
}

export function FormulaTab({ calculationData, sessionId, onFormulaSelect, selectedFormula }: FormulaTabProps) {
  const [totalCalories, setTotalCalories] = useState<number | null>(null)
  const [dailyCalories, setDailyCalories] = useState<number | null>(null)

  const handleFormulaSelect = (formula: Formula) => {
    if (onFormulaSelect) {
      onFormulaSelect(formula)
    }
  }

  // Calculate calories when formula or calculation data changes
  useEffect(() => {
    if (selectedFormula && calculationData.milliliters) {
      const calories = calculationData.milliliters * selectedFormula.caloriesPerMl
      setTotalCalories(calories)

      // Calculate daily calories if we have hours
      if (calculationData.hours) {
        const dailyCals = (calories / calculationData.hours) * 24
        setDailyCalories(dailyCals)
      } else if (calculationData.milPerHour) {
        // If we have rate, calculate daily calories
        const dailyVolume = calculationData.milPerHour * 24
        const dailyCals = dailyVolume * selectedFormula.caloriesPerMl
        setDailyCalories(dailyCals)
      }
    } else {
      setTotalCalories(null)
      setDailyCalories(null)
    }
  }, [selectedFormula, calculationData])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Enteral Formula Selection</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Search and select an enteral formula to calculate nutritional intake. Selected formulas will appear in the
          Calculator tab.
        </p>

        <FormulaSearch onFormulaSelect={handleFormulaSelect} sessionId={sessionId} />
      </div>

      {selectedFormula && (
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Selected Formula: {selectedFormula.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Formula Details</h4>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <div>Brand: {selectedFormula.brand}</div>
                  <div>Calories: {selectedFormula.caloriesPerMl} cal/mL</div>
                  <div>Protein: {(selectedFormula.proteinPerMl * 1000).toFixed(1)}g/L</div>
                  {selectedFormula.osmolality && <div>Osmolality: {selectedFormula.osmolality} mOsm/kg</div>}
                  {selectedFormula.fiberContent && <div>Fiber: {selectedFormula.fiberContent}</div>}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Nutritional Calculations</h4>
                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  {calculationData.milliliters && <div>Volume: {calculationData.milliliters.toFixed(0)} mL</div>}
                  {totalCalories && <div className="font-semibold">Total Calories: {totalCalories.toFixed(0)} cal</div>}
                  {dailyCalories && (
                    <div className="font-semibold">Daily Calories: {dailyCalories.toFixed(0)} cal/day</div>
                  )}
                  {calculationData.milliliters && selectedFormula && (
                    <div>Total Protein: {(calculationData.milliliters * selectedFormula.proteinPerMl).toFixed(1)}g</div>
                  )}
                </div>
              </div>
            </div>

            {!calculationData.isCalculated && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Complete your tube feeding calculations to see accurate caloric and protein intake values.
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">{selectedFormula.description}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
