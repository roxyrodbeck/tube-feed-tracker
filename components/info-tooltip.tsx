"use client"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface InfoTooltipProps {
  content: string
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="ml-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
            <InfoIcon className="h-4 w-4" />
            <span className="sr-only">More information</span>
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
