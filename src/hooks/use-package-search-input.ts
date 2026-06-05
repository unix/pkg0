import { useCallback, useRef, useState, type FormEvent } from 'react'

import type { PackageType } from '@/lib/package-data'
import { searchHistory, type SearchHistorySuggestion } from '@/lib/search-history'

interface UsePackageSearchInputOptions {
  activeTab: PackageType
  inputValue: string
  loadPackage: (type: PackageType, name: string) => void
  setInputValue: (packageType: PackageType, value: string) => void
}

export const usePackageSearchInput = ({
  activeTab,
  inputValue,
  loadPackage,
  setInputValue,
}: UsePackageSearchInputOptions) => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchHistorySuggestion[]>([])
  const suggestionsRequestRef = useRef(0)

  const refreshSuggestions = useCallback((type: PackageType, query: string) => {
    const requestId = suggestionsRequestRef.current + 1
    suggestionsRequestRef.current = requestId

    void searchHistory.suggestions(type, query).then(nextSuggestions => {
      if (suggestionsRequestRef.current !== requestId) {
        return
      }

      setSuggestions(nextSuggestions)
    })
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false)
  }, [])

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(activeTab, value)
      refreshSuggestions(activeTab, value)
    },
    [activeTab, refreshSuggestions, setInputValue],
  )

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true)
    refreshSuggestions(activeTab, inputValue)
  }, [activeTab, inputValue, refreshSuggestions])

  const handleRemoveSuggestion = useCallback(
    (suggestion: SearchHistorySuggestion) => {
      void searchHistory.remove(activeTab, suggestion.query).then(() => {
        refreshSuggestions(activeTab, inputValue)
      })
    },
    [activeTab, inputValue, refreshSuggestions],
  )

  const handleSearch = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const trimmedValue = inputValue.trim()

      if (!trimmedValue) {
        return
      }

      loadPackage(activeTab, trimmedValue)
    },
    [activeTab, inputValue, loadPackage],
  )

  const handleSelectSuggestion = useCallback(
    (suggestion: SearchHistorySuggestion) => {
      setInputValue(activeTab, suggestion.query)
      setIsInputFocused(false)
    },
    [activeTab, setInputValue],
  )

  return {
    handleInputBlur,
    handleInputChange,
    handleInputFocus,
    handleRemoveSuggestion,
    handleSearch,
    handleSelectSuggestion,
    isInputFocused,
    refreshSuggestions,
    suggestions,
  }
}
