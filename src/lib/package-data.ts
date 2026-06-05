import {
  ERROR_MESSAGES,
  PACKAGE_DATA_CONFIG,
  PACKAGE_TYPES,
  PACKAGE_VIEWER_TEXT,
} from '@/lib/config'

export type PackageType = 'github' | 'npm'

export interface FileNode {
  children?: FileNode[]
  name: string
  size?: number | string
}

export interface VersionItem {
  date: string
  label: string
  tag?: string
}

interface PackageResult {
  files: FileNode[]
  selectedVersion: string
  versionCount: number | null
  versions: VersionItem[]
}

interface PackageFileRecord {
  path: string
  size?: number
  type?: string
}

interface GithubTagRecord {
  name: string
}

interface NpmPackageRecord {
  'dist-tags': {
    latest?: string
  }
  time?: Record<string, string>
  versions: Record<string, unknown>
}

const isObjectRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isPackageFileRecord = (value: unknown): value is PackageFileRecord => {
  if (!isObjectRecord(value) || typeof value.path !== 'string') {
    return false
  }

  const hasValidSize =
    typeof value.size === 'number' || typeof value.size === 'undefined'
  const hasValidType =
    typeof value.type === 'string' || typeof value.type === 'undefined'

  return hasValidSize && hasValidType
}

const isGithubTagRecord = (value: unknown): value is GithubTagRecord =>
  isObjectRecord(value) && typeof value.name === 'string'

const isNpmPackageRecord = (value: unknown): value is NpmPackageRecord => {
  if (!isObjectRecord(value) || !isObjectRecord(value.versions)) {
    return false
  }

  const distTags = value['dist-tags']
  const time = value.time

  if (!isObjectRecord(distTags)) {
    return false
  }

  if (
    typeof distTags.latest !== 'string' &&
    typeof distTags.latest !== 'undefined'
  ) {
    return false
  }

  return typeof time === 'undefined' || isObjectRecord(time)
}

const readNpmFilesResponse = (value: unknown) => {
  if (!isObjectRecord(value) || !Array.isArray(value.files)) {
    return []
  }

  return value.files.filter(isPackageFileRecord)
}

const readGithubFilesResponse = (value: unknown) => {
  if (!isObjectRecord(value) || !Array.isArray(value.tree)) {
    return []
  }

  return value.tree.filter(isPackageFileRecord)
}

const readGithubTagsResponse = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(isGithubTagRecord)
}

const readNpmPackageResponse = (value: unknown) => {
  if (!isNpmPackageRecord(value)) {
    return null
  }

  return value
}

const buildFileTree = (files: PackageFileRecord[]): FileNode[] => {
  const root: FileNode[] = []

  files.forEach(file => {
    const parts = file.path.split(PACKAGE_DATA_CONFIG.pathSeparator).filter(Boolean)
    let currentLevel = root

    parts.forEach((part, index) => {
      const isLastPart = index === parts.length - 1
      let node = currentLevel.find(item => item.name === part)

      if (!node) {
        node = {
          name: part,
          ...(isLastPart && file.type !== PACKAGE_DATA_CONFIG.treeType
            ? { size: file.size ?? 0 }
            : { children: [] }),
        }
        currentLevel.push(node)
      }

      if (node.children) {
        currentLevel = node.children
      }
    })
  })

  const sortLevel = (nodes: FileNode[]) => {
    nodes.sort((left, right) => {
      if (Boolean(left.children) !== Boolean(right.children)) {
        return left.children ? -1 : 1
      }

      return left.name.localeCompare(right.name)
    })
    nodes.forEach(node => node.children && sortLevel(node.children))
  }

  sortLevel(root)
  return root
}

const formatDate = (date?: string) => {
  if (!date) {
    return PACKAGE_DATA_CONFIG.defaultPublishedDate
  }

  return new Intl.DateTimeFormat(
    PACKAGE_DATA_CONFIG.dateFormat.locale,
    PACKAGE_DATA_CONFIG.dateFormat.publishedAt,
  ).format(new Date(date))
}

