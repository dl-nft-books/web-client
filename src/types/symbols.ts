import { InjectionKey, Ref } from 'vue'
import { FullBookInfo } from '@/types'
import { UseImageEditor } from 'simple-fabric-vue-image-editor'
import { useForm } from '@/composables'

export const PurchaseFormKey: InjectionKey<{
  formState: ReturnType<typeof useForm>
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
