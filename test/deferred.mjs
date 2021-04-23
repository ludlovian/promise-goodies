import test from 'ava'

import _deferred from '../src/deferred.mjs'
import _isResolved from '../src/is-resolved.mjs'

delete Promise.deferred
_deferred()
_isResolved()

test('deferred is a promise', async t => {
  const p = Promise.deferred()
  t.true(p instanceof Promise)
})

test('resolving', async t => {
  const v = {}
  const p = Promise.deferred()
  t.false(await p.isResolved())
  p.resolve(v)
  t.is(await p, v)
})

test('rejecting', async t => {
  const e = new Error()
  const p = Promise.deferred()
  t.false(await p.isResolved())
  p.reject(e)
  await t.throwsAsync(p, { is: e })
})
