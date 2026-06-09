type AnyFunction = (...args: any[]) => any

type ThrottledFn<TArgs extends any[]> = ((...args: TArgs) => void) & {
  cancel: () => void
  flush: () => void
}

export function throttle<T extends AnyFunction>(
  func: T,
  limit: number
): ThrottledFn<Parameters<T>> {
  let inThrottle: boolean = false
  let lastArgs: Parameters<T> | null = null
  let lastThis: unknown = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function cleanup(): void {
    inThrottle = false
    lastArgs = null
    lastThis = null
    timeoutId = null
  }

  const throttled = function (this: unknown, ...args: Parameters<T>): void {
    lastArgs = args as Parameters<T>
    lastThis = this

    if (!inThrottle) {
      func.apply(this, args)
      lastArgs = null
      lastThis = null
      inThrottle = true

      timeoutId = setTimeout((): void => {
        if (lastArgs !== null) {
          func.apply(lastThis, lastArgs)
        }
        cleanup()
      }, limit)
    }
  } as ThrottledFn<Parameters<T>>

  throttled.cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    cleanup()
  }

  throttled.flush = (): void => {
    if (inThrottle && lastArgs !== null) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
      func.apply(lastThis, lastArgs)
      cleanup()
    }
  }

  return throttled
}

export default { throttle }
