import { polyfill, errorMatches } from './util.mjs'

export default function (P = Promise) {
  polyfill(P.prototype, {
    catchif (predicate, fn) {
      return this.catch(error => {
        if (errorMatches(predicate, error)) return fn(error)
        throw error
      })
    }
  })
}
