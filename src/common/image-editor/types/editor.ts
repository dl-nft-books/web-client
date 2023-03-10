import { fabric } from 'fabric'
import { Ref } from 'vue'

export type ZoomType = 'zoom' | 'reset'
export type FabricColor = string | fabric.Pattern | fabric.Gradient
export type FabricStyle = FabricColor | number

export enum BRUSHES {
  pencil = 'pencil',
  spray = 'spray',
  circle = 'circle',
}

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

  startDraw: (brush: BRUSHES, options?: Partial<fabric.BaseBrush>) => void
  modifyBrush: (options: Partial<fabric.BaseBrush>) => void
  stopDraw: () => void
}
