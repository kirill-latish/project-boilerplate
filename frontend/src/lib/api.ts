export const API_BASE_URL = "http://localhost:80"

type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
}

const FRIENDLY_500_MESSAGE =
  "Something went wrong. We already fixing it. Please try a little bit later"

class ApiError extends Error {
  status: number

  constructor(status: number, message?: string) {
    super(message ?? `API request failed (${status})`)
    this.status = status
  }
}

type PricingPlanApi = {
  id: number | string
  name: string
  slug: string
  description: string | null
  monthly_price: number | string
  yearly_price: number | string
  currency: string
  features: string[] | string
  cta_label: string
  cta_href: string
  cta_variant: string
  highlighted: boolean | number | string
  sort_order: number | string
  is_active: boolean | number | string
}

type PricingPlansResponse = {
  items: PricingPlanApi[]
  totalItems: number
  totalPages: number
  page: number
  perPage: number
  order: string
  search: string
  filters: Record<string, unknown>
}

export type PricingPlan = {
  id: number
  name: string
  slug: string
  description: string | null
  monthlyPrice: number
  yearlyPrice: number
  currency: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  ctaVariant: string
  highlighted: boolean
  sortOrder: number
  isActive: boolean
}

const toNumber = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

const toBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") {
    return value
  }

  if (typeof value === "number") {
    return value === 1
  }

  if (typeof value === "string") {
    return value === "1" || value.toLowerCase() === "true"
  }

  return false
}

const toFeatures = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item))
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item))
      }
    } catch {
      return []
    }
  }

  return []
}

const normalizePricingPlan = (plan: PricingPlanApi): PricingPlan => ({
  id: toNumber(plan.id),
  name: plan.name,
  slug: plan.slug,
  description: plan.description ?? null,
  monthlyPrice: toNumber(plan.monthly_price),
  yearlyPrice: toNumber(plan.yearly_price),
  currency: plan.currency ?? "USD",
  features: toFeatures(plan.features),
  ctaLabel: plan.cta_label,
  ctaHref: plan.cta_href ?? "/sign-up",
  ctaVariant: plan.cta_variant ?? "default",
  highlighted: toBoolean(plan.highlighted),
  sortOrder: toNumber(plan.sort_order),
  isActive: toBoolean(plan.is_active),
})

const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status)
  }

  return response.json() as Promise<T>
}

type PricingPlansResult = {
  plans: PricingPlan[]
  errorMessage: string | null
}

export const getPricingPlans = async (): Promise<PricingPlansResult> => {
  try {
    const response = await fetchJson<ApiResponse<PricingPlansResponse>>(
      "/api/pricing-plans",
      {
        cache: "no-store",
      }
    )

    const items = response?.data?.items ?? []

    const plans = items
      .map(normalizePricingPlan)
      .filter((plan) => plan.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
    return { plans, errorMessage: null }
  } catch (error) {
    console.error("Failed to load pricing plans.", error)
    if (error instanceof ApiError && error.status === 500) {
      return { plans: [], errorMessage: FRIENDLY_500_MESSAGE }
    }

    return { plans: [], errorMessage: null }
  }
}
