import { Preferences } from '@capacitor/preferences'

/**
 * JSON values in Capacitor Preferences (UserDefaults on iOS, localStorage in a browser) under `<base>:<key>`.
 * That is the key format the app's earlier unstorage driver wrote, so data saved by older builds still loads.
 */
export function usePreferencesStore(base: string) {
  const prefix = `${base}:`

  async function keys() {
    const { keys } = await Preferences.keys()
    return keys.filter(k => k.startsWith(prefix)).map(k => k.slice(prefix.length))
  }

  async function get<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key: prefix + key })
    if (value === null) return null
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  async function set(key: string, value: unknown) {
    await Preferences.set({ key: prefix + key, value: JSON.stringify(value) })
  }

  async function remove(key: string) {
    await Preferences.remove({ key: prefix + key })
  }

  async function clear() {
    await Promise.all((await keys()).map(remove))
  }

  return { keys, get, set, remove, clear }
}
