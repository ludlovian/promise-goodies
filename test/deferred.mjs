import { test } from 'uvu'
import * as assert from 'uvu/assert'

import _deferred from '../src/deferred.mjs'
import _isResolved from '../src/is-resolved.mjs'

delete Promise.deferred
_deferred()
_isResolved()

test('deferred is a promise', async () => {
  const p = Promise.deferred()
  assert.ok(p instanceof Promise)
})

test('resolving', async () => {
  const v = {}
  const p = Promise.deferred()
  assert.not.ok(await p.isResolved())
  p.resolve(v)
  assert.is(await p, v)
})

test('rejecting', async () => {
  const e = new Error()
  const p = Promise.deferred()
  assert.not.ok(await p.isResolved())
  p.reject(e)
  await p.then(assert.unreachable, err => assert.is(err, e))
})

test.run()
