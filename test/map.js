import test from 'ava'

import _map from '../src/map'
import _delay from '../src/delay'

delete Promise.prototype.map
delete Promise.map
_map()
_delay()

test('simple instance iterator', async t => {
  const p = Promise.resolve([1, 2, 3]).map(x => 10 * x)
  t.deepEqual(await p, [10, 20, 30])
})

test('simple class iterator', async t => {
  const p = Promise.map([1, 2, 3], x => 10 * x)
  t.deepEqual(await p, [10, 20, 30])
})

test('async instance iterator', async t => {
  async function * iter () {
    await Promise.delay(10)
    yield 1
    await Promise.delay(10)
    yield 2
    await Promise.delay(10)
    yield 3
  }

  const p = Promise.resolve(iter()).map(x => x * 10)
  t.deepEqual(await p, [10, 20, 30])
})

test('async map function', async t => {
  const p = Promise.map([3, 1, 2], async x => {
    await Promise.delay(10 * x)
    return 10 * x
  })
  t.deepEqual(await p, [30, 10, 20])
})

test('empty iterable', async t => {
  const p = Promise.map([], x => x)
  t.deepEqual(await p, [])
})

test('concurrency limited', async t => {
  let count = 0
  async function fn (x) {
    count++
    t.true(count <= 3)
    await Promise.delay(30)
    count--
    return x * 10
  }

  const result = await Promise.map([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], fn, {
    concurrency: 3
  })

  t.deepEqual(result, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
})

test('non-iterable', async t => {
  await t.throwsAsync(() => Promise.map({}, x => x))
})

test('iterable that wait before ending', async t => {
  async function * fn () {
    yield 1
    yield 2
    yield 3
    await Promise.delay(30)
  }

  const result = await Promise.map(fn(), x => x * 2)
  t.deepEqual(result, [2, 4, 6])
})

test('mapper that throws', async t => {
  const e = new Error()

  function fn (x) {
    if (x === 2) throw e
    return x * 2
  }
  const p = Promise.resolve([1, 2, 3]).map(fn)
  await t.throwsAsync(p, { is: e })
})
