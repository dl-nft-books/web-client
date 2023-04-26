import { InjectionKey, Ref } from 'vue'

export const PurchaseFormKey: InjectionKey<{
  isFormDisabled: Ref<boolean>
}> = Symbol('form-info')
