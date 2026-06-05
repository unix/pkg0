import { CDN_SOURCES, PACKAGE_TYPES, PACKAGE_VIEWER_CONFIG } from '@/lib/config'
import type { CdnSource } from '@/lib/cdn-url'
import type { PackageType } from '@/lib/package-data'
import { cn } from '@/lib/utils'

interface PackageSourceToggleProps {
  activeTab: PackageType
  disabled: boolean
  onChange: (source: CdnSource) => void
  source: CdnSource
}

export const PackageSourceToggle = ({
  activeTab,
  disabled,
  onChange,
  source,
}: PackageSourceToggleProps) => (
  <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
    {PACKAGE_VIEWER_CONFIG.sourceOptions.map(option => (
      <button
        key={option.value}
        type="button"
        disabled={
          disabled ||
          (activeTab === PACKAGE_TYPES.github && option.value === CDN_SOURCES.unpkg)
        }
        className={cn(
          'rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-35',
          source === option.value
            ? 'bg-background text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground',
        )}
        onClick={() => onChange(option.value)}>
        {option.label}
      </button>
    ))}
  </div>
)
