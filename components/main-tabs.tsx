"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator } from "@/components/calculator"
import { FormulaTab } from "@/components/formula-tab"
import { LogTab } from "@/components/log-tab"
import { CalculatorIcon, FlaskConical, History } from "lucide-react"

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

interface MainTabsProps {
  sessionId?: string
}

export function MainTabs({ sessionId }: MainTabsProps) {
  const [calculationData, setCalculationData] = useState({
    milliliters: null as number | null,
    hours: null as number | null,
    milPerHour: null as number | null,
    isCalculated: false,
  })

  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null)

  const handleCalculationChange = (data: {
    milliliters: number | null
    hours: number | null
    milPerHour: number | null
    isCalculated: boolean
  }) => {
    setCalculationData(data)
  }

  const handleFormulaSelect = (formula: Formula | null) => {
    setSelectedFormula(formula)
  }

  return (
    <Tabs defaultValue="calculator" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="calculator" className="flex items-center gap-2">
          <CalculatorIcon className="h-4 w-4" />
          Calculator
          {selectedFormula && <span className="ml-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />}
        </TabsTrigger>
        <TabsTrigger value="formulas" className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4" />
          Formulas
          {calculationData.isCalculated && <span className="ml-1 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />}
        </TabsTrigger>
        <TabsTrigger value="log" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Log
        </TabsTrigger>
      </TabsList>

      <TabsContent value="calculator" className="mt-6">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tube Feed Rate Calculator</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Enter any two pieces of information and click "Calculate".
            </p>
          </div>
          <Calculator
            onCalculationChange={handleCalculationChange}
            selectedFormula={selectedFormula}
            onFormulaSelect={handleFormulaSelect}
          />
        </div>
      </TabsContent>

      <TabsContent value="formulas" className="mt-6">
        <FormulaTab
          calculationData={calculationData}
          sessionId={sessionId}
          onFormulaSelect={handleFormulaSelect}
          selectedFormula={selectedFormula}
        />
      </TabsContent>

      <TabsContent value="log" className="mt-6">
        <LogTab sessionId={sessionId} />
      </TabsContent>
    </Tabs>
  )
}
