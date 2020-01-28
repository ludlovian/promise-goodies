export function polyfill (target, source) {
  for (const key of Object.keys(source)) {
    if (!(key in target)) target[key] = source[key]
  }
}

export function getIterator (iterable) {
  if (Symbol.asyncIterator in iterable) {
    return iterable[Symbol.asyncIterator]()
  }
  if (Symbol.iterator in iterable) {
    return iterable[Symbol.iterator]()
  }
  throw new TypeError('It is not an iterable')
}

export function errorMatches (predicate, error) {
  if (typeof predicate === 'function') return error instanceof predicate
  if (
    predicate &&
    typeof predicate === 'object' &&
    error &&
    typeof error === 'object'
  ) {
    for (const [k, v] of Object.entries(predicate)) {
      if (typeof v === 'function') {
        if (!v(error[k])) return false
      } else {
        if (v !== error[k]) return false
      }
    }
    return true
  }
  return false
}
