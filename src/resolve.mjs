import { polyfill } from './util.mjs'

export default function (P = Promise) {
  polyfill(P, {
    resolve (value) {
      return new P(resolve => resolve(value))
    }
  })
}
