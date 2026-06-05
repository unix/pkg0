import { useCallback, useEffect, useRef } from 'react'

import { PACKAGE_VIEWER_CONFIG } from '@/lib/config'

interface UseVersionScrollOptions {
  selectedVersion?: string
  visibleVersionCount?: number
}

export const useVersionScroll = ({
  selectedVersion,
  visibleVersionCount,
}: UseVersionScrollOptions) => {
  const shouldScrollToSelectedVersionRef = useRef(false)
  const versionsListRef = useRef<HTMLDivElement | null>(null)

  const requestSelectedVersionScroll = useCallback(() => {
    shouldScrollToSelectedVersionRef.current = true
  }, [])

  const scrollVersionsToTop = useCallback(() => {
    versionsListRef.current?.scrollTo({
      behavior: PACKAGE_VIEWER_CONFIG.browserInteraction.scrollBehavior,
      top: PACKAGE_VIEWER_CONFIG.browserInteraction.scrollTop,
    })
  }, [])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (!shouldScrollToSelectedVersionRef.current) {
        return
      }

      const selectedVersionButton = versionsListRef.current?.querySelector(
        PACKAGE_VIEWER_CONFIG.selectedVersionSelector,
      )

      selectedVersionButton?.scrollIntoView({
        behavior: PACKAGE_VIEWER_CONFIG.browserInteraction.scrollBehavior,
        block: PACKAGE_VIEWER_CONFIG.browserInteraction.selectedVersionBlock,
      })
      shouldScrollToSelectedVersionRef.current = false
    })

    return () => window.cancelAnimationFrame(frame)
  }, [selectedVersion, visibleVersionCount])

  return {
    requestSelectedVersionScroll,
    scrollVersionsToTop,
    versionsListRef,
  }
}
