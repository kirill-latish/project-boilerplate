"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  orientation?: "horizontal" | "vertical"
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    return (
      <input
        type="range"
        className={cn(
          "touch-none select-none",
          orientation === "vertical" 
            ? "h-full w-1 cursor-pointer appearance-none bg-transparent [writing-mode:vertical-lr] [direction:rtl]"
            : "h-1 w-full cursor-pointer appearance-none rounded-full bg-gray-700",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm",
          "[&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
