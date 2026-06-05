import { ERROR_MESSAGES, INDEXED_DB_CONFIG } from '@/lib/config'

interface IndexedDBCacheOptions {
  databaseName: string
  maxEntries: number
  namespace: string
}

interface CacheRecord<T> {
  createdAt: number
  key: string
  namespace: string
  updatedAt: number
  value: T
}

const DB_VERSION = 1

const requestToPromise = <T>(request: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const openDatabase = (databaseName: string) =>
  new Promise<IDBDatabase>((resolve, reject) => {
    if (!globalThis.indexedDB) {
      reject(new Error(ERROR_MESSAGES.indexedDbUnavailable))
      return
    }

    const request = globalThis.indexedDB.open(databaseName, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      const store = db.objectStoreNames.contains(INDEXED_DB_CONFIG.storeName)
        ? request.transaction?.objectStore(INDEXED_DB_CONFIG.storeName)
        : db.createObjectStore(INDEXED_DB_CONFIG.storeName, { keyPath: 'key' })

      if (!store) {
        return
      }

      if (
        !store.indexNames.contains(INDEXED_DB_CONFIG.indexNames.namespaceCreatedAt)
      ) {
        store.createIndex(INDEXED_DB_CONFIG.indexNames.namespaceCreatedAt, [
          'namespace',
          'createdAt',
        ])
      }

      if (
        !store.indexNames.contains(INDEXED_DB_CONFIG.indexNames.namespaceUpdatedAt)
      ) {
        store.createIndex(INDEXED_DB_CONFIG.indexNames.namespaceUpdatedAt, [
          'namespace',
          'updatedAt',
        ])
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const namespaceRange = (namespace: string) =>
  IDBKeyRange.bound([namespace, 0], [namespace, Number.MAX_SAFE_INTEGER])

const deleteOldest = ({
  deleteCount,
  index,
  namespace,
}: {
  deleteCount: number
  index: IDBIndex
  namespace: string
}) =>
  new Promise<void>((resolve, reject) => {
    if (deleteCount <= 0) {
      resolve()
      return
    }

    let remaining = deleteCount
    const request = index.openCursor(namespaceRange(namespace))
    request.onsuccess = () => {
      const cursor = request.result

      if (!cursor || remaining <= 0) {
        resolve()
        return
      }

      const deleteRequest = cursor.delete()
      deleteRequest.onsuccess = () => {
        remaining -= 1
        cursor.continue()
      }
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }
    request.onerror = () => reject(request.error)
  })

const create = <T>({
  databaseName,
  maxEntries,
  namespace,
}: IndexedDBCacheOptions) => {
  const fullKey = (key: string) => `${namespace}:${key}`

  const getStore = async (mode: IDBTransactionMode) => {
    const db = await openDatabase(databaseName)
    const transaction = db.transaction(INDEXED_DB_CONFIG.storeName, mode)

    return {
      db,
      store: transaction.objectStore(INDEXED_DB_CONFIG.storeName),
    }
  }

  const prune = async () => {
    const { db, store } = await getStore('readwrite')

    try {
      const index = store.index(INDEXED_DB_CONFIG.indexNames.namespaceCreatedAt)
      const count = await requestToPromise(index.count(namespaceRange(namespace)))
      await deleteOldest({
        deleteCount: count - maxEntries,
        index,
        namespace,
      })
    } finally {
      db.close()
    }
  }

  const list = async () => {
    const { db, store } = await getStore('readonly')

    try {
      const index = store.index(INDEXED_DB_CONFIG.indexNames.namespaceUpdatedAt)
      const records = await requestToPromise<CacheRecord<T>[]>(
        index.getAll(namespaceRange(namespace)),
      )

      return records.sort((left, right) => right.updatedAt - left.updatedAt)
    } finally {
      db.close()
    }
  }

  const remove = async (key: string) => {
    const { db, store } = await getStore('readwrite')

    try {
      await requestToPromise(store.delete(fullKey(key)))
    } finally {
      db.close()
    }
  }

  const set = async (key: string, value: T) => {
    const now = Date.now()
    const keyPath = fullKey(key)
    const { db, store } = await getStore('readwrite')

    try {
      const existing = await requestToPromise<CacheRecord<T> | undefined>(
        store.get(keyPath),
      )
      const record: CacheRecord<T> = {
        createdAt: existing?.createdAt ?? now,
        key: keyPath,
        namespace,
        updatedAt: now,
        value,
      }
      await requestToPromise(store.put(record))
    } finally {
      db.close()
    }

    await prune()
  }

  return {
    list,
    remove,
    set,
  }
}

export const indexedDBCache = {
  create,
}
