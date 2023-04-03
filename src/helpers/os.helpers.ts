import { detect } from 'detect-browser'

export function isIos() {
  const res = detect()
  return res && res.os === 'iOS'
}

export function isAndroid() {
  const res = detect()
  return res && res.os === 'Android OS'
}

export function isMobile() {
  return isAndroid() || isIos()
}

export function isChromeBrowser() {
  const res = detect()

  return res && res.name === 'chrome'
}

export function isMetamaskBrowser() {
  return navigator.userAgent.includes('MetaMask')
}

export function isIosBrowser() {
  const res = detect()
  return res && (res.name === 'ios-webview' || res.name === 'ios')
}

export function isOperaBrowser() {
  const res = detect()
  return res && res.name === 'opera'
}

export function isEdgeBrowser() {
  const res = detect()
  return res && res.name === 'edge'
}

export function isFirefoxBrowser() {
  const res = detect()
  return res && res.name === 'firefox'
}
