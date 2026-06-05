import {
  ArrowDown01Icon,
  Copy01Icon,
  File01Icon,
  Folder01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'

import { PACKAGE_DATA_CONFIG } from '@/lib/config'
import { formatBytes, type FileNode } from '@/lib/package-data'
import { cn } from '@/lib/utils'

interface PackageFileTreeItemProps {
  depth?: number
  node: FileNode
  onCopy: (path: string) => void
  parentPath?: string
}

export const PackageFileTreeItem = ({
  depth = 0,
  node,
  onCopy,
  parentPath = '',
}: PackageFileTreeItemProps) => {
  const [isOpen, setIsOpen] = useState(depth === 0)
  const isFolder = Boolean(node.children)
  const path = `${parentPath}${PACKAGE_DATA_CONFIG.pathSeparator}${node.name}`

  return (
    <div>
      <button
        type="button"
        className="group flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-xs transition-colors hover:bg-muted"
        style={{ paddingLeft: `${10 + depth * 20}px` }}
        onClick={() => {
          if (isFolder) {
            setIsOpen(value => !value)
            return
          }

          onCopy(path)
        }}>
        {isFolder ? (
          <>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              className={cn(
                'size-3 text-muted-foreground transition-transform',
                !isOpen && '-rotate-90',
              )}
            />
            <HugeiconsIcon icon={Folder01Icon} className="size-3.5 text-amber-500" />
          </>
        ) : (
          <>
            <span className="w-3" />
            <HugeiconsIcon
              icon={File01Icon}
              className="size-3.5 text-muted-foreground"
            />
          </>
        )}
        <span className="min-w-0 flex-1 truncate font-mono">{node.name}</span>
        {!isFolder && (
          <>
            <span className="text-[10px] text-muted-foreground">
              {formatBytes(node.size)}
            </span>
            <HugeiconsIcon
              icon={Copy01Icon}
              className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            />
          </>
        )}
      </button>
      {isFolder &&
        isOpen &&
        node.children?.map(child => (
          <PackageFileTreeItem
            key={child.name}
            depth={depth + 1}
            node={child}
            parentPath={path}
            onCopy={onCopy}
          />
        ))}
    </div>
  )
}
