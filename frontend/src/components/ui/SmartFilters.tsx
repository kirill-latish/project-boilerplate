'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { X, Search } from 'lucide-react'
import { API_BASE_URL } from '@/lib/api'

// Types
export interface FilterOption {
  field: string
  label: string
  type: string
  operators: string[]
}

export interface FilterValue {
  field: string
  operator: string
  value: string | string[]
  label?: string
  displayLabel?: string // Human-readable label for the value (e.g., "Kyrylo" instead of "1")
}

export interface AutocompleteItem {
  id: string
  name: string
  type: 'filter' | 'value'
  field?: string
}

interface SmartFiltersProps {
  className?: string
  entityClass: string
  searchValue: string
  onSearchChange: (value: string) => void
  activeFilters: FilterValue[]
  onFiltersChange: (filters: FilterValue[]) => void
  placeholder?: string
  apiBaseUrl?: string
}

// Operator mappings
const OPERATOR_LABELS: Record<string, string> = {
  '=': '=',
  'not': '≠',
  'greater': '>',
  'less': '<',
  'greaterorequal': '≥',
  'lessorequal': '≤',
  'like': '~',
  'in': '∈',
  'notin': '∉',
  'isnull': '∅',
  'notnull': '∃',
  'between': '↔'
}

const OPERATOR_TOOLTIPS: Record<string, string> = {
  '=': 'equals',
  'not': 'not equal',
  'greater': 'greater than',
  'less': 'less than',
  'greaterorequal': 'greater or equal',
  'lessorequal': 'less or equal',
  'like': 'contains',
  'in': 'in list',
  'notin': 'not in list',
  'isnull': 'is null',
  'notnull': 'is not null',
  'between': 'between'
}

// API utility
const resolveApiBaseUrl = (apiBaseUrl?: string) => {
  if (apiBaseUrl) return apiBaseUrl
  return process.env.NEXT_PUBLIC_API_URL || API_BASE_URL
}

