export const API_BASE_URL = "http://localhost:80"

const resolveApiBaseUrl = () => process.env.NEXT_PUBLIC_API_URL || API_BASE_URL

type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
}

const FRIENDLY_500_MESSAGE =
  "Something went wrong. We already fixing it. Please try a little bit later"

export class ApiError extends Error {
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

type ArticleApi = {
  id: number | string
  title: string
  user_id: number | string
  sub_title: string | null
  state: string
  content: string | null
  published_at: string | null
  created_at: string | null
  updated_at: string | null
  user?: {
    id?: number | string
    name?: string
    email?: string
  }
}

export type Article = {
  id: number
  title: string
  user_id: number
  sub_title: string | null
  state: string
  content: string | null
  published_at: string | null
  created_at: string | null
  updated_at: string | null
  user?: {
    id?: number
    name?: string
    email?: string
  }
}

export type ArticlePayload = {
  title: string
  user_id: number
  sub_title?: string | null
  state: string
  content?: string | null
  published_at?: string | null
}

type ArticlesResponse = {
  items: ArticleApi[]
  totalItems: number
  totalPages: number
  page: number
  perPage: number
  order: string
  search: string | null
  filters: unknown[]
}

export type NormalizedArticlesResponse = {
  items: Article[]
  totalItems: number
  totalPages: number
  page: number
  perPage: number
  order: string
  search: string | null
  filters: unknown[]
}

type ArticleFilter = {
  field: string
  operator: string
  value: string | string[]
}

// Re-export FilterValue from SmartFilters for convenience
export type { FilterValue } from "@/components/ui/SmartFilters"

type GetArticlesParams = {
  page?: number
  perPage?: number
  search?: string
  order?: string
  filters?: ArticleFilter[]
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

const normalizeArticle = (article: ArticleApi): Article => ({
  id: toNumber(article.id),
  title: article.title ?? "",
  user_id: toNumber(article.user_id),
  sub_title: article.sub_title ?? null,
  state: article.state ?? "",
  content: article.content ?? null,
  published_at: article.published_at ?? null,
  created_at: article.created_at ?? null,
  updated_at: article.updated_at ?? null,
  user: article.user
    ? {
        id: article.user.id !== undefined ? toNumber(article.user.id) : undefined,
        name: article.user.name,
        email: article.user.email,
      }
    : undefined,
})

const getAuthHeaders = (): HeadersInit => {
  if (typeof window === "undefined") {
    return {}
  }

  const token = localStorage.getItem("access_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const buildArticleQueryParams = ({
  page = 1,
  perPage = 20,
  search,
  order,
  filters = [],
}: GetArticlesParams) => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  })

  if (search) {
    params.set("search", search)
  }

  if (order) {
    params.set("order", order)
  }

  filters.forEach((filter) => {
    const operator = filter.operator || "="
    const key = operator === "=" ? filter.field : `${filter.field}:${operator}`
    const rawValue = Array.isArray(filter.value)
      ? filter.value.join(",")
      : filter.value
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue

    if (value === "" || value === null || value === undefined) {
      if (["isnull", "notnull", "doesnthave"].includes(operator)) {
        params.append(key, "1")
      }
      return
    }

    params.append(key, String(value))
  })

  return params
}

const fetchJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${resolveApiBaseUrl()}${path}`, {
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

export const getArticles = async ({
  page = 1,
  perPage = 20,
  search,
  order,
  filters,
}: GetArticlesParams = {}): Promise<NormalizedArticlesResponse> => {
  const params = buildArticleQueryParams({ page, perPage, search, order, filters })
  const response = await fetchJson<ApiResponse<ArticlesResponse>>(
    `/api/articles?${params.toString()}`,
    {
      cache: "no-store",
      headers: {
        ...getAuthHeaders(),
      },
    }
  )

  const normalizedItems: Article[] = (response.data.items ?? []).map(normalizeArticle)
  const result: NormalizedArticlesResponse = {
    totalItems: response.data.totalItems,
    totalPages: response.data.totalPages,
    page: response.data.page,
    perPage: response.data.perPage,
    order: response.data.order,
    search: response.data.search,
    filters: response.data.filters,
    items: normalizedItems,
  }
  return result
}

export const createArticle = async (payload: ArticlePayload): Promise<Article> => {
  const response = await fetchJson<ApiResponse<ArticleApi>>("/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  })

  return normalizeArticle(response.data)
}

export const updateArticle = async (
  id: number,
  payload: Partial<ArticlePayload>
): Promise<Article> => {
  const response = await fetchJson<ApiResponse<ArticleApi>>(`/api/articles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  })

  return normalizeArticle(response.data)
}

