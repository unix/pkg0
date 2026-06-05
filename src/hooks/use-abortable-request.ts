import { useCallback, useRef } from 'react'

import { PACKAGE_VIEWER_CONFIG } from '@/lib/config'
import type { LoadingType } from '@/lib/package-view-types'

interface UseAbortableRequestOptions {
  setLoadingType: (loadingType: LoadingType | null) => void
}

export const useAbortableRequest = ({
  setLoadingType,
}: UseAbortableRequestOptions) => {
  const requestRef = useRef<AbortController | null>(null)

  const cancelRequest = useCallback(() => {
    requestRef.current?.abort()
    requestRef.current = null
    setLoadingType(null)
  }, [setLoadingType])

  const finishRequest = useCallback(
    (controller: AbortController) => {
      if (requestRef.current !== controller) {
        return
      }

      requestRef.current = null
      setLoadingType(null)
    },
    [setLoadingType],
  )

  const isAbortError = useCallback(
    (error: unknown) =>
      error instanceof Error &&
      error.name === PACKAGE_VIEWER_CONFIG.browserInteraction.abortErrorName,
    [],
  )

  const startRequest = useCallback(
    (loadingType: LoadingType) => {
      requestRef.current?.abort()
      const controller = new AbortController()
      requestRef.current = controller
      setLoadingType(loadingType)

      return controller
    },
    [setLoadingType],
  )

  return {
    cancelRequest,
    finishRequest,
    isAbortError,
    startRequest,
  }
}
