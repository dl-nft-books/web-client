import { InjectionKey } from 'vue'
import { UseImageEditor } from '@image-editor/types'

export const EditorInstanceKey: InjectionKey<{
  instance: UseImageEditor
}> = Symbol('image-editor')
