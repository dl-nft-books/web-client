import { InjectionKey, Ref } from 'vue'
import { Platform } from '@/types'

export const PurchaseFormKey: InjectionKey<{
  platform: Platform
  isFormDisabled: Ref<boolean>
}> = Symbol('form-info')
