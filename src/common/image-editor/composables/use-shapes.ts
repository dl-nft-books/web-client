import { fabric } from 'fabric'

import { UseShapes } from '@image-editor/types'

export function useShapes(canvas: fabric.Canvas): UseShapes {
  const defaultShapePosition: fabric.IObjectOptions = {
    top: 100,
    left: 100,
  }

  const defaultShapeSizes: fabric.IObjectOptions = {
    width: 50,
    height: 50,
  }

  const defaultShapeColors: fabric.IObjectOptions = {
    fill: '#77f',
  }

  const addRectangle = (options?: fabric.IRectOptions) => {
    const rect = new fabric.Rect({
      ...defaultShapePosition,
      ...defaultShapeColors,
      ...defaultShapeSizes,
      ...(!options ? {} : options),
    })

    canvas.add(rect)
  }

  const addTriangle = (options?: fabric.ITriangleOptions) => {
    const triangle = new fabric.Triangle({
      ...defaultShapePosition,
      ...defaultShapeColors,
      ...defaultShapeSizes,
      ...(!options ? {} : options),
    })

    canvas.add(triangle)
  }

  const addCircle = (options?: fabric.ICircleOptions) => {
    const circle = new fabric.Circle({
      ...defaultShapeColors,
      ...defaultShapePosition,
      radius: 50,
      ...(!options ? {} : options),
    })

    canvas.add(circle)
  }

  return {
    addRectangle,
    addTriangle,
    addCircle,
  }
}
