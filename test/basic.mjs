import { test } from 'uvu'
import * as assert from 'uvu/assert'

import promiseGoodies from '../src/index.mjs'

delete Promise.resolve
delete Promise.reject
promiseGoodies()

test('can be run twice', () => {
  assert.not.throws(promiseGoodies)
})

test('ignores non functions', () => {
  assert.not.throws(() => promiseGoodies({}))
})

test('runs on custom classes', () => {
  class P {}
  promiseGoodies(P)
  assert.type(P.race, 'function')
})

test('Promise.resolve', async () => {
  const p = Promise.resolve(17)
  assert.is(await p, 17)
})

test('Promise.reject', async () => {
  const e = new Error()
  const p = Promise.reject(e)
  await p.then(
    () => {
      assert.unreachable()
    },
    err => {
      assert.is(err, e)
    }
  )
})

test.run()
