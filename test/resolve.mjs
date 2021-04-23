import test from 'ava'

import _resolve from '../src/resolve.mjs'

delete Promise.resolve
_resolve()

test('resolve works', async t => {
  const value = {}
  const p = Promise.resolve(value)
  t.is(await p, value)
})
