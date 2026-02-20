export type SettingItem = {
  label: string
  buttonText?: string
  onClick?: () => void
}
export type SettingGroup = {
  label: string
  children: SettingItem[]
}
