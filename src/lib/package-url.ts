import { PACKAGE_TYPES, PACKAGE_URL_CONFIG } from '@/lib/config'
import type { PackageType } from '@/lib/package-data'

export interface PackageUrlState {
  name: string
  type: PackageType
  version?: string
}

export const parsePackageUrlState = (search: string): PackageUrlState | null => {
  const params = new URLSearchParams(search)
  const {
    query: queryParam,
    repo: repoParam,
    type: typeParam,
    version,
  } = PACKAGE_URL_CONFIG.paramNames
  const type = params.get(typeParam)
  const repo = params.get(repoParam)?.trim()
  const query = params.get(queryParam)?.trim()
  const activeType: PackageType =
    type === PACKAGE_TYPES.github || repo ? PACKAGE_TYPES.github : PACKAGE_TYPES.npm
  const name = activeType === 'github' ? repo || query : query

  if (!name) {
    return null
  }

  return {
    name,
    type: activeType,
    version: params.get(version)?.trim() || undefined,
  }
}

export const formatPackageUrlSearch = (
  type: PackageType,
  name: string,
  version: string,
) => {
  const params = new URLSearchParams()
  const {
    query: queryParam,
    repo: repoParam,
    type: typeParam,
    version: versionParam,
  } = PACKAGE_URL_CONFIG.paramNames
  params.set(queryParam, name)
  params.set(typeParam, type)

  if (type === PACKAGE_TYPES.github) {
    params.set(repoParam, name)
  }

  params.set(versionParam, version)
  return `${PACKAGE_URL_CONFIG.searchPrefix}${params.toString()}`
}
