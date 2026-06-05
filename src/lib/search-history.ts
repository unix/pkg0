import { SEARCH_HISTORY_CONFIG } from '@/lib/config'
import { indexedDBCache } from '@/lib/indexed-db-cache'
import type { PackageType } from '@/lib/package-data'

export interface SearchHistorySuggestion {
  checkedAt: number
  query: string
  versionCount: number | null
}

interface SearchHistoryRecord {
  checkedAt: number
  query: string
  versionCount: number | null
}

const normalize = (query: string) => query.trim()
const cacheByType = new Map<
  PackageType,
  ReturnType<typeof indexedDBCache.create<SearchHistoryRecord>>
>()

const cacheFor = (type: PackageType) => {
  const existing = cacheByType.get(type)

  if (existing) {
    return existing
  }

  const cache = indexedDBCache.create<SearchHistoryRecord>({
    databaseName: SEARCH_HISTORY_CONFIG.databaseName,
    maxEntries: SEARCH_HISTORY_CONFIG.maxEntries,
    namespace: `${SEARCH_HISTORY_CONFIG.namespacePrefix}:${type}`,
  })
  cacheByType.set(type, cache)

  return cache
}

const safeRun = async <T>(task: () => Promise<T>, fallback: T) => {
  try {
    return await task()
  } catch {
    return fallback
  }
}

const matchScore = (candidate: string, value: string) => {
  const normalizedCandidate = candidate.toLowerCase()
  const normalizedValue = value.toLowerCase()

  if (!normalizedValue) {
    return 1
  }

  if (normalizedCandidate.startsWith(normalizedValue)) {
    return 2
  }

  if (normalizedCandidate.includes(normalizedValue)) {
    return 1
  }

  return 0
}

const remove = async (type: PackageType, query: string) => {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) {
    return
  }

  await safeRun(
    () => cacheFor(type).remove(normalizedQuery.toLowerCase()),
    undefined,
  )
}

const save = async ({
  query,
  type,
  versionCount,
}: {
  query: string
  type: PackageType
  versionCount: number | null
}) => {
  const normalizedQuery = normalize(query)

  if (!normalizedQuery) {
    return
  }

  await safeRun(
    () =>
      cacheFor(type).set(normalizedQuery.toLowerCase(), {
        checkedAt: Date.now(),
        query: normalizedQuery,
        versionCount,
      }),
    undefined,
  )
}

const suggestions = async (type: PackageType, query: string) => {
  const records = await safeRun(() => cacheFor(type).list(), [])
  const normalizedQuery = normalize(query)

  return records
    .map(record => ({
      checkedAt: record.value.checkedAt ?? record.updatedAt,
      query: record.value.query,
      score: matchScore(record.value.query, normalizedQuery),
      updatedAt: record.updatedAt,
      versionCount: record.value.versionCount ?? null,
    }))
    .filter(record => record.score > 0)
    .sort(
      (left, right) => right.score - left.score || right.updatedAt - left.updatedAt,
    )
    .slice(0, SEARCH_HISTORY_CONFIG.suggestionLimit)
    .map(record => ({
      checkedAt: record.checkedAt,
      query: record.query,
      versionCount: record.versionCount,
    }))
}

export const searchHistory = {
  remove,
  save,
  suggestions,
}
