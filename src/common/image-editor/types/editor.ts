import { fabric } from 'fabric'
import { Ref } from 'vue'

export type ZoomType = 'zoom' | 'reset'

export interface UseImageEditor {
  canvas: fabric.Canvas | null

  init: (imageUrl: string, customOptions?: fabric.IImageOptions) => void

  addText: (value: string, isEditable?: boolean) => void
  setColor: (color: string, object?: fabric.Object) => void
  switchBoldness: (object?: fabric.IText) => void
  switchItalic: (object?: fabric.IText) => void
  changeFont: (font: string, object?: fabric.IText) => void

  zoom: (zoomType: ZoomType, scaleFactor?: number) => void
  currentZoom: Ref<number>
  activeObject: Ref<fabric.Object | null>
  addRect: () => void
  download: () => void
  canvasToFormData: () => FormData | null
}
