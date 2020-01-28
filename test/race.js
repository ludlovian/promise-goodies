import test from 'ava'

import promiseGoodies from '../src'

delete Promise.race
promiseGoodies()

test('race where first wins', async t => {
  const p = Promise.race([
    Promise.resolve(11).delay(10),
    Promise.resolve(22).delay(20)
  ])
  t.is(await p, 11)
})

test('race where second wins', async t => {
  const p = Promise.race([
    Promise.resolve(11).delay(20),
    Promise.resolve(22).delay(10)
  ])
  t.is(await p, 22)
})

test('race that throws', async t => {
  const e = new Error()
  const p = Promise.race([
    Promise.resolve(11).delay(20),
    Promise.reject(e).delay(10)
  ])
  await t.throwsAsync(p, { is: e })
})
