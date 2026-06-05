import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: ReactNode
  className?: string
}

const PageLayout = ({ children, className }: PageLayoutProps) => (
  <div className={cn('mx-auto w-full max-w-3xl px-4 sm:px-6', className)}>
    {children}
  </div>
)

export { PageLayout }
