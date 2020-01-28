import { getIterator, errorMatches } from './util'

export default {
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
  },

  map (fn, { concurrency = Infinity } = {}) {
    const P = this.constructor
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
  },

  delay (ms) {
    const P = this.constructor
    return this.then(
      value => new P(resolve => setTimeout(() => resolve(value), ms))
    )
  },

  timeout (ms, TimeoutError = Error) {
    const P = this.constructor
    const that = this
    return new P((resolve, reject) => {
      let tm = setTimeout(() => {
        tm = undefined
        reject(new TimeoutError('Timed out'))
      }, ms)
      that.then(value => {
        // istanbul ignore else
        if (tm) {
          clearTimeout(tm)
          tm = undefined
          resolve(value)
        }
      }, reject)
    })
  },

  catchif (predicate, fn) {
    return this.catch(error => {
      if (errorMatches(predicate, error)) return fn(error)
      throw error
    })
  },

  isResolved (ms = 10) {
    const P = this.constructor
    return P.race([P.delay(ms).then(() => false), this.then(() => true)])
  }
}
