/**
 * A generic type constraint for any function.
 */
type AnyFunction = (...args: any[]) => any

/**
 * Creates a throttled function factory.
 *
 * This function returns a new, throttled version of the passed function (`func`).
 * The throttled function will only be invoked at most once per every `limit`
 * milliseconds.
 *
 * This implementation invokes the function on the "leading edge" of the timeout.
 *
 * @param func The function to throttle.
 * @param limit The number of milliseconds to throttle invocations to.
 * @returns A new, throttled function.
 */
export function throttle<T extends AnyFunction> (
  func: T,
  limit: number
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args)

      inThrottle = true

      setTimeout((): void => {
        inThrottle = false
      }, limit)
    }
  }
}
