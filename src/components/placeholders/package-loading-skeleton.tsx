import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

import { Button } from '@/components/ui/button'
import { PACKAGE_VIEWER_CONFIG, PACKAGE_VIEWER_TEXT } from '@/lib/config'

interface PackageLoadingSkeletonProps {
  canCancel?: boolean
  onCancel?: () => void
}

export const PackageLoadingSkeleton = ({
  canCancel = false,
  onCancel,
}: PackageLoadingSkeletonProps) => (
  <div className="absolute inset-0 z-10 bg-background/75 p-3 backdrop-blur-[2px]">
    <div className="space-y-2">
      {Array.from(
        { length: PACKAGE_VIEWER_CONFIG.loadingOverlayRowCount },
        (_, index) => (
          <div
            key={index}
            className="h-8 animate-pulse rounded-md bg-muted"
            style={{
              width: `${
                PACKAGE_VIEWER_CONFIG.loadingOverlayWidthBase +
                ((index * PACKAGE_VIEWER_CONFIG.loadingOverlayWidthStep) %
                  PACKAGE_VIEWER_CONFIG.loadingOverlayWidthModulo)
              }%`,
            }}
          />
        ),
      )}
    </div>
    {canCancel && (
      <div className="absolute inset-0 grid place-items-center">
        <Button
          type="button"
          variant="secondary"
          className="h-7 rounded-full border bg-background/90 px-2.5 text-[10px] text-muted-foreground shadow-sm backdrop-blur hover:text-foreground"
          onClick={onCancel}>
          <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
          {PACKAGE_VIEWER_TEXT.cancel}
        </Button>
      </div>
    )}
  </div>
)
