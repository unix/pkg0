import { PACKAGE_VIEWER_TEXT } from '@/lib/config'

export const PackageHeroPanel = () => (
  <header className="mb-10 text-center sm:mb-12">
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-xs backdrop-blur">
      <span className="size-1.5 rounded-full bg-emerald-500" />
      {PACKAGE_VIEWER_TEXT.heroBadge}
    </div>
    <h1 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
      {PACKAGE_VIEWER_TEXT.heroTitle}
      <span className="block text-muted-foreground">
        {PACKAGE_VIEWER_TEXT.heroSubtitle}
      </span>
    </h1>
    <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
      {PACKAGE_VIEWER_TEXT.heroDescription}
    </p>
  </header>
)
