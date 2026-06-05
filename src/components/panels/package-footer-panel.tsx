import { GithubIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { PACKAGE_VIEWER_TEXT, PACKAGE_VIEWER_URLS } from '@/lib/config'

export const PackageFooterPanel = () => (
  <footer className="mt-5 flex flex-col gap-2 px-1 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
    <span>{PACKAGE_VIEWER_TEXT.footerCdnNote}</span>
    <a
      href={PACKAGE_VIEWER_URLS.githubRepo}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 font-mono transition-colors hover:text-foreground">
      <HugeiconsIcon icon={GithubIcon} className="size-3" />
      {PACKAGE_VIEWER_TEXT.githubRepoLabel}
    </a>
  </footer>
)
