import { InjectionKey, Ref } from 'vue'
import { Platform } from '@/types'

type FormInjectedInfo = {
  platform: Platform
  isFormDisabled: Ref<boolean>
}

export const PurchaseFormKey: InjectionKey<FormInjectedInfo> = Symbol('form')