const fetchNpmFiles = async (
  name: string,
  version: string,
  signal?: AbortSignal,
) => {
  const response = await fetch(
    `${PACKAGE_DATA_CONFIG.cdn.unpkgBase}/${name}@${version}/?meta`,
    { signal },
  )

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.npmFilesUnavailable)
  }

  return buildFileTree(readNpmFilesResponse(await response.json()))
}

const fetchGithubFiles = async (
  name: string,
  version: string,
  signal?: AbortSignal,
) => {
  const response = await fetch(
    `${PACKAGE_DATA_CONFIG.api.githubReposBase}/${name}/git/trees/${encodeURIComponent(version)}?recursive=1`,
    { signal },
  )

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.githubFilesUnavailable)
  }

  return buildFileTree(readGithubFilesResponse(await response.json()))
}

export const formatBytes = (size: number | string = 0) => {
  if (typeof size === 'string') {
    return size
  }

  if (size < PACKAGE_DATA_CONFIG.bytes.kiloThreshold) {
    return `${size} ${PACKAGE_DATA_CONFIG.bytes.bytesSuffix}`
  }

  if (size < PACKAGE_DATA_CONFIG.bytes.megaThreshold) {
    return `${(size / PACKAGE_DATA_CONFIG.bytes.kiloThreshold).toFixed(1)} ${PACKAGE_DATA_CONFIG.bytes.kiloBytesSuffix}`
  }

  return `${(size / PACKAGE_DATA_CONFIG.bytes.megaThreshold).toFixed(1)} ${PACKAGE_DATA_CONFIG.bytes.megaBytesSuffix}`
}

export const fetchPackageVersion = async (
  type: PackageType,
  name: string,
  version: string,
  signal?: AbortSignal,
) => {
  if (type === PACKAGE_TYPES.npm) {
    return fetchNpmFiles(name, version, signal)
  }

  return fetchGithubFiles(name, version, signal)
}

export const fetchPackage = async (
  type: PackageType,
  name: string,
  signal?: AbortSignal,
): Promise<PackageResult> => {
  if (type === PACKAGE_TYPES.github) {
    const response = await fetch(
      `${PACKAGE_DATA_CONFIG.api.githubReposBase}/${name}/tags?per_page=${PACKAGE_DATA_CONFIG.api.githubTagsPerPage}`,
      { signal },
    )

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.githubRepositoryNotFound)
    }

    const tags = readGithubTagsResponse(await response.json())

    if (!tags.length) {
      throw new Error(ERROR_MESSAGES.githubTagsEmpty)
    }

    const selectedVersion = tags[0].name
    const versions = tags.map((tag, index) => ({
      date: PACKAGE_VIEWER_TEXT.versionFallbackDateGithub,
      label: tag.name,
      ...(index === 0 ? { tag: PACKAGE_DATA_CONFIG.latestTag } : {}),
    }))
    const files = await fetchGithubFiles(name, selectedVersion, signal)

    return { files, selectedVersion, versionCount: null, versions }
  }

  const response = await fetch(
    `${PACKAGE_DATA_CONFIG.api.npmRegistryBase}/${encodeURIComponent(name)}`,
    { signal },
  )

  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.npmPackageNotFound)
  }

  const data = readNpmPackageResponse(await response.json())

  if (!data) {
    throw new Error(ERROR_MESSAGES.npmPackageNotFound)
  }

  const selectedVersion =
    data['dist-tags'].latest ?? Object.keys(data.versions).at(-1)

  if (!selectedVersion) {
    throw new Error(ERROR_MESSAGES.npmVersionsEmpty)
  }

  const versions = Object.keys(data.versions)
    .sort((left, right) => {
      const leftTime = data.time?.[left] ?? ''
      const rightTime = data.time?.[right] ?? ''
      return rightTime.localeCompare(leftTime)
    })
    .map(version => ({
      date: formatDate(data.time?.[version]),
      label: version,
      ...(version === selectedVersion ? { tag: PACKAGE_DATA_CONFIG.latestTag } : {}),
    }))
  const files = await fetchNpmFiles(name, selectedVersion, signal)

  return {
    files,
    selectedVersion,
    versionCount: versions.length,
    versions,
  }
}
