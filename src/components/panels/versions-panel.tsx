import type { RefObject } from 'react'

import { PackageEmpty } from '@/components/placeholders/package-empty'
import { PackageLoadingSkeleton } from '@/components/placeholders/package-loading-skeleton'
import {
  PACKAGE_TYPES,
  PACKAGE_VIEWER_CONFIG,
  PACKAGE_VIEWER_TEXT,
} from '@/lib/config'
import type { PackageType } from '@/lib/package-data'
import type { PackageViewData } from '@/lib/package-view-types'
import { cn } from '@/lib/utils'

interface VersionsPanelProps {
  activeTab: PackageType
  data?: PackageViewData | null
  isSearching: boolean
  listRef: RefObject<HTMLDivElement | null>
  onLoadMore: () => void
  onSelect: (version: string) => void
  onTitleClick: () => void
}

export const VersionsPanel = ({
  activeTab,
  data,
  isSearching,
  listRef,
  onLoadMore,
  onSelect,
  onTitleClick,
}: VersionsPanelProps) => {
  const visibleVersionItems =
    data?.versionItems.slice(0, data.visibleVersionCount) ?? []

  return (
    <aside className="relative flex min-h-0 flex-col border-b bg-muted/25 p-2 sm:border-r sm:border-b-0">
      <div className="mb-1 flex items-center justify-between px-2 py-1.5">
        <button
          type="button"
          className="group h-4 overflow-hidden text-left text-[10px] leading-4 font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
          onClick={onTitleClick}>
          <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-4">
            {PACKAGE_VIEWER_TEXT.versionsTitle}
          </span>
          <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-4">
            {PACKAGE_VIEWER_TEXT.scrollToTop}
          </span>
        </button>
        {activeTab === PACKAGE_TYPES.npm && data?.versionCount !== null && data && (
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
            {data.versionCount}
          </span>
        )}
      </div>
      <div
        ref={listRef}
        className="flex max-h-56 flex-col gap-1 overflow-y-auto pr-1 sm:max-h-none sm:min-h-0 sm:flex-1">
        {!data ? (
          <PackageEmpty label={PACKAGE_VIEWER_TEXT.emptyVersionsLabel} />
        ) : (
          <>
            {visibleVersionItems.map(version => (
              <button
                key={version.label}
                type="button"
                data-selected-version={
                  data.selectedVersion === version.label ? 'true' : undefined
                }
                className={cn(
                  'relative shrink-0 overflow-hidden rounded-lg px-2.5 py-2 text-left transition-colors',
                  data.selectedVersion === version.label
                    ? 'bg-background shadow-xs ring-1 ring-inset ring-border'
                    : 'hover:bg-background/85 hover:shadow-xs',
                )}
                onClick={() => onSelect(version.label)}>
                <span className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] font-medium">
                    {version.label}
                  </span>
                  {version.tag && (
                    <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-700">
                      {version.tag}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-[9px] text-muted-foreground">
                  {version.date}
                </span>
              </button>
            ))}
            {data.visibleVersionCount < data.versionItems.length && (
              <button
                type="button"
                className="shrink-0 rounded-lg border border-dashed bg-background/50 px-2.5 py-2 text-center text-[10px] font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                onClick={onLoadMore}>
                {PACKAGE_VIEWER_TEXT.loadMoreVersions}
                <span className="ml-1 font-mono">
                  {Math.min(
                    PACKAGE_VIEWER_CONFIG.versionBatchSize,
                    data.versionItems.length - data.visibleVersionCount,
                  )}
                </span>
              </button>
            )}
          </>
        )}
      </div>
      {isSearching && <PackageLoadingSkeleton />}
    </aside>
  )
}
