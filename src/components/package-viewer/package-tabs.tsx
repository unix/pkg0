import { HugeiconsIcon } from '@hugeicons/react'

import { PACKAGE_VIEWER_CONFIG } from '@/lib/config'
import type { PackageType } from '@/lib/package-data'
import { cn } from '@/lib/utils'

interface PackageTabsProps {
  activeTab: PackageType
  disabled: boolean
  onSelect: (tab: PackageType) => void
}

export const PackageTabs = ({ activeTab, disabled, onSelect }: PackageTabsProps) => (
  <div className="border-b bg-muted/30 p-2">
    <div className="grid grid-cols-2 gap-1">
      {PACKAGE_VIEWER_CONFIG.tabOptions.map(tab => (
        <button
          key={tab.value}
          type="button"
          className={cn(
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all',
            activeTab === tab.value
              ? 'bg-background shadow-xs'
              : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
          )}
          disabled={disabled}
          onClick={() => onSelect(tab.value)}>
          <span
            className={cn(
              'grid size-8 shrink-0 place-items-center rounded-lg border bg-background',
              activeTab === tab.value && 'border-foreground/15',
            )}>
            <HugeiconsIcon icon={tab.icon} className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold">{tab.label}</span>
            <span className="hidden truncate text-[10px] text-muted-foreground sm:block">
              {tab.description}
            </span>
          </span>
        </button>
      ))}
    </div>
  </div>
)
