import test from 'ava'

import promiseGoodies from '../src'

delete Promise.all
promiseGoodies()

test('all on array', async t => {
  const p = Promise.all([
    Promise.resolve(11).delay(30),
    Promise.resolve(22).delay(10),
    Promise.resolve(33).delay(20)
  ])
  t.deepEqual(await p, [11, 22, 33])
})

test('all on empty array', async t => {
  const p = Promise.all([])
  t.deepEqual(await p, [])
})

test('all which rejects', async t => {
  const e = new Error()
  const p = Promise.all([
    Promise.resolve(11).delay(10),
    Promise.reject(e).delay(30),
    Promise.resolve(33).delay(20)
  ])
  await t.throwsAsync(p, { is: e })
})
