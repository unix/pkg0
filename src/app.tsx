import { PageLayout } from '@/components/page-layout'
import { PackageCopyToast } from '@/components/package-viewer/package-copy-toast'
import { PackageSearchForm } from '@/components/package-viewer/package-search-form'
import { PackageSourceToggle } from '@/components/package-viewer/package-source-toggle'
import { PackageSummary } from '@/components/package-viewer/package-summary'
import { PackageTabs } from '@/components/package-viewer/package-tabs'
import { FileContentPanel } from '@/components/panels/file-content-panel'
import { PackageFooterPanel } from '@/components/panels/package-footer-panel'
import { PackageHeroPanel } from '@/components/panels/package-hero-panel'
import { VersionsPanel } from '@/components/panels/versions-panel'
import { usePackageViewer } from '@/hooks/use-package-viewer'

const App = () => {
  const packageViewer = usePackageViewer()

  return (
    <main className="min-h-svh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,oklch(0.97_0.025_260),transparent_68%)]" />
      <PageLayout className="relative py-10 sm:py-16">
        <PackageHeroPanel />

        <section className="relative left-1/2 w-screen max-w-4xl -translate-x-1/2 overflow-hidden rounded-2xl border bg-card shadow-[0_24px_80px_-36px_rgba(0,0,0,0.24)]">
          <PackageTabs
            activeTab={packageViewer.activeTab}
            disabled={packageViewer.isSearching}
            onSelect={packageViewer.handleTabChange}
          />

          <div className="p-4 sm:p-5">
            <PackageSearchForm
              activeTab={packageViewer.activeTab}
              inputValue={packageViewer.inputValue}
              isFocused={packageViewer.isInputFocused}
              isSearching={packageViewer.isSearching}
              selectedTab={packageViewer.selectedTab}
              suggestions={packageViewer.suggestions}
              onBlur={packageViewer.handleInputBlur}
              onChange={packageViewer.handleInputChange}
              onFocus={packageViewer.handleInputFocus}
              onRemoveSuggestion={packageViewer.handleRemoveSuggestion}
              onSelectSuggestion={packageViewer.handleSelectSuggestion}
              onSubmit={packageViewer.handleSearch}
            />

            <div className="mt-5 flex flex-col gap-3 border-y py-3 sm:flex-row sm:items-center sm:justify-between">
              <PackageSummary
                activeTab={packageViewer.activeTab}
                data={packageViewer.activePackageView}
              />
              <PackageSourceToggle
                activeTab={packageViewer.activeTab}
                disabled={packageViewer.isSearching}
                source={packageViewer.source}
                onChange={packageViewer.handleSourceChange}
              />
            </div>

            <div className="mt-4 grid grid-cols-1 overflow-hidden rounded-xl border sm:h-[570px] sm:grid-cols-[190px_1fr]">
              <VersionsPanel
                activeTab={packageViewer.activeTab}
                data={packageViewer.activePackageView}
                isSearching={packageViewer.isSearching}
                listRef={packageViewer.versionsListRef}
                onLoadMore={packageViewer.handleLoadMoreVersions}
                onSelect={packageViewer.handleVersionChange}
                onTitleClick={packageViewer.handleVersionsTitleClick}
              />
              <FileContentPanel
                data={packageViewer.activePackageView}
                isLoading={packageViewer.isLoading}
                isSearching={packageViewer.isSearching}
                onCancel={packageViewer.handleCancel}
                onCopy={packageViewer.handleCopy}
              />
            </div>
          </div>
        </section>

        <PackageFooterPanel />
      </PageLayout>

      <PackageCopyToast copiedPath={packageViewer.copiedPath} />
    </main>
  )
}

export default App
