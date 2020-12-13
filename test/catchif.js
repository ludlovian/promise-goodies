import test from 'ava'

import _catchif from '../src/catchif'

delete Promise.prototype.catchif
_catchif()

test('empty object catches', async t => {
  const e = new Error()

  await Promise.reject(e)
    .catchif({}, err => {
      t.is(err, e)
    })
    .catch(t.fail)
})

test('catches on constructor', async t => {
  class MyError extends Error {}

  const e = new MyError()

  await Promise.reject(e)
    .catchif(MyError, err => {
      t.is(err, e)
    })
    .catch(t.fail)
})

test('misses on constructor', async t => {
  class MyError extends Error {}

  const e = new Error()

  await Promise.reject(e)
    .catchif(MyError, t.fail)
    .catch(err => {
      t.is(err, e)
    })
    .catch(t.fail)
})

test('catch on property value', async t => {
  const e = new Error()
  e.foo = 'bar'

  await Promise.reject(e)
    .catchif({ foo: 'bar' }, err => {
      t.is(err, e)
    })
    .catch(t.fail)
})

test('miss on property value', async t => {
  const e = new Error()
  e.foo = 'bar'
  e.baz = 'quux'

  await Promise.reject(e)
    .catchif({ foo: 'bar', baz: 'foobar' }, t.fail)
    .catch(err => {
      t.is(err, e)
    })
})

test('catch on property function', async t => {
  const e = new Error()
  e.foo = 'bar'

  const pred = {
    foo (v) {
      t.is(v, 'bar')
      return true
    }
  }

  await Promise.reject(e)
    .catchif(pred, err => {
      t.is(err, e)
    })
    .catch(t.fail)
})

test('miss on property function', async t => {
  const e = new Error()
  e.baz = 'quux'
  e.foo = 'bar'

  const pred = {
    baz: 'quux',
    foo (v) {
      t.is(v, 'bar')
      return false
    }
  }

  await Promise.reject(e)
    .catchif(pred, t.fail)
    .catch(err => {
      t.is(err, e)
    })
})

test('unknown type of predicate', async t => {
  const e = new Error()

  await Promise.reject(e)
    .catchif('foobar', t.fail)
    .catch(err => {
      t.is(err, e)
    })
})

test('non object error', async t => {
  const e = 'foobar'

  await Promise.reject(e)
    .catchif({}, t.fail)
    .catch(err => {
      t.is(err, e)
    })
})
