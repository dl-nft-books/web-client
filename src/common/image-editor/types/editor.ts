import { fabric } from 'fabric'
import { Ref } from 'vue'
import { FabricColor } from '@image-editor/composables'

export type ZoomType = 'zoom' | 'reset'

export interface UseImageEditor {
  canvas: fabric.Canvas | null

  init: (imageUrl: string, customOptions?: fabric.IImageOptions) => void

  addText: (value: string, options?: fabric.ITextOptions) => void
  setColor: (color: FabricColor, object?: fabric.Object) => void
  setBackgroundColor: (color: string, object?: fabric.Object) => void
  switchBoldness: (object?: fabric.IText) => void
  switchItalic: (object?: fabric.IText) => void
  changeFont: (font: string, object?: fabric.IText) => void
  changeFontSize: (size: number, object?: fabric.IText) => void

  zoom: (zoomType: ZoomType, scaleFactor?: number) => void
  currentZoom: Ref<number>
  activeObject: Ref<fabric.Object | null>
  addRect: () => void
  addFrame: (
    color: string,
    width: number,
    padding: number,
    object?: fabric.IText,
  ) => void
  download: (options?: fabric.IDataURLOptions) => void
  canvasToFormData: (options?: fabric.IDataURLOptions) => FormData | null
}
