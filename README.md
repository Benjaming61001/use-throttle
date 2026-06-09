# use-throttle

A lightweight TypeScript throttle function implementation that fires on the leading edge, preserving `this` context and parameters.

## Installation

```bash
npm install @benjaming61001/use-throttle
```

```bash
bun add @benjaming61001/use-throttle
```

```bash
yarn add @benjaming61001/use-throttle
```

```bash
pnpm add @benjaming61001/use-throttle
```

## Usage

### Basic Usage

```typescript
import { throttle } from '@benjaming61001/use-throttle'

const throttledScroll = throttle((event: Event) => {
  console.log('Scroll event:', event.target)
}, 200)

window.addEventListener('scroll', throttledScroll)
```

### Cancel & Flush

```typescript
const throttledSave = throttle((data: FormData) => {
  api.save(data)
}, 1000)

// Cancel pending execution
throttledSave.cancel()

// Flush pending execution immediately
throttledSave.flush()
```

### Preserving Context

```typescript
class ScrollController {
  position = 0

  handleScroll = throttle((event: Event) => {
    console.log(this.position) // `this` is preserved
    this.position = window.scrollY
  }, 100)
}
```

## API

### `throttle(func, limit)`

Creates a throttled version of a function that only invokes `func` at most once per every `limit` milliseconds. The function fires on the leading edge of the timeout.

| Parameter | Type | Description |
|-----------|------|-------------|
| `func` | `(...args: TArgs) => void` | The function to throttle |
| `limit` | `number` | The number of milliseconds to throttle invocations to |

**Returns:** A throttled function with `cancel()` and `flush()` methods.

### `cancel()`

Cancels any pending throttled function execution.

### `flush()`

Immediately executes the throttled function if there's a pending call, then cancels any further pending execution.

## Development

```bash
bun install
bun run test        # run tests
bun run test:watch  # watch mode
bun run build       # build package
```

## License

MIT
