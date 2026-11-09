const Log = require('../..')

const { tag, barrier } = Bare.Thread.self.data

const log = new Log({ colors: false })

const line = tag.repeat(200000)

const READY_INDEX = 0

const counter = new Int32Array(barrier)

if (Atomics.add(counter, READY_INDEX, 1) === 0) Atomics.wait(counter, READY_INDEX, 1)
else Atomics.notify(counter, READY_INDEX)

for (let i = 0; i < 50; i++) log.info(line)
