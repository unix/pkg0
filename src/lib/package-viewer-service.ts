import {
  PACKAGE_TYPES,
  PACKAGE_VIEWER_CONFIG,
  PACKAGE_VIEWER_TEXT,
} from '@/lib/config'
import {
  fetchPackage,
  fetchPackageVersion,
  type FileNode,
  type PackageType,
  type VersionItem,
} from '@/lib/package-data'
import type { PackageViewData } from '@/lib/package-view-types'

interface LoadPackageViewOptions {
  name: string
  requestedVersion?: string
  signal?: AbortSignal
  type: PackageType
}

interface LoadPackageVersionFilesOptions {
  name: string
  signal?: AbortSignal
  type: PackageType
  version: string
}

export const emptyPackageView = (packageName: string): PackageViewData => ({
  files: [],
  packageName,
  selectedVersion: '',
  versionCount: null,
  versionItems: [],
  visibleVersionCount: PACKAGE_VIEWER_CONFIG.versionBatchSize,
})

export const visibleVersionCountFor = (
  versionItems: VersionItem[],
  selectedVersion: string,
) => {
  const selectedIndex = versionItems.findIndex(
    version => version.label === selectedVersion,
  )

  if (selectedIndex < PACKAGE_VIEWER_CONFIG.versionBatchSize) {
    return PACKAGE_VIEWER_CONFIG.versionBatchSize
  }

  return (
    Math.ceil((selectedIndex + 1) / PACKAGE_VIEWER_CONFIG.versionBatchSize) *
    PACKAGE_VIEWER_CONFIG.versionBatchSize
  )
}

const fallbackVersionItemFor = (
  type: PackageType,
  selectedVersion: string,
): VersionItem => ({
  date:
    type === PACKAGE_TYPES.github
      ? PACKAGE_VIEWER_TEXT.versionFallbackDateGithub
      : PACKAGE_VIEWER_TEXT.versionFallbackDateNpm,
  label: selectedVersion,
})

const mergeSelectedVersion = (
  type: PackageType,
  selectedVersion: string,
  versionItems: VersionItem[],
) => {
  if (versionItems.some(version => version.label === selectedVersion)) {
    return versionItems
  }

  return [fallbackVersionItemFor(type, selectedVersion)].concat(versionItems)
}

export const loadPackageView = async ({
  name,
  requestedVersion,
  signal,
  type,
}: LoadPackageViewOptions) => {
  const result = await fetchPackage(type, name, signal)
  const selectedVersion = requestedVersion || result.selectedVersion
  const files = requestedVersion
    ? await fetchPackageVersion(type, name, requestedVersion, signal)
    : result.files
  const versionItems = mergeSelectedVersion(type, selectedVersion, result.versions)

  return {
    files,
    packageName: name,
    selectedVersion,
    versionCount: result.versionCount,
    versionItems,
    visibleVersionCount: visibleVersionCountFor(versionItems, selectedVersion),
  }
}

export const loadPackageVersionFiles = async ({
  name,
  signal,
  type,
  version,
}: LoadPackageVersionFilesOptions): Promise<FileNode[]> =>
  fetchPackageVersion(type, name, version, signal)
