"use client"

import DataTable from "@/components/ui/DataTable"
import {
  createArticle,
  deleteArticle,
  getArticles,
  updateArticle,
  type Article,
  type ArticlePayload,
  type FilterValue,
} from "@/lib/api"

// Form state type
type ArticleFormState = {
  title: string
  user_id: string
  sub_title: string
  state: string
  content: string
  published_at: string
}

const initialFormState: ArticleFormState = {
  title: "",
  user_id: "",
  sub_title: "",
  state: "draft",
  content: "",
  published_at: "",
}

export default function ArticlesPage() {
  // CRUD operations wrapper
  const crud = {
    list: async (params: {
      page: number
      perPage: number
      search?: string
      filters?: FilterValue[]
      order?: string
    }) => {
      const data = await getArticles({
        page: params.page,
        perPage: params.perPage,
        search: params.search,
        filters: params.filters,
        order: params.order,
      })
      return {
        items: data.items,
        totalItems: data.totalItems,
        totalPages: data.totalPages,
      }
    },
    create: async (data: ArticlePayload) => {
      return await createArticle(data)
    },
    update: async (id: number, data: ArticlePayload) => {
      return await updateArticle(id, data)
    },
    delete: async (id: number) => {
      await deleteArticle(id)
    },
  }

  // Form fields configuration
  const formFields = [
    {
      key: "title",
      label: "Title",
      type: "text" as const,
      required: true,
      placeholder: "Article title",
    },
    {
      key: "user_id",
      label: "User ID",
      type: "number" as const,
      required: true,
      placeholder: "Author user id",
    },
    {
      key: "sub_title",
      label: "Sub title",
      type: "text" as const,
      placeholder: "Optional subtitle",
    },
    {
      key: "state",
      label: "State",
      type: "text" as const,
      required: true,
      placeholder: "draft",
    },
    {
      key: "published_at",
      label: "Published at",
      type: "datetime-local" as const,
      placeholder: "YYYY-MM-DD HH:mm:ss",
    },
    {
      key: "content",
      label: "Content",
      type: "textarea" as const,
      placeholder: "Article content",
    },
  ]

  // Convert form state to API payload
  const getFormData = (formState: Record<string, any>): ArticlePayload => {
    return {
      title: String(formState.title || "").trim(),
      user_id: Number(formState.user_id || 0),
      state: String(formState.state || "").trim(),
      sub_title: formState.sub_title ? String(formState.sub_title).trim() || null : null,
      content: formState.content ? String(formState.content).trim() || null : null,
      published_at: formState.published_at ? String(formState.published_at).trim() || null : null,
    }
  }

  // Validate form
  const validateForm = (formState: Record<string, any>): string | null => {
    if (!formState.title?.trim()) {
      return "Title is required."
    }
    if (!formState.user_id) {
      return "User ID is required."
    }
    if (!formState.state?.trim()) {
      return "State is required."
    }
    return null
  }

  // Custom cell renderer
  const renderCellValue = (article: Article, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return <span className="text-gray-200">{article.id}</span>
      case "title":
        return <span className="text-white">{article.title}</span>
      case "sub_title":
        return (
          <span className="text-gray-400">{article.sub_title || "—"}</span>
        )
      case "state":
        return <span className="text-gray-400">{article.state}</span>
      case "published_at":
        return (
          <span className="text-gray-400">{article.published_at || "—"}</span>
        )
      case "user":
        return (
          <span className="text-gray-400">
            {article.user?.name || article.user_id || "—"}
          </span>
        )
      case "created_at":
        return (
          <span className="text-gray-400">{article.created_at || "—"}</span>
        )
      case "updated_at":
        return (
          <span className="text-gray-400">{article.updated_at || "—"}</span>
        )
      case "content":
        return (
          <span className="text-gray-400">
            {article.content ? article.content.substring(0, 50) + "..." : "—"}
          </span>
        )
      default:
        return <span className="text-gray-400">—</span>
    }
  }

  return (
    <DataTable<Article, ArticlePayload, ArticlePayload>
      entityClass="Article"
      entityName="Article"
      storageKey="articles-table-columns"
      crud={crud}
      formFields={formFields}
      initialFormState={initialFormState}
      getFormData={getFormData}
      validateForm={validateForm}
      getItemId={(item) => item.id}
      getItemTitle={(item) => item.title}
      renderCellValue={renderCellValue}
      title="Articles"
      description="Create, update, and manage your published content."
      relationToIdMap={{
        user: "user_id",
      }}
    />
  )
}
