import { Ref, watch, ref } from 'vue'
import { fabric } from 'fabric'
import { useElementSize } from '@vueuse/core'
import {
  dataUriToBlob,
  getImageScaleFactor,
  keepObjectInBoundaries,
  adjustObjectsSize,
  modifyTextSelection,
} from '@image-editor/helpers'
import {
  FabricColor,
  UseImageEditor,
  ZoomType,
  BRUSHES,
} from '@image-editor/types'
import {
  setDragListener,
  setDeleteObjectListener,
  setSelectionListeners,
} from '@image-editor/listeners'

const DEFAULT_VIEWPORT = [1, 0, 0, 1, 0, 0]
const DEFAULT_ZOOM = 1

export function useImageEditor(
  canvasRef: Ref<HTMLCanvasElement | null>,
  canvasContainerRef: Ref<HTMLElement | null>,
): UseImageEditor {
  let canvas = null as fabric.Canvas | null

  const currentZoom = ref(DEFAULT_ZOOM)
  const activeObject = ref<fabric.Object | null>(null)

  const imageConfig: fabric.IImageOptions = {
    crossOrigin: 'anonymous',
    centeredScaling: true,
    centeredRotation: true,
  }

  const { width: containerWidth, height: containerHeight } =
    useElementSize(canvasContainerRef)

  const setCanvasListeners = () => {
    if (!canvas) return

    const dragRestrictionRule = () => currentZoom.value === 1

    setDragListener(canvas, dragRestrictionRule)
    setDeleteObjectListener(canvas)
    setSelectionListeners(canvas, activeObject)
  }

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

  const setColor = (color: FabricColor, object?: fabric.Object) => {
    if (!canvas) return

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
    if (!canvas) return

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

  const addText = (value: string, options?: fabric.ITextOptions) => {
    if (!canvas) return

    const defaultTextSettings: fabric.ITextOptions = {
      left: 50,
      top: 50,
      fill: '#000000',
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'normal',
      editable: true,
      centeredRotation: true,
      padding: 10,
    }

    const text = new fabric.IText(value, {
      ...defaultTextSettings,
      ...(!options ? {} : options),
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

  const switchBoldness = (object?: fabric.IText) => {
    if (!canvas) return

    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject || !(activeObject instanceof fabric.IText)) return

    const wholeTextStyle = (currentStyle: string | number) =>
      currentStyle !== 'bold' ? 'bold' : 'normal'

    const selectionStyle = (currentSelection: unknown[]) => {
      /* calculate amount of bold chars to decide which style should 
         be applied */
      const boldChars = (
        currentSelection as { fontWeight: string | number }[]
      ).reduce(
        (count, value) => (value.fontWeight === 'bold' ? count + 1 : count),
        0,
      )

      return boldChars === currentSelection.length ? 'normal' : 'bold'
    }

    modifyTextSelection(
      activeObject,
      'fontWeight',
      wholeTextStyle,
      selectionStyle,
    )

    canvas.renderAll()
  }

  const switchItalic = (object?: fabric.IText) => {
    if (!canvas) return

    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject || !(activeObject instanceof fabric.IText)) return

    const wholeTextStyle = (currentStyle: string | number) =>
      currentStyle === 'italic' ? 'normal' : 'italic'

    const selectionStyle = (currentSelection: unknown[]) => {
      /* calculate amount of italic chars to decide which style should 
           be applied */
      const italicChars = (currentSelection as { fontStyle: string }[]).reduce(
        (count, value) => (value.fontStyle === 'italic' ? count + 1 : count),
        0,
      )

      return italicChars === currentSelection.length ? 'normal' : 'italic'
    }

    modifyTextSelection(
      activeObject,
      'fontStyle',
      wholeTextStyle,
      selectionStyle,
    )
    canvas.renderAll()
  }

  const changeFont = (font: string, object?: fabric.IText) => {
    if (!canvas) return

    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject || !(activeObject instanceof fabric.IText)) return

    modifyTextSelection(activeObject, 'fontFamily', font, font)

    canvas.renderAll()
  }

  const changeFontSize = (size: number, object?: fabric.IText) => {
    if (!canvas) return

    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject || !(activeObject instanceof fabric.IText)) return

    modifyTextSelection(activeObject, 'fontSize', size, size)

    canvas.renderAll()
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

  // FIX: text is no longer editable with frame
  const ungroupObjects = (group: fabric.Group) => {
    if (!canvas) return

    const items = group.getObjects()

    if (!items.length) return

    group._restoreObjectsState()
    canvas.remove(group)
    items.forEach(item => {
      canvas!.add(item)
    })
  }

  // doesn't work properly
  const addFrame = (
    color: string,
    width: number,
    padding: number,
    object?: fabric.IText,
  ) => {
    if (!canvas) return

    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject || !(activeObject instanceof fabric.IText)) return

    const boundingBox = activeObject.getBoundingRect()

    const frame = new fabric.Rect({
      left: boundingBox.left - padding,
      top: boundingBox.top - padding,
      width: boundingBox.width + padding * 2,
      height: boundingBox.height + padding * 2,
      fill: 'transparent',
      stroke: color,
      strokeWidth: width,
      selectable: false,
    })

    const group = new fabric.Group([frame, activeObject], {
      selectable: true,
    })

    canvas.add(group)
    canvas.discardActiveObject()

    activeObject.lockMovementX = true
    activeObject.lockMovementY = true
    activeObject.lockRotation = true
    activeObject.lockScalingX = true
    activeObject.lockScalingY = true

    activeObject.on('selection:cleared', () => {
      const group = new fabric.Group([frame, activeObject], {
        selectable: true,
      })

      canvas!.add(group)
      canvas!.discardActiveObject()
    })

    group.on('mousedblclick', () => {
      ungroupObjects(group)
      canvas!.setActiveObject(activeObject)
      activeObject.enterEditing()
    })
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

  const canvasToFormData = (options?: fabric.IDataURLOptions) => {
    if (!canvas) return null

    resetZoom()
    // scaling up image and all objects to initial sizes and to get max quality
    preserveOriginalSize()

    const base64 = canvas.toDataURL(options)
    const blob = dataUriToBlob(base64, 'image/png')

    const formData = new FormData()
    formData.append('Document', blob)

    // invoking this func to restore canvas state
    handleCanvasResize()

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

  const startDraw = (brush: BRUSHES, options?: Partial<fabric.BaseBrush>) => {
    if (!canvas) return

    canvas.isDrawingMode = true
    /* Due to bug with types in fabric library this constructors require 
       canvas object, but types declaration says that it doesn't.
       
       TODO: remove ignore when bug is fixed */
    switch (brush) {
      case BRUSHES.spray:
        // eslint-disable-next-line
        // @ts-ignore
        canvas.freeDrawingBrush = new fabric.SprayBrush(canvas)
        break
      case BRUSHES.circle:
        // eslint-disable-next-line
        // @ts-ignore
        canvas.freeDrawingBrush = new fabric.CircleBrush(canvas)
        break
      case BRUSHES.pencil:
      default:
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
        break
    }

    if (options) Object.assign(canvas.freeDrawingBrush, options)
  }

  const modifyBrush = (options: Partial<fabric.BaseBrush>) => {
    if (!canvas || !canvas.isDrawingMode) return

    Object.assign(canvas.freeDrawingBrush, options)
  }

  const stopDraw = () => {
    if (!canvas) return

    canvas.isDrawingMode = false
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
    addFrame,
    setColor,
    setBackgroundColor,
    switchBoldness,
    switchItalic,
    changeFont,
    changeFontSize,

    zoom,
    currentZoom,

    activeObject,

    download,
    canvasToFormData,

    startDraw,
    stopDraw,
    modifyBrush,
  }
}
