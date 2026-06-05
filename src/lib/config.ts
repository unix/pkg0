import { GithubIcon, NpmIcon } from '@hugeicons/core-free-icons'

import type { CdnSource } from '@/lib/cdn-url'
import type { PackageType } from '@/lib/package-data'
import type { PackageViews } from '@/lib/package-view-types'

interface SourceOption {
  label: string
  value: CdnSource
}

interface TabOption {
  description: string
  icon: typeof NpmIcon
  label: string
  value: PackageType
}

const defaultInputValues: Record<PackageType, string> = {
  github: 'facebook/react',
  npm: 'react',
}

const emptyPackageViews: PackageViews = {
  github: null,
  npm: null,
}

const sourceOptions: SourceOption[] = [
  {
    label: 'cdn.jsdelivr.net',
    value: 'jsdelivr',
  },
  {
    label: 'unpkg',
    value: 'unpkg',
  },
]

const defaultTabOption: TabOption = {
  description: 'Explore any published package',
  icon: NpmIcon,
  label: 'npm package',
  value: 'npm',
}

const tabOptions: TabOption[] = [
  defaultTabOption,
  {
    description: 'Inspect a repository release',
    icon: GithubIcon,
    label: 'github tag',
    value: 'github',
  },
]

const checkedAtDateFormatOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
}

const publishedAtDateFormatOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}

const browserInteractionConfig: {
  abortErrorName: string
  selectedVersionBlock: ScrollLogicalPosition
  scrollBehavior: ScrollBehavior
  scrollTop: number
} = {
  abortErrorName: 'AbortError',
  selectedVersionBlock: 'center',
  scrollBehavior: 'smooth',
  scrollTop: 0,
}

export const PACKAGE_TYPES: Record<PackageType, PackageType> = {
  github: 'github',
  npm: 'npm',
}

export const CDN_SOURCES: Record<CdnSource, CdnSource> = {
  jsdelivr: 'jsdelivr',
  unpkg: 'unpkg',
}

export const PACKAGE_VIEWER_CONFIG = {
  clipboardResetDelayMs: 2400,
  defaultActiveTab: PACKAGE_TYPES.npm,
  defaultTabOption,
  defaultCdnSource: CDN_SOURCES.jsdelivr,
  defaultInputValues,
  emptyPackageViews,
  loadingOverlayRowCount: 9,
  loadingOverlayWidthBase: 72,
  loadingOverlayWidthModulo: 28,
  loadingOverlayWidthStep: 17,
  selectedVersionSelector: '[data-selected-version="true"]',
  browserInteraction: browserInteractionConfig,
  sourceOptions,
  tabOptions,
  versionBatchSize: 100,
}

export const PACKAGE_VIEWER_TEXT = {
  cancel: 'Cancel',
  copyToastPrefix: 'Copied',
  emptyFileContentLabel: 'No files loaded',
  emptyPanelDescription:
    'Search the current tab to load package versions and published files.',
  emptyVersionsLabel: 'No versions yet',
  fileActionHint: 'Click a file to copy',
  filePlaceholderPackage: 'package',
  filePlaceholderVersion: 'version',
  footerCdnNote: 'Files are served directly from the selected CDN.',
  githubRepoLabel: 'github.com/unix/pkg0',
  githubPlaceholder: 'username/repository_name',
  heroBadge: 'Browse packages without installing them',
  heroDescription:
    'Inspect every published version and copy production-ready CDN paths from a familiar file tree.',
  heroSubtitle: 'content viewer',
  heroTitle: 'npm/github package',
  loadMoreVersions: 'Load more',
  loadingSearch: 'Loading...',
  noPackageSelected: 'No package selected',
  npmPlaceholder: 'Enter a package name',
  packageSummaryGithubPrompt: 'Search a github repository to inspect content',
  packageSummaryNpmPrompt: 'Search a npm package to inspect content',
  removeSuggestionLabelPrefix: 'Remove',
  searchButton: 'Search',
  searchHistoryCheckedPrefix: 'checked',
  scrollToTop: 'scroll to top',
  topLevelItemsSuffix: 'top-level items',
  versionCountSuffix: 'versions',
  versionFallbackDateGithub: 'tag',
  versionFallbackDateNpm: 'version',
  versionsTitle: 'Versions',
}

export const PACKAGE_VIEWER_URLS = {
  githubRepo: 'https://github.com/unix/pkg0',
}

export const PACKAGE_DATA_CONFIG = {
  bytes: {
    bytesSuffix: 'B',
    kiloBytesSuffix: 'kB',
    megaBytesSuffix: 'MB',
    kiloThreshold: 1000,
    megaThreshold: 1000000,
  },
  api: {
    githubReposBase: 'https://api.github.com/repos',
    githubTagsPerPage: 100,
    npmRegistryBase: 'https://registry.npmjs.org',
  },
  cdn: {
    jsdelivrGithubBase: 'https://cdn.jsdelivr.net/gh',
    jsdelivrNpmBase: 'https://cdn.jsdelivr.net/npm',
    unpkgBase: 'https://unpkg.com',
  },
  dateFormat: {
    checkedAt: checkedAtDateFormatOptions,
    locale: 'en',
    publishedAt: publishedAtDateFormatOptions,
  },
  defaultPublishedDate: 'published',
  latestTag: 'latest',
  pathSeparator: '/',
  treeType: 'tree',
}

export const PACKAGE_URL_CONFIG = {
  searchPrefix: '?',
  paramNames: {
    query: 'q',
    repo: 'rep',
    type: 'type',
    version: 'version',
  },
}

export const SEARCH_HISTORY_CONFIG = {
  databaseName: 'package-viewer',
  maxEntries: 1000,
  namespacePrefix: 'search-history',
  suggestionLimit: 8,
}

export const INDEXED_DB_CONFIG = {
  indexNames: {
    namespaceCreatedAt: 'namespaceCreatedAt',
    namespaceUpdatedAt: 'namespaceUpdatedAt',
  },
  storeName: 'keyValueCache',
}

export const ERROR_MESSAGES = {
  githubFilesUnavailable: 'Could not load files for this tag.',
  githubRepositoryNotFound: 'Repository not found on GitHub.',
  githubTagsEmpty: 'This repository does not have any tags.',
  indexedDbUnavailable: 'IndexedDB is not available.',
  npmFilesUnavailable: 'Could not load files for this version.',
  npmPackageNotFound: 'Package not found on npm.',
  npmVersionsEmpty: 'This package does not have any published versions.',
  rootElementUnavailable: 'Root element is not available.',
  unknown: 'Something went wrong.',
  unableToLoadContent: 'Unable to load content',
}
