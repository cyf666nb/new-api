/// <reference types="vite/client" />

declare global {
  interface Window {
    gsap?: {
      registerPlugin?: (plugin: unknown) => void
      to?: (...args: unknown[]) => unknown
      timeline?: (...args: unknown[]) => unknown
      utils?: {
        toArray?: (selector: string) => Element[]
      }
      globalTimeline?: {
        clear?: () => void
      }
    }
    ScrollTrigger?: {
      create?: (...args: unknown[]) => unknown
      getAll?: () => Array<{ kill: () => void }>
      refresh?: () => void
    }
  }
}

export {}
