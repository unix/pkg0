import { useCallback, useMemo, useReducer } from 'react'

import { PACKAGE_VIEWER_CONFIG } from '@/lib/config'
import type { CdnSource } from '@/lib/cdn-url'
import type { FileNode, PackageType } from '@/lib/package-data'
import {
  initialPackageViewerState,
  packageViewerReducer,
} from '@/lib/package-viewer-reducer'
import type { LoadingType, PackageViewData } from '@/lib/package-view-types'

export const usePackageViewerState = () => {
  const [state, dispatch] = useReducer(
    packageViewerReducer,
    initialPackageViewerState,
  )
  const activePackageView = state.packageViews[state.activeTab]
  const inputValue = state.inputValues[state.activeTab]
  const isLoading = state.loadingType !== null
  const isSearching = state.loadingType === 'search'
  const selectedTab = useMemo(
    () =>
      PACKAGE_VIEWER_CONFIG.tabOptions.find(tab => tab.value === state.activeTab) ??
      PACKAGE_VIEWER_CONFIG.defaultTabOption,
    [state.activeTab],
  )

  const loadMoreVersions = useCallback((packageType: PackageType) => {
    dispatch({ kind: 'load-more-versions', packageType })
  }, [])

  const setActiveTab = useCallback((activeTab: PackageType) => {
    dispatch({ activeTab, kind: 'set-active-tab' })
  }, [])

  const setInputValue = useCallback((packageType: PackageType, value: string) => {
    dispatch({ kind: 'set-input-value', packageType, value })
  }, [])

  const setLoadingType = useCallback((loadingType: LoadingType | null) => {
    dispatch({ kind: 'set-loading-type', loadingType })
  }, [])

  const setPackageError = useCallback(
    (packageType: PackageType, packageName: string, error: string) => {
      dispatch({
        error,
        kind: 'set-package-error',
        packageName,
        packageType,
      })
    },
    [],
  )

  const setPackageView = useCallback(
    (packageType: PackageType, view: PackageViewData) => {
      dispatch({ kind: 'set-package-view', packageType, view })
    },
    [],
  )

  const setSource = useCallback((source: CdnSource) => {
    dispatch({ kind: 'set-source', source })
  }, [])

  const setVersionFiles = useCallback(
    (packageType: PackageType, version: string, files: FileNode[]) => {
      dispatch({
        files,
        kind: 'set-version-files',
        packageType,
        version,
      })
    },
    [],
  )

  return {
    activePackageView,
    activeTab: state.activeTab,
    inputValue,
    inputValues: state.inputValues,
    isLoading,
    isSearching,
    selectedTab,
    setActiveTab,
    setInputValue,
    setLoadingType,
    setPackageError,
    setPackageView,
    setSource,
    setVersionFiles,
    source: state.source,
    loadMoreVersions,
  }
}
