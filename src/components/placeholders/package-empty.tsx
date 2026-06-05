import { PACKAGE_VIEWER_TEXT } from '@/lib/config'

interface PackageEmptyProps {
  label: string
}

export const PackageEmpty = ({ label }: PackageEmptyProps) => (
  <div className="grid min-h-56 place-items-center px-6 text-center">
    <div>
      <p className="text-xs font-semibold">{label}</p>
      <p className="mt-1 max-w-56 text-[10px] leading-5 text-muted-foreground">
        {PACKAGE_VIEWER_TEXT.emptyPanelDescription}
      </p>
    </div>
  </div>
)
