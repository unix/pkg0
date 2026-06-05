import { GithubIcon, PackageIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { PACKAGE_TYPES, PACKAGE_VIEWER_TEXT } from '@/lib/config'
import type { PackageType } from '@/lib/package-data'
import type { PackageViewData } from '@/lib/package-view-types'

interface PackageSummaryProps {
  activeTab: PackageType
  data?: PackageViewData | null
}

const summaryText = (activeTab: PackageType, data?: PackageViewData | null) => {
  if (!data) {
    return activeTab === PACKAGE_TYPES.npm
      ? PACKAGE_VIEWER_TEXT.packageSummaryNpmPrompt
      : PACKAGE_VIEWER_TEXT.packageSummaryGithubPrompt
  }

  const versionText =
    data.versionCount === null
      ? ''
      : `${data.versionCount} ${PACKAGE_VIEWER_TEXT.versionCountSuffix} · `

  return `${versionText}${data.files.length} ${PACKAGE_VIEWER_TEXT.topLevelItemsSuffix}`
}

export const PackageSummary = ({ activeTab, data }: PackageSummaryProps) => (
  <div className="flex min-w-0 items-center gap-3">
    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
      <HugeiconsIcon
        icon={activeTab === PACKAGE_TYPES.npm ? PackageIcon : GithubIcon}
        className="size-4"
      />
    </span>
    <div className="min-w-0">
      <p className="truncate text-xs font-semibold">
        {data?.packageName ?? PACKAGE_VIEWER_TEXT.noPackageSelected}
      </p>
      <p className="text-[10px] text-muted-foreground">
        {summaryText(activeTab, data)}
      </p>
    </div>
  </div>
)
