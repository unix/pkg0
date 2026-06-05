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
    loadMoreVersions(activeTab)
  }, [activeTab, loadMoreVersions])

  const handleTabChange = useCallback(
    (tab: PackageType) => {
      setActiveTab(tab)

      if (tab === PACKAGE_TYPES.github) {
        setSource(CDN_SOURCES.jsdelivr)
      }

      refreshSuggestions(tab, inputValues[tab])
    },
    [inputValues, refreshSuggestions, setActiveTab, setSource],
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
    handleSourceChange: setSource,
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
