import { InjectionKey, Ref } from 'vue'
import { FORM_STATES } from '@/enums'
import { FullBookInfo } from '@/types'
import { UseImageEditor } from 'simple-fabric-vue-image-editor'

export const PurchaseFormKey: InjectionKey<{
  formState: Ref<FORM_STATES>
  bookInfo: FullBookInfo
  isFormValid: Ref<(() => boolean) | null>
  submit: Ref<
    ((editorInstance: UseImageEditor | null) => Promise<void>) | undefined
  >
  successMessage: Ref<{
    message: string
    txLink?: string
  }>
}> = Symbol('form-info')
