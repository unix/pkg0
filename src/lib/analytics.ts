import type { CdnSource } from '@/lib/cdn-url'
import type { PackageType } from '@/lib/package-data'

type AnalyticsValue = boolean | number | string | null | undefined
type AnalyticsParams = Record<string, AnalyticsValue>
type GtagParams = Record<string, boolean | number | string>

interface Gtag {
  (command: 'config', targetId: string, config?: GtagParams): void
  (command: 'event', eventName: string, params?: GtagParams): void
}

interface PackageAnalyticsOptions {
  packageName: string
  packageType: PackageType
  version?: string
}

interface TrackFileUrlCopyOptions extends PackageAnalyticsOptions {
  filePath: string
  source: CdnSource
}

interface TrackLoadMoreVersionsOptions extends PackageAnalyticsOptions {
  versionCount: number | null
  visibleVersionCount: number
}

interface TrackPackageSearchOptions {
  packageName: string
  packageType: PackageType
  requestedVersion?: string
}

interface TrackPackageSearchErrorOptions extends TrackPackageSearchOptions {
  errorMessage: string
}

interface TrackPackageSearchSuccessOptions extends PackageAnalyticsOptions {
  versionCount: number | null
}

interface TrackSourceChangeOptions {
  packageName?: string
  packageType: PackageType
  source: CdnSource
  version?: string
}

interface TrackTabChangeOptions {
  fromPackageType: PackageType
  packageType: PackageType
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

const cleanParams = (params: AnalyticsParams) => {
  const cleanedParams: GtagParams = {}

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return
    }

    cleanedParams[key] = value
  })

  return cleanedParams
}

const extensionFor = (path: string) => {
  const fileName = path.split('/').at(-1)

  if (!fileName?.includes('.')) {
    return 'none'
  }

  return fileName.split('.').at(-1)?.toLowerCase() || 'none'
}

const sendEvent = (eventName: string, params: AnalyticsParams = {}) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', eventName, cleanParams(params))
}

export const trackPageView = () => {
  if (typeof window === 'undefined') {
    return
  }

  sendEvent('page_view', {
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title,
  })
}

export const trackPackageSearch = ({
  packageName,
  packageType,
  requestedVersion,
}: TrackPackageSearchOptions) => {
  sendEvent('package_search', {
    package_name: packageName,
    package_type: packageType,
    requested_version: requestedVersion,
  })
}

export const trackPackageSearchSuccess = ({
  packageName,
  packageType,
  version,
  versionCount,
}: TrackPackageSearchSuccessOptions) => {
  sendEvent('package_search_success', {
    package_name: packageName,
    package_type: packageType,
    version,
    version_count: versionCount,
  })
}

export const trackPackageSearchError = ({
  errorMessage,
  packageName,
  packageType,
  requestedVersion,
}: TrackPackageSearchErrorOptions) => {
  sendEvent('package_search_error', {
    error_message: errorMessage,
    package_name: packageName,
    package_type: packageType,
    requested_version: requestedVersion,
  })
}

export const trackVersionSelect = ({
  packageName,
  packageType,
  version,
}: PackageAnalyticsOptions) => {
  sendEvent('version_select', {
    package_name: packageName,
    package_type: packageType,
    version,
  })
}

export const trackFileUrlCopy = ({
  filePath,
  packageName,
  packageType,
  source,
  version,
}: TrackFileUrlCopyOptions) => {
  sendEvent('file_url_copy', {
    file_extension: extensionFor(filePath),
    package_name: packageName,
    package_type: packageType,
    source,
    version,
  })
}

export const trackSourceChange = ({
  packageName,
  packageType,
  source,
  version,
}: TrackSourceChangeOptions) => {
  sendEvent('source_change', {
    package_name: packageName,
    package_type: packageType,
    source,
    version,
  })
}

export const trackTabChange = ({
  fromPackageType,
  packageType,
}: TrackTabChangeOptions) => {
  sendEvent('tab_change', {
    from_package_type: fromPackageType,
    package_type: packageType,
  })
}

export const trackLoadMoreVersions = ({
  packageName,
  packageType,
  version,
  versionCount,
  visibleVersionCount,
}: TrackLoadMoreVersionsOptions) => {
  sendEvent('load_more_versions', {
    package_name: packageName,
    package_type: packageType,
    version,
    version_count: versionCount,
    visible_version_count: visibleVersionCount,
  })
}
