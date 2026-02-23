const test = require('brittle')
const { Log, CompositeLog } = require('.')

test('log levels', async (t) => {
  const log = new Log()

  await t.execution(() => log.debug('This is a debug log'))
  await t.execution(() => log.info('This is an info log'))
  await t.execution(() => log.warn('This is a warning log'))
  await t.execution(() => log.error('This is an error log'))
})

test('unicode', async (t) => {
  const log = new Log()

  await t.execution(() => log.debug('Hëllø wørld'))
  await t.execution(() => log.debug('😀'))
})

test('composite', async (t) => {
  const log1 = new Log()
  const log2 = new Log()
  const log = new CompositeLog([log1, log2])

  await t.execution(() => log.debug('Hëllø wørld'))
  await t.execution(() => log.debug('😀'))
})
