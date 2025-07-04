import { cn } from "@/lib/utils" 
import React from "react"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-4",
}

export function LoadingSpinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent border-solid border-gray-400",
        sizeMap[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}
