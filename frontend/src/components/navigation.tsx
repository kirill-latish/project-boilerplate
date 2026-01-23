"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-gray-950 font-bold text-lg">N</span>
              </div>
              <span className="text-white font-semibold text-xl">nickel</span>
            </a>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <button className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors">
                Products
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors">
                Company
                <ChevronDown className="w-4 h-4" />
              </button>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                Pricing
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                For Accountants
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="default" className="text-white hover:text-white">
              Log in
            </Button>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              Get started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
