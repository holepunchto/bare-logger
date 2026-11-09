const test = require('brittle')
const env = require('bare-env')
const fs = require('bare-fs')
const os = require('bare-os')
const path = require('bare-path')
const { spawn } = require('bare-subprocess')
const { bin, run } = require('./test/helpers')
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

test('records of two threads do not interleave', { timeout: 120000 }, async (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bare-logger-'))
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }))

  const worker = path.join(__dirname, 'test/fixtures/threads-worker.js')
  const bundle = path.join(dir, 'worker.bundle')

  await run([bin('bare-pack'), '--linked', '-o', bundle, worker])
  await run([bin('bare-link'), '--host', `${os.platform()}-${os.arch()}`, '-o', dir, worker])

  const subprocess = spawn(
    os.execPath(),
    [path.join(__dirname, 'test/fixtures/threads.js'), bundle],
    {
      cwd: dir,
      stdio: ['ignore', 'pipe', 'inherit'],
      env: { ...env, LD_LIBRARY_PATH: path.join(dir, 'lib') }
    }
  )

  let output = ''

  for await (const data of subprocess.stdout) output += data

  await new Promise((resolve) => subprocess.on('exit', resolve))

  const lines = output.split('\n').filter((line) => line !== '')

  t.is(lines.length, 100, 'every record arrives')
  t.absent(
    lines.some((line) => line.includes('AB') || line.includes('BA')),
    'no record is cut by the other thread'
  )
})
