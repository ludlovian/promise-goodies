import { test } from 'uvu'
import * as assert from 'uvu/assert'

import _catchif from '../src/catchif.mjs'

delete Promise.prototype.catchif
_catchif()

test('empty object catches', async () => {
  const e = new Error()

  await Promise.reject(e)
    .catchif({}, err => {
      assert.is(err, e)
    })
    .catch(assert.unreachable)
})

test('catches on constructor', async () => {
  class MyError extends Error {}

  const e = new MyError()

  await Promise.reject(e)
    .catchif(MyError, err => {
      assert.is(err, e)
    })
    .catch(assert.unreachable)
})

test('misses on constructor', async () => {
  class MyError extends Error {}

  const e = new Error()

  await Promise.reject(e)
    .catchif(MyError, assert.unreachable)
    .catch(err => {
      assert.is(err, e)
    })
    .catch(assert.unreachable)
})

test('catch on property value', async () => {
  const e = new Error()
  e.foo = 'bar'

  await Promise.reject(e)
    .catchif({ foo: 'bar' }, err => {
      assert.is(err, e)
    })
    .catch(assert.unreachable)
})

test('miss on property value', async () => {
  const e = new Error()
  e.foo = 'bar'
  e.baz = 'quux'

  await Promise.reject(e)
    .catchif({ foo: 'bar', baz: 'foobar' }, assert.unreachable)
    .catch(err => {
      assert.is(err, e)
    })
})

test('catch on property function', async () => {
  const e = new Error()
  e.foo = 'bar'

  const pred = {
    foo (v) {
      assert.is(v, 'bar')
      return true
    }
  }

  await Promise.reject(e)
    .catchif(pred, err => {
      assert.is(err, e)
    })
    .catch(assert.unreachable)
})

test('miss on property function', async () => {
  const e = new Error()
  e.baz = 'quux'
  e.foo = 'bar'

  const pred = {
    baz: 'quux',
    foo (v) {
      assert.is(v, 'bar')
      return false
    }
  }

  await Promise.reject(e)
    .catchif(pred, assert.unreachable)
    .catch(err => {
      assert.is(err, e)
    })
})

test('unknown type of predicate', async () => {
  const e = new Error()

  await Promise.reject(e)
    .catchif('foobar', assert.unreachable)
    .catch(err => {
      assert.is(err, e)
    })
})

test('non object error', async () => {
  const e = 'foobar'

  await Promise.reject(e)
    .catchif({}, assert.unreachable)
    .catch(err => {
      assert.is(err, e)
    })
})

test.run()
