import type { FileNode, PackageType, VersionItem } from '@/lib/package-data'

export type LoadingType = 'search' | 'version'

export interface PackageViewData {
  error?: string
  files: FileNode[]
  packageName: string
  selectedVersion: string
  versionCount: number | null
  versionItems: VersionItem[]
  visibleVersionCount: number
}

export type PackageViews = Record<PackageType, PackageViewData | null>
