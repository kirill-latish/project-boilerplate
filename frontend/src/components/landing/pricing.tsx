"use client"

import { useEffect, useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Check } from "lucide-react"
import { getPricingPlans, type PricingPlan } from "@/lib/api"

type ButtonVariant = NonNullable<ButtonProps["variant"]>

const allowedVariants: ButtonVariant[] = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "link",
]

const resolveVariant = (value?: string | null): ButtonVariant => {
  if (value && allowedVariants.includes(value as ButtonVariant)) {
    return value as ButtonVariant
  }

  return "default"
}

const SkeletonCard = () => (
  <Card className="animate-pulse border-gray-800">
    <CardHeader className="space-y-4">
      <div className="h-6 w-24 rounded bg-gray-800" />
      <div className="h-4 w-40 rounded bg-gray-800" />
      <div className="space-y-2">
        <div className="h-10 w-24 rounded bg-gray-800" />
        <div className="h-4 w-16 rounded bg-gray-800" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-gray-800" />
            <div className="h-4 w-full rounded bg-gray-800" />
          </div>
        ))}
      </div>
      <div className="h-11 w-full rounded bg-gray-800" />
      <div className="h-3 w-40 rounded bg-gray-800 mx-auto" />
    </CardContent>
  </Card>
)

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadPlans = async () => {
      const result = await getPricingPlans()
      if (isMounted) {
        setPlans(result.plans)
        setErrorMessage(result.errorMessage)
        setIsLoading(false)
      }
    }

    loadPlans()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section
      id="pricing"
      className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-400 text-lg">
            Choose the plan that works for you. No credit card required to start.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 p-1 bg-gray-800 rounded-lg border border-gray-700">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                !isYearly
                  ? "bg-white text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                isYearly
                  ? "bg-white text-gray-900"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-orange-500">(Save 17%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        {errorMessage ? (
          <p className="text-center text-sm text-gray-300">{errorMessage}</p>
        ) : (
          <>
            {isLoading && (
              <span className="sr-only">Loading pricing plans...</span>
            )}
            <div className="grid md:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonCard key={`pricing-skeleton-${index}`} />
                  ))
                : plans.map((plan) => (
                <Card
                  key={plan.slug}
                  className={`relative ${
                    plan.highlighted
                      ? "border-orange-500 shadow-lg shadow-orange-500/20 scale-105"
                      : ""
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-gray-400 text-sm ml-2">
                          /{isYearly ? "year" : "month"}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant={resolveVariant(plan.ctaVariant)}
                      className="w-full mt-6"
                      size="lg"
                    >
                      <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
                    </Button>
                    {plan.monthlyPrice === 0 && (
                      <p className="text-xs text-gray-500 text-center">
                        No credit card required
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {!isLoading && plans.length === 0 && !errorMessage && (
          <p className="text-center text-sm text-gray-400 mt-6">
            No pricing plans available.
          </p>
        )}

        <p className="text-center text-sm text-gray-500 mt-8">
          All plans include a 14-day free trial. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
