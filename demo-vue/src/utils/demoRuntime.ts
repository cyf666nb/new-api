import type { DemoPageDefinition } from '../generated/pages'

const loadedExternalScripts = new Map<string, Promise<void>>()
let cleanupCurrentPage: (() => void) | undefined

function loadExternalScript(src: string) {
  const existing = loadedExternalScripts.get(src)
  if (existing) return existing

  const promise = new Promise<void>((resolve, reject) => {
    const previous = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (previous) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(script)
  })

  loadedExternalScripts.set(src, promise)
  return promise
}

function clearGsapState() {
  window.ScrollTrigger?.getAll?.().forEach((trigger) => trigger.kill())
  window.gsap?.globalTimeline?.clear?.()
}

export function deactivateDemoPage() {
  cleanupCurrentPage?.()
  cleanupCurrentPage = undefined
  clearGsapState()
}

export async function activateDemoPage(page: DemoPageDefinition, pageId: string) {
  deactivateDemoPage()
  document.title = page.title
  window.scrollTo({ top: 0, left: 0 })

  for (const src of page.externalScripts) {
    await loadExternalScript(src)
  }

  const intervalIds: number[] = []
  const timeoutIds: number[] = []
  const windowListeners: Array<[string, EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined]> = []
  const documentListeners: Array<[string, EventListenerOrEventListenerObject, boolean | AddEventListenerOptions | undefined]> = []

  const originalSetInterval = window.setInterval
  const originalSetTimeout = window.setTimeout
  const originalWindowAdd = window.addEventListener
  const originalDocumentAdd = document.addEventListener

  window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const id = originalSetInterval(handler, timeout, ...args)
    intervalIds.push(id)
    return id
  }) as typeof window.setInterval

  window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
    const id = originalSetTimeout(handler, timeout, ...args)
    timeoutIds.push(id)
    return id
  }) as typeof window.setTimeout

  window.addEventListener = ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => {
    windowListeners.push([type, listener, options])
    return originalWindowAdd.call(window, type, listener, options)
  }) as typeof window.addEventListener

  document.addEventListener = ((
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => {
    documentListeners.push([type, listener, options])
    return originalDocumentAdd.call(document, type, listener, options)
  }) as typeof document.addEventListener

  try {
    for (const script of page.scripts) {
      const runScript = new Function(`${script}\n//# sourceURL=demo-vue-${pageId}.js`)
      runScript.call(window)
    }
  } finally {
    window.setInterval = originalSetInterval
    window.setTimeout = originalSetTimeout
    window.addEventListener = originalWindowAdd
    document.addEventListener = originalDocumentAdd
  }

  window.ScrollTrigger?.refresh?.()

  cleanupCurrentPage = () => {
    intervalIds.forEach((id) => window.clearInterval(id))
    timeoutIds.forEach((id) => window.clearTimeout(id))
    windowListeners.forEach(([type, listener, options]) => window.removeEventListener(type, listener, options))
    documentListeners.forEach(([type, listener, options]) => document.removeEventListener(type, listener, options))
  }
}
