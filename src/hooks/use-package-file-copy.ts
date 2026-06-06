import { useCallback, useState } from 'react'

import { trackFileUrlCopy } from '@/lib/analytics'
import { PACKAGE_VIEWER_CONFIG } from '@/lib/config'
import { formatCdnFileUrl, type CdnSource } from '@/lib/cdn-url'
import type { PackageType } from '@/lib/package-data'
import type { PackageViewData } from '@/lib/package-view-types'

interface UsePackageFileCopyOptions {
  activePackageView?: PackageViewData | null
  activeTab: PackageType
  source: CdnSource
}

export const usePackageFileCopy = ({
  activePackageView,
  activeTab,
  source,
}: UsePackageFileCopyOptions) => {
  const [copiedPath, setCopiedPath] = useState('')

  const copyFilePath = useCallback(
    (path: string) => {
      if (!activePackageView) {
        return
      }

      const url = formatCdnFileUrl({
        packageName: activePackageView.packageName,
        path,
        source,
        type: activeTab,
        version: activePackageView.selectedVersion,
      })

      void navigator.clipboard.writeText(url).then(() => {
        trackFileUrlCopy({
          filePath: path,
          packageName: activePackageView.packageName,
          packageType: activeTab,
          source,
          version: activePackageView.selectedVersion,
        })
        setCopiedPath(url)
        window.setTimeout(
          () => setCopiedPath(''),
          PACKAGE_VIEWER_CONFIG.clipboardResetDelayMs,
        )
      })
    },
    [activePackageView, activeTab, source],
  )

  return {
    copiedPath,
    copyFilePath,
  }
}
