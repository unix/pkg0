import { Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { PACKAGE_VIEWER_TEXT } from '@/lib/config'
import { cn } from '@/lib/utils'

interface PackageCopyToastProps {
  copiedPath: string
}

export const PackageCopyToast = ({ copiedPath }: PackageCopyToastProps) => (
  <div
    className={cn(
      'fixed bottom-5 left-1/2 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-full border bg-foreground px-3 py-2 text-[10px] text-background shadow-lg transition-all',
      copiedPath
        ? 'translate-y-0 opacity-100'
        : 'pointer-events-none translate-y-3 opacity-0',
    )}>
    <HugeiconsIcon icon={Tick02Icon} className="size-3.5 text-emerald-400" />
    <span className="truncate">
      {PACKAGE_VIEWER_TEXT.copyToastPrefix} {copiedPath}
    </span>
  </div>
)
