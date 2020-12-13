import { polyfill, getIterator } from './util'

export default function (P = Promise) {
  polyfill(P.prototype, {
    map (fn, { concurrency = Infinity } = {}) {
      return this.then(
        iterable =>
          new P((resolve, reject) => {
            const iterator = getIterator(iterable)
            let active = 0
            let count = 0
            const result = []
            let done

            fetchItem()

            function fetchItem () {
              if (done) return
              const item = iterator.next()
              if (item.then) item.then(startItem, reject)
              else startItem(item)
            }

            function startItem (item) {
              if (item.done) {
                done = true
                if (!active) resolve(result)
                return
              }
              active++
              const idx = count++
              P.resolve(item.value)
                .then(value => fn(value, idx))
                .then(value => {
                  result[idx] = value
                  active--
                  fetchItem()
                  if (done && !active) resolve(result)
                })
                .catch(reject)
              if (active < concurrency) fetchItem()
            }
          })
      )
    }
  })

  polyfill(P, {
    map (iterable, fn, opts) {
      return P.resolve(iterable).map(fn, opts)
    }
  })
}
