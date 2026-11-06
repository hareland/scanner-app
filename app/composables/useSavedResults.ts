import { createSharedComposable } from '@vueuse/core'
import type { ScanResult } from '~/types/scanner'

export type SavedScan = ScanResult & { id: string }

const _useSavedScanResults = () => {
  const storage = usePreferencesStore('saved-scan-results')

  const results = ref<Map<string, ScanResult>>(new Map())
  const loaded = ref(false)

  /** Newest first. */
  const list = computed<SavedScan[]>(() =>
    Array.from(results.value.entries())
      .map(([id, value]) => ({ ...value, id }))
      .sort((a, b) => b.scannedAt - a.scannedAt),
  )

  const load = async () => {
    const keys = await storage.keys()
    const entries = await Promise.all(keys.map(async key => [key, await storage.get<ScanResult>(key)] as const))
    results.value = new Map(entries.filter((e): e is [string, ScanResult] => e[1] !== null))
    loaded.value = true
  }

  const isSaved = (result: ScanResult) =>
    list.value.some(s => s.text === result.text && s.format === result.format && s.scannedAt === result.scannedAt)

  const save = async (result: ScanResult) => {
    const { text, format, scannedAt, description } = result
    const item: ScanResult = { text, format, scannedAt, ...description?.trim() ? { description: description.trim() } : {} }
    const id = crypto.randomUUID()
    await storage.set(id, item)
    results.value.set(id, item)
    return id
  }

  /** Sets or clears the description of a saved code. */
  const describe = async (id: string, description: string) => {
    const current = results.value.get(id)
    if (!current) return
    const { description: _old, ...rest } = current
    const item: ScanResult = description.trim() ? { ...rest, description: description.trim() } : rest
    await storage.set(id, item)
    results.value.set(id, item)
  }

  const remove = async (id: string) => {
    await storage.remove(id)
    results.value.delete(id)
  }

  const clear = async () => {
    await storage.clear()
    results.value.clear()
  }

  const importItems = async (items: ScanResult[]) => {
    for (const item of items) {
      await save(item)
    }
  }

  load()

  return {
    results,
    list,
    loaded,
    load,
    isSaved,
    save,
    describe,
    remove,
    clear,
    importItems,
  }
}

export const useSavedScanResults = createSharedComposable(_useSavedScanResults)
