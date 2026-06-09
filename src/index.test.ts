import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { throttle } from './index'

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should throttle function calls', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 500)

    throttled()
    throttled()
    throttled()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should pass arguments to the throttled function', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 500)

    throttled('a', 'b')

    expect(fn).toHaveBeenCalledWith('a', 'b')
  })

  it('should use the last arguments when called multiple times', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 500)

    throttled('first')
    throttled('second')
    throttled('third')

    expect(fn).toHaveBeenCalledWith('first')

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledWith('third')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should not allow calls during throttle period', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 500)

    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(250)
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(250)
    throttled()
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('should cancel pending execution', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 500)

    throttled()
    throttled.cancel()

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should flush pending execution immediately', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 500)

    throttled()
    throttled()
    throttled.flush()

    expect(fn).toHaveBeenCalledTimes(2)

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should do nothing on flush when no pending call', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 500)

    throttled.flush()

    expect(fn).not.toHaveBeenCalled()
  })

  it('should preserve this context', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 500)

    const obj = { throttled, value: 42 }
    obj.throttled()

    expect(fn.mock.contexts[0]).toBe(obj)
  })

  it('should work with no arguments', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 500)

    throttled()

    expect(fn).toHaveBeenCalledWith()
  })

  it('should handle multiple cancel calls', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 500)

    throttled()
    throttled.cancel()
    throttled.cancel()

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should handle cancel after flush', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 500)

    throttled()
    throttled.flush()
    throttled.cancel()

    vi.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
