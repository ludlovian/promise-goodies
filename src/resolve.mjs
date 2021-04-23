import { polyfill } from './util'

export default function (P = Promise) {
  polyfill(P, {
    resolve (value) {
      return new P(resolve => resolve(value))
    }
  })
}
