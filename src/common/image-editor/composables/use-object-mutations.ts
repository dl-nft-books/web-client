import { fabric } from 'fabric'

import { UseObjectMutations, FabricColor } from '@image-editor/types'
import { modifyTextSelection, modifyGroup } from '@image-editor/helpers'

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
      modifyGroup(
        activeObject,
        {
          default: 'stroke',
          text: 'fill',
        },
        color,
      )

      canvas.renderAll()
      return
    }

    activeObject.set('stroke', color as string)

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

    if (activeObject instanceof fabric.Group) {
      modifyGroup(
        activeObject,
        {
          default: 'fill',
          text: 'textBackgroundColor',
        },
        color,
      )

      canvas.renderAll()
      return
    }

    activeObject.set('fill', color)

    canvas.renderAll()
  }

  const setStroke = (
    strokeOptions: Partial<
      Pick<fabric.IObjectOptions, 'stroke' | 'strokeWidth'>
    >,
    object?: fabric.Object,
  ) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    if (activeObject instanceof fabric.IText) {
      Object.entries(strokeOptions).forEach(([key, value]) => {
        modifyTextSelection(
          activeObject,
          key as keyof fabric.IText,
          value,
          value,
        )
      })

      canvas.renderAll()
      return
    }

    if (activeObject instanceof fabric.Group) {
      Object.entries(strokeOptions).forEach(([key, value]) => {
        modifyGroup(
          activeObject,
          {
            default: key as keyof fabric.Object,
          },
          value,
        )
      })

      canvas.renderAll()
      return
    }

    activeObject.set({
      stroke: strokeOptions.stroke ?? activeObject.stroke,
      strokeWidth: strokeOptions.strokeWidth ?? activeObject.strokeWidth,
    })

    canvas.renderAll()
  }

  const bringToFront = (object?: fabric.Object) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    activeObject.bringToFront()
  }

  const sendToBack = (object?: fabric.Object) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    activeObject.sendToBack()
  }

  return { setBackgroundColor, setColor, setStroke, bringToFront, sendToBack }
}
