import { fabric } from 'fabric'
import { FabricStyle } from '@image-editor/types'

/**
 * Modifies the selection of a Fabric.js IText object with a given style.
 *
 * @param text - The Fabric.js IText object.
 * @param styleKey - The key of the style to modify.
 * @param styleGetter
 * - A function that determines the new style to apply, or a fixed style value.
 * @param selectionStyleGetter
 * - (Optional) A function that determines the new style to apply to the
 * selected text only, or a fixed style value.
 *
 * @remarks
 * This function has the following overloads:
 * - `modifyTextSelection(text: fabric.IText, styleKey: keyof fabric.IText,
 * styleGetter: FabricStyle, selectionStyleGetter?: FabricStyle): void`
 * - `modifyTextSelection(text: fabric.IText, styleKey: keyof fabric.IText,
 * styleGetter: (currentStyle: string | number) => FabricStyle,
 * selectionStyleGetter?: (selectionStyles: unknown[]) => FabricStyle): void`
 *
 * The `styleGetter` parameter and `selectionStyleGetter`  can be a fixed style
 * object, or a function that returns a new style based on the current style
 * of the text object.
 * If `selectionStyleGetter` is provided, it will be used to apply a different
 * style to the selected text only.
 *
 * @example
 * modifyTextSelection(textObject, 'fontWeight', 'bold');
 * modifyTextSelection(textObject, 'fill', '#000',
 *  selection => ({ fill: selection[0]?.fill === '#000' ? '#fff' : '#000' }));
 *
 */

export function modifyTextSelection(
  text: fabric.IText,
  styleKey: keyof fabric.IText,
  styleGetter: (currentStyle: string | number) => FabricStyle,
  selectionStyleGetter?: (selectionStyles: unknown[]) => FabricStyle,
): void

export function modifyTextSelection(
  text: fabric.IText,
  styleKey: keyof fabric.IText,
  styleGetter: FabricStyle,
  selectionStyleGetter?: FabricStyle,
): void

export function modifyTextSelection(
  text: fabric.IText,
  styleKey: keyof fabric.IText,
  styleGetter: ((currentStyle: string | number) => FabricStyle) | FabricStyle,
  selectionStyleGetter?:
    | ((selectionStyles: unknown[]) => FabricStyle)
    | FabricStyle,
) {
  const selectionStart = text.selectionStart
  const selectionEnd = text.selectionEnd

  // when no particular char is selected - changing whole text
  if (selectionStart === selectionEnd || !selectionStyleGetter) {
    /* 
        if style where applied to an individual char it will no longer be 
        triggered by set method of parent IText object, that's why we need 
        to remove style before applying it
      */
    text.removeStyle(styleKey)

    text.set(
      styleKey,
      typeof styleGetter === 'function'
        ? styleGetter(text[styleKey])
        : styleGetter,
    )

    return
  }

  /* fabric.js method returns Array<any>
       need to be casted to needed type in place where it will be used
    */
  const selectionStyles = text.getSelectionStyles()

  text.setSelectionStyles(
    {
      [styleKey]:
        typeof selectionStyleGetter === 'function'
          ? selectionStyleGetter(selectionStyles)
          : selectionStyleGetter,
    },
    selectionStart,
    selectionEnd,
  )
}
