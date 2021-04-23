import { polyfill } from './util.mjs'

export default function (P = Promise) {
  polyfill(P, {
    deferred () {
      let resolve
      let reject
      const p = new this((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
      })
      return Object.assign(p, { resolve, reject })
    }
  })
}
