import test from 'ava'

import _reject from '../src/reject.mjs'

delete Promise.reject
_reject()

test('reject throws', async t => {
  const e = new Error()
  const p = Promise.reject(e)
  await t.throwsAsync(p, { is: e })
})
