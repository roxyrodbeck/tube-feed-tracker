"use client"

import { useState, useEffect } from "react"
import { InfoTooltip } from "@/components/info-tooltip"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSessionTracking } from "@/hooks/use-session-tracking"
import { logger } from "@/lib/logger"
import { FlaskConical, CalculatorIcon } from "lucide-react"

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

interface CalculatorProps {
  onCalculationChange?: (data: {
    milliliters: number | null
    hours: number | null
    milPerHour: number | null
    isCalculated: boolean
  }) => void
  selectedFormula?: Formula | null
  onFormulaSelect?: (formula: Formula | null) => void
}

export function Calculator({ onCalculationChange, selectedFormula, onFormulaSelect }: CalculatorProps) {
  const [milliliters, setMilliliters] = useState("")
  const [hours, setHours] = useState("")
  const [milPerHour, setMilPerHour] = useState("")
  const [outputField, setOutputField] = useState<string | null>(null)
  const [calculationStartTime, setCalculationStartTime] = useState<number | null>(null)
  const [totalCalories, setTotalCalories] = useState<number | null>(null)
  const [dailyCalories, setDailyCalories] = useState<number | null>(null)

  const sessionId = useSessionTracking()

  useEffect(() => {
    // Start timing when user begins entering data
    if ((milliliters || hours || milPerHour) && !calculationStartTime) {
      setCalculationStartTime(Date.now())
    }
  }, [milliliters, hours, milPerHour, calculationStartTime])

  const logCalculation = (calculationType: string, inputs: any, outputs: any) => {
    if (!sessionId) return

    const duration = calculationStartTime ? (Date.now() - calculationStartTime) / 1000 : undefined

    logger.logCalculation({
      sessionId,
      calculationType,
      inputs,
      outputs,
      selectedFormula: selectedFormula
        ? {
            name: selectedFormula.name,
            brand: selectedFormula.brand,
            caloriesPerMl: selectedFormula.caloriesPerMl,
            totalCalories,
          }
        : undefined,
      duration,
    })
  }

  const notifyCalculationChange = (mil: string, hr: string, rate: string, output: string | null) => {
    if (onCalculationChange) {
      const milValue = mil ? Number.parseFloat(mil) : null
      const hourValue = hr ? Number.parseFloat(hr) : null
      const rateValue = rate ? Number.parseFloat(rate) : null

      onCalculationChange({
        milliliters: milValue,
        hours: hourValue,
        milPerHour: rateValue,
        isCalculated: output !== null,
      })
    }
  }

  const calculateCalories = (finalMilliliters: number, finalHours?: number) => {
    if (selectedFormula) {
      const calories = finalMilliliters * selectedFormula.caloriesPerMl
      setTotalCalories(calories)

      // Calculate daily calories
      if (finalHours) {
        const dailyCals = (calories / finalHours) * 24
        setDailyCalories(dailyCals)
      } else {
        // If we have rate, calculate daily calories
        const rate = Number.parseFloat(milPerHour)
        if (rate > 0) {
          const dailyVolume = rate * 24
          const dailyCals = dailyVolume * selectedFormula.caloriesPerMl
          setDailyCalories(dailyCals)
        }
      }
    }
  }

  const reset = () => {
    setMilliliters("")
    setHours("")
    setMilPerHour("")
    setOutputField(null)
    setCalculationStartTime(null)
    setTotalCalories(null)
    setDailyCalories(null)
    notifyCalculationChange("", "", "", null)

    // Reset the selected formula
    if (onFormulaSelect) {
      onFormulaSelect(null)
    }
  }

  const calculate = () => {
    const mil = Number.parseFloat(milliliters)
    const hour = Number.parseFloat(hours)
    const rate = Number.parseFloat(milPerHour)

    let calculationType = ""
    const inputs = { milliliters: mil || undefined, hours: hour || undefined, milPerHour: rate || undefined }
    let outputs = {}
    let finalMilliliters = 0
    let finalHours = 0

    if (mil > 0 && hour > 0) {
      const result = mil / hour
      setMilPerHour(`${result.toFixed(2)} mL/hour`)
      setOutputField("milPerHour")
      calculationType = "feed_rate"
      outputs = { milPerHour: result }
      finalMilliliters = mil
      finalHours = hour
    } else if (mil > 0 && rate > 0) {
      const result = mil / rate
      setHours(`${result.toFixed(2)} hours`)
      setOutputField("hours")
      calculationType = "total_hours"
      outputs = { hours: result }
      finalMilliliters = mil
      finalHours = result
    } else if (hour > 0 && rate > 0) {
      const result = rate * hour
      setMilliliters(`${result.toFixed(2)} mL`)
      setOutputField("milliliters")
      calculationType = "total_volume"
      outputs = { milliliters: result }
      finalMilliliters = result
      finalHours = hour
    } else {
      alert("Please enter valid numbers for at least two fields.")
      return
    }

    // Calculate calories if formula is selected
    calculateCalories(finalMilliliters, finalHours)

    // Notify parent and log calculation
    notifyCalculationChange(milliliters, hours, milPerHour, outputField)
    logCalculation(calculationType, inputs, outputs)
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {selectedFormula && (
        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-900 dark:text-green-100 flex items-center text-sm">
              <FlaskConical className="h-4 w-4 mr-2" />
              Formula Selected: {selectedFormula.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-green-800 dark:text-green-200">
              {selectedFormula.brand} • {selectedFormula.caloriesPerMl} cal/mL
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <label htmlFor="milliliters" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Total milliliters:
            </label>
            <InfoTooltip content="Input the total milliliters required of this feed. Leave it blank if this is the information you are solving for." />
          </div>
          <input
            id="milliliters"
            type="text"
            value={milliliters}
            onChange={(e) => {
              setMilliliters(e.target.value)
              notifyCalculationChange(e.target.value, hours, milPerHour, outputField)
            }}
            placeholder="How many mL total?"
            className={`w-full px-4 py-2 rounded-md border ${
              outputField === "milliliters"
                ? "border-gray-400 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <label htmlFor="hours" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Total hours:
            </label>
            <InfoTooltip content="Input the total hours the feed should run. Convert minutes into a decimal by dividing total minutes by 60. EX: 45/60=0.75hour. Leave it blank if this is the information you are solving for." />
          </div>
          <input
            id="hours"
            type="text"
            value={hours}
            onChange={(e) => {
              setHours(e.target.value)
              notifyCalculationChange(milliliters, e.target.value, milPerHour, outputField)
            }}
            placeholder="Over how many hours?"
            className={`w-full px-4 py-2 rounded-md border ${
              outputField === "hours"
                ? "border-gray-400 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <label htmlFor="milperhour" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Feed rate:
            </label>
            <InfoTooltip content="Simply input the milliliters. The one hour is already configured. Leave it blank if this is the information you are solving for." />
          </div>
          <input
            id="milperhour"
            type="text"
            value={milPerHour}
            onChange={(e) => {
              setMilPerHour(e.target.value)
              notifyCalculationChange(milliliters, hours, e.target.value, outputField)
            }}
            placeholder="mL per one hour"
            className={`w-full px-4 py-2 rounded-md border ${
              outputField === "milPerHour"
                ? "border-gray-400 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={calculate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
          Calculate
        </Button>
        <Button onClick={reset} variant="outline" className="flex-1 bg-transparent">
          Reset
        </Button>
      </div>

      {selectedFormula && (totalCalories || dailyCalories) && (
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center text-sm">
              <CalculatorIcon className="h-4 w-4 mr-2" />
              Nutritional Calculations
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {totalCalories && (
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Total Calories:</span> {totalCalories.toFixed(0)} cal
              </div>
            )}
            {dailyCalories && (
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Daily Calories:</span> {dailyCalories.toFixed(0)} cal/day
              </div>
            )}
            {selectedFormula && totalCalories && (
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Total Protein:</span>{" "}
                {((totalCalories / selectedFormula.caloriesPerMl) * selectedFormula.proteinPerMl).toFixed(1)}g
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
