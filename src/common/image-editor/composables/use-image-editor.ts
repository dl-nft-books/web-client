import { Ref, watch, ref } from 'vue'
import { fabric } from 'fabric'
import { useElementSize } from '@vueuse/core'
import {
  dataUriToBlob,
  getImageScaleFactor,
  keepObjectInBoundaries,
  adjustObjectsSize,
} from '@image-editor/helpers'
import { UseImageEditor, ZoomType } from '@image-editor/types'
import {
  setDragListener,
  setDeleteObjectListener,
  setSelectionListeners,
} from '@image-editor/listeners'

const DEFAULT_VIEWPORT = [1, 0, 0, 1, 0, 0]
const DEFAULT_ZOOM = 1

type FabricColor = string | fabric.Pattern | fabric.Gradient

export function useImageEditor(
  canvasRef: Ref<HTMLCanvasElement | null>,
  canvasContainerRef: Ref<HTMLElement | null>,
): UseImageEditor {
  let canvas = null as fabric.Canvas | null

  const currentZoom = ref(1)
  const activeObject = ref<fabric.Object | null>(null)

  const imageConfig: fabric.IImageOptions = {
    crossOrigin: 'anonymous',
    centeredScaling: true,
    centeredRotation: true,
  }

  const setCanvasListeners = () => {
    if (!canvas) return

    const dragRestrictionRule = () => currentZoom.value === 1

    setDragListener(canvas, dragRestrictionRule)
    setDeleteObjectListener(canvas)
    setSelectionListeners(canvas, activeObject)
  }

  const { width: containerWidth, height: containerHeight } =
    useElementSize(canvasContainerRef)

  const init = (imageUrl: string, customOptions?: fabric.IImageOptions) => {
    // wait until container inititalizes then invoking init of canvas
    const stopWatching = watch(containerWidth, async () => {
      if (!containerWidth.value) return

      stopWatching()

      canvas = new fabric.Canvas(canvasRef.value, {
        width: containerWidth.value,
        height: containerHeight.value,
      })

      await setBackgroundImage(imageUrl, customOptions)
      handleCanvasResize()
      setCanvasListeners()
    })
  }

  const setBackgroundImage = (
    imageUrl: string,
    customOptions?: fabric.IImageOptions,
  ) => {
    return new Promise(resolve => {
      fabric.Image.fromURL(imageUrl, (image: fabric.Image) => {
        if (!image.width || !image.height || !canvas?.width || !canvas?.height)
          return

        canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
          ...imageConfig,
          ...(customOptions ? customOptions : {}),
        })

        resolve(image)
      })
    })
  }

  const addText = (value: string, isEditable = true) => {
    if (!canvas) return

    const text = new fabric.IText(value, {
      left: 50,
      top: 50,
      fill: '#000000',
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'normal',
      editable: isEditable,
      centeredRotation: true,
      padding: 10,
    })

    // removing ability to scale without maintaining aspect ratio
    text.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
    })

    canvas.add(text)
  }

  const setColor = (color: FabricColor, object?: fabric.Object) => {
    if (!canvas) return

    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    activeObject.set('fill', color)

    canvas.renderAll()
  }

  const switchBoldness = (object?: fabric.IText) => {
    if (!canvas) return

    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    if (activeObject instanceof fabric.IText) {
      const isBold = activeObject.fontWeight === 'bold'

      activeObject.set('fontWeight', !isBold ? 'bold' : 'normal')

      canvas.renderAll()
    }
  }

  const switchItalic = (object?: fabric.IText) => {
    if (!canvas) return

    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    if (activeObject instanceof fabric.IText) {
      const isItalic = activeObject.fontStyle === 'italic'
      activeObject.set('fontStyle', isItalic ? 'normal' : 'italic')

      canvas.renderAll()
    }
  }

  const changeFont = (font: string, object?: fabric.IText) => {
    if (!canvas) return

    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    if (activeObject instanceof fabric.IText) {
      activeObject.set('fontFamily', font)
      canvas.renderAll()
    }
  }

  const addRect = () => {
    if (!canvas) return

    const rect = new fabric.Rect({
      width: 50,
      height: 50,
      fill: '#77f',
      top: 100,
      left: 100,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      lockScalingX: false,
      lockScalingY: false,
    })

    canvas.add(rect)
  }

  const preserveOriginalSize = () => {
    if (!canvas?.width || !canvas.height) return

    const currentWidth = canvas.width
    const currentHeight = canvas.height

    const backgroundImage = canvas.backgroundImage as fabric.Image

    if (!backgroundImage.width || !backgroundImage.height) return

    backgroundImage.scale(1)

    canvas.setDimensions({
      width: backgroundImage.width,
      height: backgroundImage.height,
    })

    adjustObjectsSize(canvas, currentWidth, currentHeight)
  }

  const download = (options?: fabric.IDataURLOptions) => {
    if (!canvas) return

    resetZoom()

    // scaling up image and all objects to initial sizes and to get max quality
    preserveOriginalSize()

    const dataURL = canvas.toDataURL(options)

    const downloadLink = document.createElement('a')
    downloadLink.setAttribute('download', 'test-image.png')

    downloadLink.setAttribute('href', dataURL)

    downloadLink.click()

    // invoking this func to restore canvas state
    handleCanvasResize()
  }

  const canvasToFormData = () => {
    if (!canvas) return null

    const base64 = canvas.toDataURL()
    const blob = dataUriToBlob(base64, 'image/png')

    const formData = new FormData()
    formData.append('Document', blob)

    return formData
  }

  const resetZoom = () => {
    if (!canvas) return

    canvas.setZoom(DEFAULT_ZOOM)
    canvas.viewportTransform = DEFAULT_VIEWPORT
    currentZoom.value = canvas.getZoom()
  }

  const zoom = (zoomType: ZoomType, scaleFactor?: number) => {
    if (!canvas) return

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

  const handleCanvasResize = () => {
    if (!canvas?.backgroundImage || !canvasContainerRef.value) return

    const backgroundImage = canvas.backgroundImage as fabric.Image

    if (!backgroundImage.width || !backgroundImage.height) return

    const scaleFactor = getImageScaleFactor(
      backgroundImage.width,
      backgroundImage.height,
      containerWidth.value,
      containerHeight.value,
    )

    const originalWidth = canvas.width
    const originalHeight = canvas.height

    backgroundImage.scale(scaleFactor)

    canvas.setDimensions({
      height: backgroundImage.height * scaleFactor,
      width: backgroundImage.width * scaleFactor,
    })

    backgroundImage.center()

    adjustObjectsSize(canvas, originalWidth!, originalHeight!)

    canvas.renderAll()
  }

  watch(() => [containerHeight.value, containerWidth.value], handleCanvasResize)

  return {
    canvas,

    init,

    addText,
    addRect,
    setColor,
    switchBoldness,
    switchItalic,
    changeFont,

    zoom,
    currentZoom,

    activeObject,

    download,
    canvasToFormData,
  }
}
