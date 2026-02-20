import { createStorage } from 'unstorage'
import capacitorPreferences from 'unstorage/drivers/capacitor-preferences'
import { createSharedComposable } from '@vueuse/core'
import type { ScanResult } from '~/types/scanner'

const _useSavedScanResults = () => {
  const storage = createStorage({
    driver: capacitorPreferences({ base: 'saved-scan-results' }),
  })

  const results = ref<Map<string, ScanResult>>(new Map())
  const loaded = ref(false)

  const load = async () => {
    const keys = await storage.getKeys()
    const entries = await Promise.all(
      keys.map(async (key) => {
        const value = await storage.getItem<ScanResult>(key)
        return [key, value] as const
      }),
    )
    results.value = new Map(entries.filter(([, v]) => v !== null) as [string, ScanResult][])
    loaded.value = true
  }

  const save = async (result: ScanResult) => {
    const id = crypto.randomUUID()
    await storage.setItem(id, toRaw(result))
    results.value.set(id, result)
  }

  const remove = async (id: string) => {
    await storage.removeItem(id)
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
    loaded,
    load,
    save,
    remove,
    clear,
    importItems,
  }
}

export const useSavedScanResults = createSharedComposable(_useSavedScanResults)
