import test from 'ava'

import _resolve from '../src/resolve'

delete Promise.resolve
_resolve()

test('resolve works', async t => {
  const value = {}
  const p = Promise.resolve(value)
  t.is(await p, value)
})
