import { Link01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { PackageFileTreeItem } from '@/components/package-viewer/package-file-tree-item'
import { PackageEmpty } from '@/components/placeholders/package-empty'
import { PackageLoadingSkeleton } from '@/components/placeholders/package-loading-skeleton'
import { ERROR_MESSAGES, PACKAGE_VIEWER_TEXT } from '@/lib/config'
import type { PackageViewData } from '@/lib/package-view-types'

interface FileContentPanelProps {
  data?: PackageViewData | null
  isLoading: boolean
  isSearching: boolean
  onCancel: () => void
  onCopy: (path: string) => void
}

export const FileContentPanel = ({
  data,
  isLoading,
  isSearching,
  onCancel,
  onCopy,
}: FileContentPanelProps) => (
  <div className="relative min-h-[360px] min-w-0 bg-background sm:min-h-0">
    <div className="flex items-center justify-between border-b px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2 font-mono text-[10px]">
        <span className="truncate text-muted-foreground">
          {data?.packageName ?? PACKAGE_VIEWER_TEXT.filePlaceholderPackage}
        </span>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold">
          {data?.selectedVersion ?? PACKAGE_VIEWER_TEXT.filePlaceholderVersion}
        </span>
      </div>
      <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
        <HugeiconsIcon icon={Link01Icon} className="size-3" />
        {PACKAGE_VIEWER_TEXT.fileActionHint}
      </span>
    </div>
    <div className="h-[calc(100%_-_41px)] overflow-auto p-2">
      {!data ? (
        <PackageEmpty label={PACKAGE_VIEWER_TEXT.emptyFileContentLabel} />
      ) : data.error ? (
        <div className="grid min-h-64 place-items-center px-6 text-center">
          <div>
            <p className="text-xs font-semibold">
              {ERROR_MESSAGES.unableToLoadContent}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">{data.error}</p>
          </div>
        </div>
      ) : (
        data.files.map(node => (
          <PackageFileTreeItem key={node.name} node={node} onCopy={onCopy} />
        ))
      )}
    </div>
    {isLoading && (
      <PackageLoadingSkeleton canCancel={isSearching} onCancel={onCancel} />
    )}
  </div>
)
