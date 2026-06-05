import { useCallback } from 'react'

import { useAbortableRequest } from '@/hooks/use-abortable-request'
import { CDN_SOURCES, ERROR_MESSAGES, PACKAGE_TYPES } from '@/lib/config'
import type { CdnSource } from '@/lib/cdn-url'
import type { FileNode, PackageType } from '@/lib/package-data'
import {
  loadPackageVersionFiles,
  loadPackageView,
} from '@/lib/package-viewer-service'
import type { LoadingType, PackageViewData } from '@/lib/package-view-types'
import { searchHistory } from '@/lib/search-history'

interface UsePackageLoaderOptions {
  activePackageView?: PackageViewData | null
  activeTab: PackageType
  requestSelectedVersionScroll: () => void
  setActiveTab: (activeTab: PackageType) => void
  setInputValue: (packageType: PackageType, value: string) => void
  setLoadingType: (loadingType: LoadingType | null) => void
  setPackageError: (
    packageType: PackageType,
    packageName: string,
    error: string,
  ) => void
  setPackageView: (packageType: PackageType, view: PackageViewData) => void
  setSource: (source: CdnSource) => void
  setVersionFiles: (
    packageType: PackageType,
    version: string,
    files: FileNode[],
  ) => void
  syncPackageUrl: (type: PackageType, name: string, version: string) => void
}

export const usePackageLoader = ({
  activePackageView,
  activeTab,
  requestSelectedVersionScroll,
  setActiveTab,
  setInputValue,
  setLoadingType,
  setPackageError,
  setPackageView,
  setSource,
  setVersionFiles,
  syncPackageUrl,
}: UsePackageLoaderOptions) => {
  const { cancelRequest, finishRequest, isAbortError, startRequest } =
    useAbortableRequest({
      setLoadingType,
    })

  const loadPackage = useCallback(
    async (type: PackageType, name: string, requestedVersion?: string) => {
      const controller = startRequest('search')
      setActiveTab(type)

      if (type === PACKAGE_TYPES.github) {
        setSource(CDN_SOURCES.jsdelivr)
      }

      try {
        const view = await loadPackageView({
          name,
          requestedVersion,
          signal: controller.signal,
          type,
        })

        setInputValue(type, name)
        requestSelectedVersionScroll()
        setPackageView(type, view)
        syncPackageUrl(type, name, view.selectedVersion)
        void searchHistory.save({
          query: name,
          type,
          versionCount: view.versionCount,
        })
      } catch (error) {
        if (isAbortError(error)) {
          return
        }

        setPackageError(
          type,
          name,
          error instanceof Error ? error.message : ERROR_MESSAGES.unknown,
        )
      } finally {
        finishRequest(controller)
      }
    },
    [
      finishRequest,
      isAbortError,
      requestSelectedVersionScroll,
      setActiveTab,
      setInputValue,
      setPackageError,
      setPackageView,
      setSource,
      startRequest,
      syncPackageUrl,
    ],
  )

  const loadVersion = useCallback(
    (version: string) => {
      if (!activePackageView) {
        return
      }

      const controller = startRequest('version')

      void loadPackageVersionFiles({
        name: activePackageView.packageName,
        signal: controller.signal,
        type: activeTab,
        version,
      })
        .then(files => {
          setVersionFiles(activeTab, version, files)
          syncPackageUrl(activeTab, activePackageView.packageName, version)
        })
        .catch(error => {
          if (isAbortError(error)) {
            return
          }

          setPackageError(
            activeTab,
            activePackageView.packageName,
            error instanceof Error ? error.message : ERROR_MESSAGES.unknown,
          )
        })
        .finally(() => finishRequest(controller))
    },
    [
      activePackageView,
      activeTab,
      finishRequest,
      isAbortError,
      setPackageError,
      setVersionFiles,
      startRequest,
      syncPackageUrl,
    ],
  )

  return {
    cancelRequest,
    loadPackage,
    loadVersion,
  }
}
