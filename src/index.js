import { polyfill } from './util'
import classPolyfill from './class'
import instancePolyfill from './instance'

export default function promiseGoodies (P = Promise) {
  if (typeof P !== 'function') return
  polyfill(P, classPolyfill)
  polyfill(P.prototype, instancePolyfill)
}
