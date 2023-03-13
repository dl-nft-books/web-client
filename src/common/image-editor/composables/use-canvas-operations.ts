import { fabric } from 'fabric'
import { ref } from 'vue'

import { UseCanvasOperations, ZoomType } from '@image-editor/types'
import {
  preserveOriginalSize,
  keepObjectInBoundaries,
  dataUriToBlob,
} from '@image-editor/helpers'

const DEFAULT_VIEWPORT = [1, 0, 0, 1, 0, 0]
const DEFAULT_ZOOM = 1

export function useCanvasOperations(
  canvas: fabric.Canvas,
): UseCanvasOperations {
  const currentZoom = ref(DEFAULT_ZOOM)

  const download = (options?: fabric.IDataURLOptions) => {
    if (!canvas) return

    resetZoom()

    // scaling up image and all objects to initial sizes and to get max quality
    const restoreSize = preserveOriginalSize(canvas)

    if (!restoreSize) return

    const dataURL = canvas.toDataURL(options)

    const downloadLink = document.createElement('a')
    downloadLink.setAttribute('download', 'test-image.png')

    downloadLink.setAttribute('href', dataURL)

    downloadLink.click()

    restoreSize()
  }

  const canvasToFormData = (options?: fabric.IDataURLOptions) => {
    if (!canvas) return null

    resetZoom()
    // scaling up image and all objects to initial sizes and to get max quality
    const restoreSize = preserveOriginalSize(canvas)

    if (!restoreSize) return null

    const base64 = canvas.toDataURL(options)
    const blob = dataUriToBlob(base64, 'image/png')

    const formData = new FormData()
    formData.append('Document', blob)

    restoreSize()

    return formData
  }

  const resetZoom = () => {
    canvas.setZoom(DEFAULT_ZOOM)
    canvas.viewportTransform = DEFAULT_VIEWPORT
    currentZoom.value = canvas.getZoom()
  }

  const zoom = (zoomType: ZoomType, scaleFactor?: number) => {
    switch (zoomType) {
      case 'zoom':
        if (!scaleFactor) return

        canvas.setZoom(scaleFactor)
        currentZoom.value = canvas.getZoom()

        keepObjectInBoundaries(canvas, canvas.backgroundImage as fabric.Image)
        break
      case 'reset':
      default:
        resetZoom()
    }
  }

  return {
    zoom,
    currentZoom,
    download,
    canvasToFormData,
  }
}
