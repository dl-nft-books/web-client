import { ICON_NAMES } from '@/enums'

export type NotificationObjectPayload = {
  title?: string
  message: string
  iconName?: typeof ICON_NAMES | unknown
}

export type Badge = {
  label: string
  icon: ICON_NAMES
}

export type TabsType = {
  translation: string
  id: string
}
