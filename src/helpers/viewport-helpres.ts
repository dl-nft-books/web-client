function preventDefault(e: Event) {
  e.preventDefault()
}

// modern Chrome requires { passive: false } when adding event
const supportsPassive = true

const wheelOpt: boolean | AddEventListenerOptions = supportsPassive
  ? { passive: false }
  : false
const wheelEvent =
  'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

// call this to Disable
export function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false) // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt) //  desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt) // mobile
}

// call this to Enable
export function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false)
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt)
  window.removeEventListener('touchmove', preventDefault, wheelOpt)
}
