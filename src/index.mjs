import all from './all.mjs'
import catchif from './catchif.mjs'
import deferred from './deferred.mjs'
import delay from './delay.mjs'
import finally_ from './finally.mjs'
import isResolved from './is-resolved.mjs'
import map from './map.mjs'
import race from './race.mjs'
import reject from './reject.mjs'
import resolve from './resolve.mjs'
import timeout from './timeout.mjs'

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
