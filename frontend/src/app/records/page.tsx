"use client"

import DataTable from "@/components/ui/DataTable"
import {
  createRecord,
  deleteRecord,
  getRecords,
  updateRecord,
  type Record,
  type RecordPayload,
  type FilterValue,
} from "@/lib/api"

// Form state type
type RecordFormState = {
  title: string
  description: string
  recorded_at: string
}

const initialFormState: RecordFormState = {
  title: "",
  description: "",
  recorded_at: "",
}

export default function RecordsPage() {
  // CRUD operations wrapper
  const crud = {
    list: async (params: {
      page: number
      perPage: number
      search?: string
      filters?: FilterValue[]
      order?: string
    }) => {
      const data = await getRecords({
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
    create: async (data: RecordPayload) => {
      return await createRecord(data)
    },
    update: async (id: number, data: RecordPayload) => {
      return await updateRecord(id, data)
    },
    delete: async (id: number) => {
      await deleteRecord(id)
    },
  }

  // Form fields configuration
  const formFields = [
    {
      key: "title",
      label: "Title",
      type: "text" as const,
      required: true,
      placeholder: "Record title",
    },
    {
      key: "description",
      label: "Description",
      type: "textarea" as const,
      placeholder: "Record description",
    },
    {
      key: "recorded_at",
      label: "Recorded At",
      type: "date" as const,
      required: true,
      placeholder: "YYYY-MM-DD",
    },
  ]

  // Convert form state to API payload
  const getFormData = (formState: Record<string, any>): RecordPayload => {
    return {
      title: String(formState.title || "").trim(),
      description: formState.description
        ? String(formState.description).trim() || null
        : null,
      recorded_at: String(formState.recorded_at || "").trim(),
    }
  }

  // Validate form
  const validateForm = (formState: Record<string, any>): string | null => {
    if (!formState.title?.trim()) {
      return "Title is required."
    }
    if (!formState.recorded_at?.trim()) {
      return "Recorded at date is required."
    }
    return null
  }

  // Custom cell renderer
  const renderCellValue = (record: Record, columnKey: string) => {
    switch (columnKey) {
      case "id":
        return <span className="text-gray-200">{record.id}</span>
      case "title":
        return <span className="text-white">{record.title}</span>
      case "description":
        return (
          <span className="text-gray-400">
            {record.description || "—"}
          </span>
        )
      case "recorded_at":
        return (
          <span className="text-gray-400">{record.recorded_at || "—"}</span>
        )
      case "created_at":
        return (
          <span className="text-gray-400">{record.created_at || "—"}</span>
        )
      case "updated_at":
        return (
          <span className="text-gray-400">{record.updated_at || "—"}</span>
        )
      default:
        return <span className="text-gray-400">—</span>
    }
  }

  return (
    <DataTable<Record, RecordPayload, RecordPayload>
      entityClass="Record"
      entityName="Record"
      storageKey="records-table-columns"
      crud={crud}
      formFields={formFields}
      initialFormState={initialFormState}
      getFormData={getFormData}
      validateForm={validateForm}
      getItemId={(item) => item.id}
      getItemTitle={(item) => item.title}
      renderCellValue={renderCellValue}
      title="Records"
      description="Create, update, and manage your records."
    />
  )
}
