import { Ref, watch } from 'vue'
import { fabric } from 'fabric'
import { useElementSize } from '@vueuse/core'
import { getImageScaleFactor } from '@image-editor/helpers'
import { UseImageEditor } from '@image-editor/types'

// const MIN_CANVAS_HEIGHT = 500

type FabricColor = string | fabric.Pattern | fabric.Gradient

export function useImageEditor(
  canvasRef: Ref<HTMLCanvasElement | null>,
  canvasContainerRef: Ref<HTMLElement | null>,
  // minHeight = MIN_CANVAS_HEIGHT,
): UseImageEditor {
  let canvas = null as fabric.Canvas | null

  const imageConfig: fabric.IImageOptions = {
    crossOrigin: 'anonymous',
    centeredScaling: true,
    centeredRotation: true,
  }

  const { width: containerWidth, height: containerHeight } =
    useElementSize(canvasContainerRef)

  const init = (imageUrl: string, customOptions?: fabric.IImageOptions) => {
    // wait until container initializes
    const stopWatching = watch(containerWidth, () => {
      if (containerWidth.value <= 0) return

      canvas = new fabric.Canvas(canvasRef.value, {
        width: containerWidth.value,
        height: containerHeight.value,
      })

      setBackgroundImage(imageUrl, customOptions)

      stopWatching()

      watch(
        () => [containerWidth.value, containerHeight.value],
        handleCanvasResize,
      )
    })
  }

  const setBackgroundImage = (
    imageUrl: string,
    customOptions?: fabric.IImageOptions,
  ) => {
    fabric.Image.fromURL(imageUrl, (image: fabric.Image) => {
      if (!image.width || !image.height || !canvas) return

      const scaleFactor = getImageScaleFactor(image.width, image.height, canvas)

      if (!scaleFactor) return

      canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
        ...imageConfig,
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        ...(customOptions ? customOptions : {}),
      })

      canvas.setHeight(image.height * scaleFactor)
      canvas.setWidth(image.width * scaleFactor)

      image.centerH()
    })
  }

  // works fine when scalling down
  const handleCanvasResize = () => {
    if (!canvas || !canvasContainerRef.value) return

    const backgroundImage = canvas.backgroundImage as fabric.Image

    if (!backgroundImage?.width || !backgroundImage?.height) return

    canvas.setWidth(containerWidth.value)

    const scaleFactor = getImageScaleFactor(
      backgroundImage.width,
      backgroundImage.height,
      canvas,
    )

    if (!scaleFactor) return

    canvas.setWidth(backgroundImage.width * scaleFactor)
    canvas.setHeight(backgroundImage.height * scaleFactor)

    backgroundImage.scaleX = scaleFactor
    backgroundImage.scaleY = scaleFactor
    backgroundImage.centerH()

    canvas.renderAll()
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

  return {
    canvas,

    init,

    addText,
    addRect,
    setColor,
  }
}
