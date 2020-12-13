import { polyfill } from './util'

export default function (P = Promise) {
  polyfill(P.prototype, {
    finally (fn) {
      return this.then(
        v => {
          fn()
          return v
        },
        r => {
          fn()
          throw r
        }
      )
    }
  })
}
