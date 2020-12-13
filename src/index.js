import all from './all'
import catchif from './catchif'
import deferred from './deferred'
import delay from './delay'
import finally_ from './finally'
import isResolved from './is-resolved'
import map from './map'
import race from './race'
import reject from './reject'
import resolve from './resolve'
import timeout from './timeout'

export default function promiseGoodies (P = Promise) {
  if (typeof P !== 'function') return
  all(P)
  catchif(P)
  deferred(P)
  delay(P)
  finally_(P)
  isResolved(P)
  map(P)
  race(P)
  reject(P)
  resolve(P)
  timeout(P)
}
