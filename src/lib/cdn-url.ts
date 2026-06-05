import { PACKAGE_DATA_CONFIG } from '@/lib/config'
import type { PackageType } from '@/lib/package-data'

export type CdnSource = 'jsdelivr' | 'unpkg'

interface FormatCdnFileUrlOptions {
  packageName: string
  path: string
  source: CdnSource
  type: PackageType
  version: string
}

export const formatCdnFileUrl = ({
  packageName,
  path,
  source,
  type,
  version,
}: FormatCdnFileUrlOptions) => {
  const { cdn, pathSeparator } = PACKAGE_DATA_CONFIG
  const filePath = path.startsWith(pathSeparator) ? path : `${pathSeparator}${path}`

  if (type === 'github') {
    return `${cdn.jsdelivrGithubBase}/${packageName}@${version}${filePath}`
  }

  if (source === 'jsdelivr') {
    return `${cdn.jsdelivrNpmBase}/${packageName}@${version}${filePath}`
  }

  return `${cdn.unpkgBase}/${packageName}@${version}${filePath}`
}
