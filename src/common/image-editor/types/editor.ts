import { fabric } from 'fabric'

export interface UseImageEditor {
  canvas: fabric.Canvas | null

  init: (imageUrl: string, customOptions?: fabric.IImageOptions) => void

  addText: (value: string, isEditable?: boolean) => void
  setColor: (color: string, object?: fabric.Object) => void
  addRect: () => void
}