export const deleteArticle = async (id: number): Promise<void> => {
  await fetchJson<ApiResponse<unknown>>(`/api/articles/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })
}

export type ColumnConfig = {
  key: string
  label: string
}

export const getAvailableColumns = async (
  entityClass: string
): Promise<ColumnConfig[]> => {
  const response = await fetchJson<ApiResponse<{ columns: ColumnConfig[] }>>(
    `/api/columns?class=${entityClass}`,
    {
      method: "GET",
      headers: {
        ...getAuthHeaders(),
      },
    }
  )

  return response.data.columns
}

// Record types and API functions
type RecordApi = {
  id: number | string
  title: string
  description: string | null
  recorded_at: string | null
  created_at: string | null
  updated_at: string | null
}

export type Record = {
  id: number
  title: string
  description: string | null
  recorded_at: string | null
  created_at: string | null
  updated_at: string | null
}

export type RecordPayload = {
  title: string
  description?: string | null
  recorded_at: string
}

type RecordsResponse = {
  items: RecordApi[]
  totalItems: number
  totalPages: number
  page: number
  perPage: number
  order: string
  search: string | null
  filters: unknown[]
}

export type NormalizedRecordsResponse = {
  items: Record[]
  totalItems: number
  totalPages: number
  page: number
  perPage: number
  order: string
  search: string | null
  filters: unknown[]
}

type GetRecordsParams = {
  page?: number
  perPage?: number
  search?: string
  order?: string
  filters?: FilterValue[]
}

const normalizeRecord = (record: RecordApi): Record => ({
  id: toNumber(record.id),
  title: record.title ?? "",
  description: record.description ?? null,
  recorded_at: record.recorded_at ?? null,
  created_at: record.created_at ?? null,
  updated_at: record.updated_at ?? null,
})

const buildRecordQueryParams = ({
  page = 1,
  perPage = 20,
  search,
  order,
  filters = [],
}: {
  page?: number
  perPage?: number
  search?: string
  order?: string
  filters?: FilterValue[]
}) => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  })

  if (search) {
    params.set("search", search)
  }

  if (order) {
    params.set("order", order)
  }

  filters.forEach((filter) => {
    const operator = filter.operator || "="
    const key = operator === "=" ? filter.field : `${filter.field}:${operator}`
    const rawValue = Array.isArray(filter.value)
      ? filter.value.join(",")
      : filter.value
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue

    if (value === "" || value === null || value === undefined) {
      if (["isnull", "notnull", "doesnthave"].includes(operator)) {
        params.append(key, "1")
      }
      return
    }

    params.append(key, String(value))
  })

  return params
}

export const getRecords = async ({
  page = 1,
  perPage = 20,
  search,
  order,
  filters,
}: GetRecordsParams = {}): Promise<NormalizedRecordsResponse> => {
  const params = buildRecordQueryParams({ page, perPage, search, order, filters })
  const response = await fetchJson<ApiResponse<RecordsResponse>>(
    `/api/records?${params.toString()}`,
    {
      cache: "no-store",
      headers: {
        ...getAuthHeaders(),
      },
    }
  )

  const normalizedItems: Record[] = (response.data.items ?? []).map(normalizeRecord)
  const result: NormalizedRecordsResponse = {
    totalItems: response.data.totalItems,
    totalPages: response.data.totalPages,
    page: response.data.page,
    perPage: response.data.perPage,
    order: response.data.order,
    search: response.data.search,
    filters: response.data.filters,
    items: normalizedItems,
  }
  return result
}

export const createRecord = async (payload: RecordPayload): Promise<Record> => {
  const response = await fetchJson<ApiResponse<RecordApi>>("/api/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  })

  return normalizeRecord(response.data)
}

export const updateRecord = async (
  id: number,
  payload: Partial<RecordPayload>
): Promise<Record> => {
  const response = await fetchJson<ApiResponse<RecordApi>>(`/api/records/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  })

  return normalizeRecord(response.data)
}

export const deleteRecord = async (id: number): Promise<void> => {
  await fetchJson<ApiResponse<unknown>>(`/api/records/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  })
}
