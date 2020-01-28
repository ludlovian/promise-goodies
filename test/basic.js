import test from 'ava'

import promiseGoodies from '../src'

delete Promise.resolve
delete Promise.reject
promiseGoodies()

test('can be run twice', t => {
  t.notThrows(promiseGoodies)
})

test('ignores non functions', t => {
  t.notThrows(() => promiseGoodies({}))
})

test('runs on custom classes', t => {
  class P {}
  promiseGoodies(P)
  t.true(typeof P.race === 'function')
})

test('Promise.resolve', async t => {
  const p = Promise.resolve(17)
  t.is(await p, 17)
})

test('Promise.reject', async t => {
  const e = new Error()
  const p = Promise.reject(e)
  await t.throwsAsync(p, { is: e })
})
