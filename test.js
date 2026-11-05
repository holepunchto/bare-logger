const test = require('brittle')
const os = require('bare-os')
const path = require('bare-path')
const { spawn } = require('bare-subprocess')
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

test('unpaired surrogate', async (t) => {
  const log = new Log()

  await t.execution(() => log.debug('\ud800'.repeat(1024)))
})

test('composite', async (t) => {
  const log1 = new Log()
  const log2 = new Log()
  const log = new CompositeLog([log1, log2])

  await t.execution(() => log.debug('Hëllø wørld'))
  await t.execution(() => log.debug('😀'))
})

test('records survive a full non-blocking pipe', async (t) => {
  const subprocess = spawn(os.execPath(), [path.join(__dirname, 'test/fixtures/flood.js')], {
    stdio: ['ignore', 'pipe', 'inherit']
  })

  const exited = new Promise((resolve) => subprocess.on('exit', resolve))

  let output = ''
  let stalled = false

  for await (const data of subprocess.stdout) {
    output += data

    if (!stalled) {
      stalled = true

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  await exited

  const lines = output.split('\n').filter((line) => line !== '')

  t.is(lines.length, 20000)
})
