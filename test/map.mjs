import { test } from 'uvu'
import * as assert from 'uvu/assert'

import _map from '../src/map.mjs'
import _delay from '../src/delay.mjs'

delete Promise.prototype.map
delete Promise.map
_map()
_delay()

test('simple instance iterator', async () => {
  const p = Promise.resolve([1, 2, 3]).map(x => 10 * x)
  assert.equal(await p, [10, 20, 30])
})

test('simple class iterator', async () => {
  const p = Promise.map([1, 2, 3], x => 10 * x)
  assert.equal(await p, [10, 20, 30])
})

test('async instance iterator', async () => {
  async function * iter () {
    await Promise.delay(10)
    yield 1
    await Promise.delay(10)
    yield 2
    await Promise.delay(10)
    yield 3
  }

  const p = Promise.resolve(iter()).map(x => x * 10)
  assert.equal(await p, [10, 20, 30])
})

test('async map function', async () => {
  const p = Promise.map([3, 1, 2], async x => {
    await Promise.delay(10 * x)
    return 10 * x
  })
  assert.equal(await p, [30, 10, 20])
})

test('empty iterable', async () => {
  const p = Promise.map([], x => x)
  assert.equal(await p, [])
})

test('concurrency limited', async () => {
  let count = 0
  async function fn (x) {
    count++
    assert.ok(count <= 3)
    await Promise.delay(30)
    count--
    return x * 10
  }

  const result = await Promise.map([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], fn, {
    concurrency: 3
  })

  assert.equal(result, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
})

test('non-iterable', async () => {
  await Promise.map({}, x => x).then(assert.unreachable, err =>
    assert.instance(err, Error)
  )
})

test('iterable that wait before ending', async () => {
  async function * fn () {
    yield 1
    yield 2
    yield 3
    await Promise.delay(30)
  }

  const result = await Promise.map(fn(), x => x * 2)
  assert.equal(result, [2, 4, 6])
})

test('mapper that throws', async t => {
  const e = new Error()

  function fn (x) {
    if (x === 2) throw e
    return x * 2
  }
  const p = Promise.resolve([1, 2, 3]).map(fn)
  await p.then(assert.unreachable, err => assert.is(err, e))
})

test.run()
