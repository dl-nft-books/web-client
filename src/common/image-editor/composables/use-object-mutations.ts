import { fabric } from 'fabric'

import { UseObjectMutations, FabricColor } from '@image-editor/types'
import { modifyTextSelection } from '@image-editor/helpers'

export function useObjectMutations(canvas: fabric.Canvas): UseObjectMutations {
  const setColor = (color: FabricColor, object?: fabric.Object) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    if (activeObject instanceof fabric.IText) {
      modifyTextSelection(activeObject, 'fill', color, color)
      canvas.renderAll()
      return
    }

    if (activeObject instanceof fabric.Group) {
      activeObject.getObjects().forEach(object => {
        if (object instanceof fabric.IText) {
          modifyTextSelection(object, 'fill', color, color)
        }
        if (object instanceof fabric.Rect) {
          object.set('stroke', color as string)
        }
      })
      canvas.renderAll()
      return
    }

    activeObject.set('fill', color)

    canvas.renderAll()
  }

  const setBackgroundColor = (color: string, object?: fabric.Object) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    if (activeObject instanceof fabric.IText) {
      modifyTextSelection(activeObject, 'textBackgroundColor', color, color)
      canvas.renderAll()
      return
    }

    activeObject.set('backgroundColor', color)

    canvas.renderAll()
  }

  return { setBackgroundColor, setColor }
}