const makeApiCall = async (
  endpoint: string,
  options: RequestInit = {},
  apiBaseUrl?: string
) => {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('access_token')
    : null
  const apiUrl = resolveApiBaseUrl(apiBaseUrl)
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${apiUrl}/api${endpoint}`, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

export default function SmartFilters({
  className = '',
  entityClass,
  searchValue,
  onSearchChange,
  activeFilters,
  onFiltersChange,
  placeholder = 'Search or filter...',
  apiBaseUrl = ''
}: SmartFiltersProps) {
  // State
  const [availableFilters, setAvailableFilters] = useState<FilterOption[]>([])
  const [autocompleteItems, setAutocompleteItems] = useState<AutocompleteItem[]>([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | null>(null)
  const [selectedOperator, setSelectedOperator] = useState('=')
  const [inputValue, setInputValue] = useState(searchValue)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [isClickingAutocomplete, setIsClickingAutocomplete] = useState(false)
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null)
  const valueInputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<HTMLDivElement>(null)

  // Load available filters
  const loadAvailableFilters = useCallback(async () => {
    try {
      const response = await makeApiCall(`/filters?class=${entityClass}`, {}, apiBaseUrl)
      setAvailableFilters(response.data.filters || [])
    } catch (error) {
      console.error('Error loading filters:', error)
    }
  }, [entityClass, apiBaseUrl])

  // Load filter options for dropdown fields
  const loadFilterOptions = useCallback(async (field: string, search = '') => {
    try {
      const params = new URLSearchParams({
        class: entityClass,
        field,
        limit: '50'
      })
      if (search) params.append('search', search)
      
      const response = await makeApiCall(`/filter-options?${params}`, {}, apiBaseUrl)
      return response.data.options || []
    } catch (error) {
      console.error('Error loading filter options:', error)
      return []
    }
  }, [entityClass, apiBaseUrl])

  // Perform search for autocomplete (immediate local filtering)
  const performSearch = useCallback(async (query: string) => {
    if (!selectedFilter) {
      // Search for filters - immediate local filtering
      const filteredFilters = availableFilters.filter(filter =>
        filter.label.toLowerCase().includes(query.toLowerCase()) ||
        filter.field.toLowerCase().includes(query.toLowerCase())
      )
      
      const items: AutocompleteItem[] = filteredFilters.map(filter => ({
        id: filter.field,
        name: filter.label,
        type: 'filter' as const,
        field: filter.field
      }))
      
      setAutocompleteItems(items)
    } else {
      // Search for values - immediate for boolean, debounced for API calls
      const fieldType = selectedFilter.type
      
      if (fieldType === 'boolean') {
        const options: AutocompleteItem[] = [
          { id: 'true', name: 'True', type: 'value' },
          { id: 'false', name: 'False', type: 'value' }
        ]
        setAutocompleteItems(options)
      } else if (['isnull', 'notnull'].includes(selectedOperator)) {
        setAutocompleteItems([])
      }
      // API calls are handled separately via debounced effect
    }
  }, [selectedFilter, selectedOperator, availableFilters])

  // Perform API search with debounced query
  const performApiSearch = useCallback(async (query: string) => {
    if (!selectedFilter || ['isnull', 'notnull'].includes(selectedOperator)) {
      return
    }

    const apiOptions = await loadFilterOptions(selectedFilter.field, query)
    const options = apiOptions.map((option: any) => ({
      id: option.id?.toString() || option.name,
      name: option.name,
      type: 'value' as const
    }))
    setAutocompleteItems(options)
  }, [selectedFilter, selectedOperator, loadFilterOptions])

  // Handle search change
  const handleSearchChange = (value: string) => {
    setInputValue(value)
    if (!selectedFilter) {
      onSearchChange(value)
    }
    
    // Immediate local filtering
    performSearch(value)
    setShowAutocomplete(value.length > 0 || selectedFilter !== null)
  }

  // Handle filter selection
  const handleFilterSelect = (filterOption: FilterOption) => {
    setSelectedFilter(filterOption)
    setSelectedOperator('=')
    onSearchChange('')
    setInputValue('')
    performSearch('')
    setShowAutocomplete(true)
    
    setTimeout(() => {
      valueInputRef.current?.focus()
    }, 100)
  }

  // Handle value selection
  const handleValueSelect = (value: string, displayLabel?: string) => {
    if (!selectedFilter) return
    
    setIsClickingAutocomplete(false)
    
    const newFilter: FilterValue = {
      field: selectedFilter.field,
      operator: selectedOperator,
      value: value,
      label: selectedFilter.label,
      displayLabel: displayLabel || value // Use provided label or fallback to value
    }
    
    onFiltersChange([...activeFilters, newFilter])
    
    // Reset search state
    setSelectedFilter(null)
    setSelectedOperator('=')
    onSearchChange('')
    setInputValue('')
    setAutocompleteItems([])
    setShowAutocomplete(false)
    
    searchInputRef.current?.focus()
  }

  // Handle manual value entry
  const handleManualValueEntry = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedFilter && inputValue.trim()) {
      handleValueSelect(inputValue.trim())
    }
  }

  // Handle value input blur (when user clicks away after typing)
  const handleValueInputBlur = () => {
    // Don't process blur if user is clicking on autocomplete item
    if (isClickingAutocomplete) {
      return
    }
    
    if (selectedFilter && inputValue.trim()) {
      // Small delay to allow clicking on autocomplete items
      setTimeout(() => {
        if (inputValue.trim() && !isClickingAutocomplete) {
          handleValueSelect(inputValue.trim())
        }
      }, 150)
    }
  }

  // Cancel filter creation
  const cancelFilterCreation = () => {
    setIsClickingAutocomplete(false)
    setSelectedFilter(null)
    setSelectedOperator('=')
    onSearchChange('')
    setInputValue('')
    setAutocompleteItems([])
    setShowAutocomplete(false)
  }

  // Remove filter
  const removeFilter = (index: number) => {
    const updatedFilters = activeFilters.filter((_, i) => i !== index)
    onFiltersChange(updatedFilters)
  }

  // Change operator
  const changeOperator = (filterIndex: number, newOperator: string) => {
    const updatedFilters = [...activeFilters]
    updatedFilters[filterIndex].operator = newOperator
    onFiltersChange(updatedFilters)
  }

  // Edit existing filter
  const editFilter = (filterIndex: number) => {
    const filterToEdit = activeFilters[filterIndex]
    const filterOption = availableFilters.find(f => f.field === filterToEdit.field)
    
    if (!filterOption) return
    
    // Remove the filter being edited from active filters
    const updatedFilters = activeFilters.filter((_, i) => i !== filterIndex)
    onFiltersChange(updatedFilters)
    
    // Set up the search bar for editing
    setSelectedFilter(filterOption)
    setSelectedOperator(filterToEdit.operator)
    const nextValue = Array.isArray(filterToEdit.value)
      ? filterToEdit.value.join(',')
      : filterToEdit.value.toString()
    onSearchChange(nextValue)
    setInputValue(nextValue)
    setAutocompleteItems([])
    
    // Load options and show autocomplete
    performSearch('').then(() => {
      setShowAutocomplete(true)
    })
    
    // Focus the value input
    setTimeout(() => {
      valueInputRef.current?.focus()
    }, 100)
  }

  // Format filter value for display
  const formatFilterValue = (filter: FilterValue) => {
    // Use displayLabel if available (for user-friendly labels like "Kyrylo" instead of "1")
    if (filter.displayLabel) {
      const display = filter.displayLabel.toString()
      return display.length > 20 ? `${display.substring(0, 20)}...` : display
    }
    
    if (Array.isArray(filter.value)) {
      return filter.value.length > 3 
        ? `${filter.value.slice(0, 3).join(', ')}... (+${filter.value.length - 3})`
        : filter.value.join(', ')
    }
    
    const value = filter.value.toString()
    
    if (filter.field === 'state' || filter.field.includes('ntf_')) {
      return value === 'true' ? 'True' : value === 'false' ? 'False' : value
    }
    
    return value.length > 20 ? `${value.substring(0, 20)}...` : value
  }

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setIsClickingAutocomplete(false)
        setShowAutocomplete(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!selectedFilter) {
      setInputValue(searchValue)
    }
  }, [searchValue, selectedFilter])

  // Debounce search query for API calls when filter is selected
  useEffect(() => {
    if (selectedFilter && !['isnull', 'notnull'].includes(selectedOperator)) {
      // Immediate load for empty query, debounced for typed queries
      if (!inputValue) {
        setDebouncedSearchQuery('')
      } else {
        const timer = setTimeout(() => {
          setDebouncedSearchQuery(inputValue)
        }, 500)

        return () => clearTimeout(timer)
      }
    } else {
      setDebouncedSearchQuery('')
    }
  }, [inputValue, selectedFilter, selectedOperator])

  // Trigger API call with debounced query
  useEffect(() => {
    if (selectedFilter && !['isnull', 'notnull'].includes(selectedOperator)) {
      performApiSearch(debouncedSearchQuery)
    }
  }, [debouncedSearchQuery, selectedFilter, selectedOperator, performApiSearch])

  // Load filters on mount
  useEffect(() => {
    loadAvailableFilters()
  }, [loadAvailableFilters])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative" ref={autocompleteRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          
          {selectedFilter ? (
            // Filter context mode
            <div className="w-full bg-slate-700 border border-slate-600 rounded-md pl-10 pr-10 h-10 flex items-center">
              <div className="inline-flex items-center bg-slate-700/80 border border-slate-600/50 rounded h-7 overflow-hidden">
                <span className="px-2 py-1 text-xs text-slate-300 bg-slate-600/50 border-r border-slate-600/50">
                  {selectedFilter.label}
                </span>
                <span className="px-1.5 py-1 text-xs text-slate-300 font-mono border-r border-slate-600/50">
                  {OPERATOR_LABELS[selectedOperator]}
                </span>
                <div className="flex-1 relative min-w-0" style={{ width: '120px' }}>
                  <input
                    ref={valueInputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={handleManualValueEntry}
                    onBlur={handleValueInputBlur}
                    placeholder="value..."
                    className="w-full px-2 py-1 text-xs bg-transparent text-white placeholder-slate-400 border-0 outline-none"
                  />
                </div>
              </div>
              
              <Button
                onClick={cancelFilterCreation}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            // Normal search mode
            <input
              ref={searchInputRef}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              onFocus={() => inputValue.length > 0 && setShowAutocomplete(true)}
            />
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {showAutocomplete && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-md shadow-lg z-50 max-h-60 overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {autocompleteItems.length > 0 ? (
                <>
                  {autocompleteItems.map((item) => (
                    <button
                      key={item.id}
                      onMouseDown={(e) => {
                        e.preventDefault() // Prevent input blur
                        setIsClickingAutocomplete(true)
                      }}
                      onClick={() => {
                        setIsClickingAutocomplete(false)
                        if (item.type === 'filter') {
                          const filterOption = availableFilters.find(f => f.field === item.field)
                          if (filterOption) handleFilterSelect(filterOption)
                        } else {
                          handleValueSelect(item.id, item.name)
                        }
                      }}
                      className="w-full px-3 py-2 text-left text-white hover:bg-slate-600 border-b border-slate-600/50 text-sm"
                    >
                      <span className="font-medium">{item.name}</span>
                      {item.type === 'filter' && (
                        <span className="text-slate-400 text-xs ml-2">({item.field})</span>
                      )}
                    </button>
                  ))}
                  {selectedFilter && inputValue.trim() && (
                    <div className="px-3 py-2 text-xs text-slate-400 border-t border-slate-600/50 bg-slate-800/50">
                      Press Enter or click away to use "{inputValue.trim()}"
                    </div>
                  )}
                </>
              ) : selectedFilter && inputValue.trim() ? (
                <div className="px-3 py-2 text-white">
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault() // Prevent input blur
                      setIsClickingAutocomplete(true)
                    }}
                    onClick={() => {
                      setIsClickingAutocomplete(false)
                      handleValueSelect(inputValue.trim())
                    }}
                    className="w-full text-left hover:bg-slate-600 px-2 py-1 rounded"
                  >
                    Use "{inputValue.trim()}"
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 text-gray-400 text-sm">
                  {selectedFilter ? 'Type to enter a custom value' : 'Type to search filters'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter, index) => (
            <div
              key={`${filter.field}-${filter.operator}-${index}`}
              className="inline-flex items-center bg-slate-700/30 border border-slate-600/50 rounded h-7 overflow-hidden gap-1.5"
            >
              <span className="px-2 py-1 text-xs text-slate-300">
                {filter.label || filter.field}
              </span>

              <select
                value={filter.operator}
                onChange={(event) => changeOperator(index, event.target.value)}
                className="h-7 px-1 text-xs text-slate-300 font-mono bg-transparent border-l border-slate-600/50 focus:outline-none cursor-pointer"
                style={{ 
                  width: '1.5rem',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  backgroundImage: 'none',
                  paddingRight: '0.25rem'
                }}
                aria-label={`Operator for ${filter.label || filter.field}`}
                title={OPERATOR_TOOLTIPS[filter.operator] || filter.operator}
              >
                {(availableFilters.find(f => f.field === filter.field)?.operators
                  ?? Object.keys(OPERATOR_LABELS)
                ).map(op => (
                  <option key={op} value={op} className="bg-slate-700 text-white">
                    {OPERATOR_LABELS[op] || op}
                  </option>
                ))}
              </select>

              <button
                onClick={() => editFilter(index)}
                className="text-white px-2 py-1 text-sm hover:bg-slate-600/50 transition-colors"
                title="Click to edit filter value"
              >
                {formatFilterValue(filter)}
              </button>

              <Button
                onClick={() => removeFilter(index)}
                variant="ghost"
                size="sm"
                className="h-7 w-6 p-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}

          {activeFilters.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange([])}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs px-2 py-1 h-7"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 