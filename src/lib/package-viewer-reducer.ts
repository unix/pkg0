import { PACKAGE_VIEWER_CONFIG } from '@/lib/config'
import type { CdnSource } from '@/lib/cdn-url'
import type { FileNode, PackageType } from '@/lib/package-data'
import { emptyPackageView } from '@/lib/package-viewer-service'
import type {
  LoadingType,
  PackageViewData,
  PackageViews,
} from '@/lib/package-view-types'

export interface PackageViewerState {
  activeTab: PackageType
  inputValues: Record<PackageType, string>
  loadingType: LoadingType | null
  packageViews: PackageViews
  source: CdnSource
}

export type PackageViewerAction =
  | { kind: 'load-more-versions'; packageType: PackageType }
  | { kind: 'set-active-tab'; activeTab: PackageType }
  | { kind: 'set-input-value'; packageType: PackageType; value: string }
  | { kind: 'set-loading-type'; loadingType: LoadingType | null }
  | {
      kind: 'set-package-error'
      error: string
      packageName: string
      packageType: PackageType
    }
  | { kind: 'set-package-view'; packageType: PackageType; view: PackageViewData }
  | { kind: 'set-source'; source: CdnSource }
  | {
      files: FileNode[]
      kind: 'set-version-files'
      packageType: PackageType
      version: string
    }

export const initialPackageViewerState: PackageViewerState = {
  activeTab: PACKAGE_VIEWER_CONFIG.defaultActiveTab,
  inputValues: PACKAGE_VIEWER_CONFIG.defaultInputValues,
  loadingType: null,
  packageViews: PACKAGE_VIEWER_CONFIG.emptyPackageViews,
  source: PACKAGE_VIEWER_CONFIG.defaultCdnSource,
}

export const packageViewerReducer = (
  state: PackageViewerState,
  action: PackageViewerAction,
): PackageViewerState => {
  if (action.kind === 'set-active-tab') {
    return {
      ...state,
      activeTab: action.activeTab,
    }
  }

  if (action.kind === 'set-input-value') {
    return {
      ...state,
      inputValues: {
        ...state.inputValues,
        [action.packageType]: action.value,
      },
    }
  }

  if (action.kind === 'set-loading-type') {
    return {
      ...state,
      loadingType: action.loadingType,
    }
  }

  if (action.kind === 'set-package-error') {
    const currentView =
      state.packageViews[action.packageType] ?? emptyPackageView(action.packageName)

    return {
      ...state,
      packageViews: {
        ...state.packageViews,
        [action.packageType]: {
          ...currentView,
          error: action.error,
          packageName: action.packageName,
        },
      },
    }
  }

  if (action.kind === 'set-package-view') {
    return {
      ...state,
      packageViews: {
        ...state.packageViews,
        [action.packageType]: action.view,
      },
    }
  }

  if (action.kind === 'set-source') {
    return {
      ...state,
      source: action.source,
    }
  }

  if (action.kind === 'set-version-files') {
    const currentView = state.packageViews[action.packageType]

    if (!currentView) {
      return state
    }

    return {
      ...state,
      packageViews: {
        ...state.packageViews,
        [action.packageType]: {
          ...currentView,
          error: undefined,
          files: action.files,
          selectedVersion: action.version,
        },
      },
    }
  }

  const currentView = state.packageViews[action.packageType]

  if (!currentView) {
    return state
  }

  return {
    ...state,
    packageViews: {
      ...state.packageViews,
      [action.packageType]: {
        ...currentView,
        visibleVersionCount: Math.min(
          currentView.visibleVersionCount + PACKAGE_VIEWER_CONFIG.versionBatchSize,
          currentView.versionItems.length,
        ),
      },
    },
  }
}
