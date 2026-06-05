import {
  Cancel01Icon,
  Loading01Icon,
  Search01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import {
  PACKAGE_TYPES,
  PACKAGE_VIEWER_CONFIG,
  PACKAGE_VIEWER_TEXT,
} from '@/lib/config'
import { formatCheckedAt } from '@/lib/date-format'
import type { PackageType } from '@/lib/package-data'
import type { SearchHistorySuggestion } from '@/lib/search-history'
import { cn } from '@/lib/utils'

type SelectedTab = (typeof PACKAGE_VIEWER_CONFIG.tabOptions)[number]

interface PackageSearchFormProps {
  activeTab: PackageType
  inputValue: string
  isFocused: boolean
  isSearching: boolean
  onBlur: () => void
  onChange: (value: string) => void
  onFocus: () => void
  onRemoveSuggestion: (suggestion: SearchHistorySuggestion) => void
  onSelectSuggestion: (suggestion: SearchHistorySuggestion) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  selectedTab: SelectedTab
  suggestions: SearchHistorySuggestion[]
}

export const PackageSearchForm = ({
  activeTab,
  inputValue,
  isFocused,
  isSearching,
  onBlur,
  onChange,
  onFocus,
  onRemoveSuggestion,
  onSelectSuggestion,
  onSubmit,
  selectedTab,
  suggestions,
}: PackageSearchFormProps) => (
  <form className="flex gap-2" onSubmit={onSubmit}>
    <div className="relative min-w-0 flex-1">
      <HugeiconsIcon
        icon={selectedTab.icon}
        className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm shadow-xs outline-none transition-shadow placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        disabled={isSearching}
        placeholder={
          activeTab === PACKAGE_TYPES.npm
            ? PACKAGE_VIEWER_TEXT.npmPlaceholder
            : PACKAGE_VIEWER_TEXT.githubPlaceholder
        }
        value={inputValue}
        onBlur={onBlur}
        onChange={event => onChange(event.target.value)}
        onFocus={onFocus}
      />
      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-11 right-0 left-0 z-20 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg">
          {suggestions.map(suggestion => (
            <div
              key={suggestion.query}
              className="flex items-center gap-1 rounded-md hover:bg-muted"
              onMouseDown={event => event.preventDefault()}>
              <button
                type="button"
                className="min-w-0 flex-1 px-2 py-1.5 text-left"
                onClick={() => onSelectSuggestion(suggestion)}>
                <span className="block truncate text-xs">{suggestion.query}</span>
                <span className="block truncate text-[9px] text-muted-foreground">
                  {suggestion.versionCount === null
                    ? ''
                    : `${suggestion.versionCount} ${PACKAGE_VIEWER_TEXT.versionCountSuffix} · `}
                  {PACKAGE_VIEWER_TEXT.searchHistoryCheckedPrefix}{' '}
                  {formatCheckedAt(suggestion.checkedAt)}
                </span>
              </button>
              <button
                type="button"
                aria-label={`${PACKAGE_VIEWER_TEXT.removeSuggestionLabelPrefix} ${suggestion.query}`}
                className="grid size-6 shrink-0 place-items-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                onClick={() => onRemoveSuggestion(suggestion)}>
                <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    <Button
      type="submit"
      size="lg"
      className="h-10 px-4 text-xs"
      disabled={isSearching}>
      <HugeiconsIcon
        icon={isSearching ? Loading01Icon : Search01Icon}
        className={cn(isSearching && 'animate-spin')}
      />
      {isSearching
        ? PACKAGE_VIEWER_TEXT.loadingSearch
        : PACKAGE_VIEWER_TEXT.searchButton}
    </Button>
  </form>
)
