import { useCallback, useEffect, useRef } from 'react'

import type { PackageType } from '@/lib/package-data'
import { formatPackageUrlSearch, parsePackageUrlState } from '@/lib/package-url'

interface UseInitialPackageLoadOptions {
  loadPackage: (type: PackageType, name: string, requestedVersion?: string) => void
}

export const usePackageUrlSync = () => {
  const syncPackageUrl = useCallback(
    (type: PackageType, name: string, version: string) => {
      window.history.replaceState(
        null,
        '',
        formatPackageUrlSearch(type, name, version),
      )
    },
    [],
  )

  return {
    syncPackageUrl,
  }
}

export const useInitialPackageLoad = ({
  loadPackage,
}: UseInitialPackageLoadOptions) => {
  const didLoadQueryRef = useRef(false)

  useEffect(() => {
    if (didLoadQueryRef.current) {
      return
    }

    const packageState = parsePackageUrlState(window.location.search)

    if (!packageState) {
      return
    }

    didLoadQueryRef.current = true
    queueMicrotask(() => {
      loadPackage(packageState.type, packageState.name, packageState.version)
    })
  }, [loadPackage])
}
