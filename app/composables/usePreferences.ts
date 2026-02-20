import { createStorage } from 'unstorage'
import capacitorPreferences from 'unstorage/drivers/capacitor-preferences'

export const usePreferences = (base: string = 'root') => {
  const storage = createStorage({
    driver: capacitorPreferences({
      base,
    }),
  })

  return storage
}
