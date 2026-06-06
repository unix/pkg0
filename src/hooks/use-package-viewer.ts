import { useCallback } from 'react'

import {
  useInitialPackageLoad,
  usePackageUrlSync,
} from '@/hooks/use-package-url-sync'
import { usePackageFileCopy } from '@/hooks/use-package-file-copy'
import { usePackageLoader } from '@/hooks/use-package-loader'
import { usePackageSearchInput } from '@/hooks/use-package-search-input'
import { usePackageViewerState } from '@/hooks/use-package-viewer-state'
import { useVersionScroll } from '@/hooks/use-version-scroll'
import {
  trackLoadMoreVersions,
  trackSourceChange,
  trackTabChange,
} from '@/lib/analytics'
import type { CdnSource } from '@/lib/cdn-url'
import { CDN_SOURCES, PACKAGE_TYPES } from '@/lib/config'
import type { PackageType } from '@/lib/package-data'

export const usePackageViewer = () => {
  const {
    activePackageView,
    activeTab,
    inputValue,
    inputValues,
    isLoading,
    isSearching,
    loadMoreVersions,
    selectedTab,
    setActiveTab,
    setInputValue,
    setLoadingType,
    setPackageError,
    setPackageView,
    setSource,
    setVersionFiles,
    source,
  } = usePackageViewerState()
  const versionScroll = useVersionScroll({
    selectedVersion: activePackageView?.selectedVersion,
    visibleVersionCount: activePackageView?.visibleVersionCount,
  })
  const { syncPackageUrl } = usePackageUrlSync()
  const packageLoader = usePackageLoader({
    activePackageView,
    activeTab,
    requestSelectedVersionScroll: versionScroll.requestSelectedVersionScroll,
    setActiveTab,
    setInputValue,
    setLoadingType,
    setPackageError,
    setPackageView,
    setSource,
    setVersionFiles,
    syncPackageUrl,
  })
  const {
    handleInputBlur,
    handleInputChange,
    handleInputFocus,
    handleRemoveSuggestion,
    handleSearch,
    handleSelectSuggestion,
    isInputFocused,
    refreshSuggestions,
    suggestions,
  } = usePackageSearchInput({
    activeTab,
    inputValue,
    loadPackage: packageLoader.loadPackage,
    setInputValue,
  })
  const fileCopy = usePackageFileCopy({
    activePackageView,
    activeTab,
    source,
  })

  useInitialPackageLoad({
    loadPackage: packageLoader.loadPackage,
  })

  const handleLoadMoreVersions = useCallback(() => {
    if (activePackageView) {
      trackLoadMoreVersions({
        packageName: activePackageView.packageName,
        packageType: activeTab,
        version: activePackageView.selectedVersion,
        versionCount: activePackageView.versionCount,
        visibleVersionCount: activePackageView.visibleVersionCount,
      })
    }

    loadMoreVersions(activeTab)
  }, [activePackageView, activeTab, loadMoreVersions])

  const handleTabChange = useCallback(
    (tab: PackageType) => {
      if (tab !== activeTab) {
        trackTabChange({
          fromPackageType: activeTab,
          packageType: tab,
        })
      }

      setActiveTab(tab)

      if (tab === PACKAGE_TYPES.github) {
        setSource(CDN_SOURCES.jsdelivr)
      }

      refreshSuggestions(tab, inputValues[tab])
    },
    [activeTab, inputValues, refreshSuggestions, setActiveTab, setSource],
  )

  const handleSourceChange = useCallback(
    (nextSource: CdnSource) => {
      if (nextSource !== source) {
        trackSourceChange({
          packageName: activePackageView?.packageName,
          packageType: activeTab,
          source: nextSource,
          version: activePackageView?.selectedVersion,
        })
      }

      setSource(nextSource)
    },
    [activePackageView, activeTab, setSource, source],
  )

  return {
    activePackageView,
    activeTab,
    copiedPath: fileCopy.copiedPath,
    handleCancel: packageLoader.cancelRequest,
    handleCopy: fileCopy.copyFilePath,
    handleInputBlur,
    handleInputChange,
    handleInputFocus,
    handleLoadMoreVersions,
    handleRemoveSuggestion,
    handleSearch,
    handleSelectSuggestion,
    handleSourceChange,
    handleTabChange,
    handleVersionChange: packageLoader.loadVersion,
    handleVersionsTitleClick: versionScroll.scrollVersionsToTop,
    inputValue,
    isInputFocused,
    isLoading,
    isSearching,
    selectedTab,
    source,
    suggestions,
    versionsListRef: versionScroll.versionsListRef,
  }
}
