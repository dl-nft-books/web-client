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

export interface UseImageEditor
  extends UseText,
    UseObjectMutations,
    UseCanvasOperations,
    UseDrawing {
  canvas: fabric.Canvas | null

  init: (
    imageUrl: string,
    customOptions?: fabric.IImageOptions,
  ) => Promise<void>
  activeObject: Ref<fabric.Object | null>
  addRect: () => void
}

export interface UseText {
  addText: (value: string, options?: fabric.ITextOptions) => void
  switchBoldness: (object?: fabric.IText) => void
  switchItalic: (object?: fabric.IText) => void
  changeFont: (font: string, object?: fabric.IText) => void
  changeFontSize: (size: number, object?: fabric.IText) => void
  addFrame: (
    color: string,
    width: number,
    padding: number,
    object?: fabric.IText,
  ) => void
}

export interface UseCanvasOperations {
  download: (options?: fabric.IDataURLOptions) => void
  canvasToFormData: (options?: fabric.IDataURLOptions) => FormData | null
  zoom: (zoomType: ZoomType, scaleFactor?: number) => void
  currentZoom: Ref<number>
}

export interface UseDrawing {
  startDraw: (brush: BRUSHES, options?: Partial<fabric.BaseBrush>) => void
  modifyBrush: (options: Partial<fabric.BaseBrush>) => void
  stopDraw: () => void
}

export interface UseObjectMutations {
  setColor: (color: FabricColor, object?: fabric.Object) => void
  setBackgroundColor: (color: string, object?: fabric.Object) => void
}
