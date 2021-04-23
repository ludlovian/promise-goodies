import { polyfill } from './util'

export default function (P = Promise) {
  polyfill(P.prototype, {
    delay (ms) {
      return this.then(
        value => new P(resolve => setTimeout(() => resolve(value), ms))
      )
    }
  })

  polyfill(P, {
    delay (ms, value) {
      return this.resolve(value).delay(ms)
    }
  })
}
