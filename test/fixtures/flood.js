const Pipe = require('bare-pipe')
const Log = require('../..')

const pipe = new Pipe(1)

const log = new Log({ colors: false })

for (let i = 0; i < 20000; i++) log.info(`line ${i} ${'x'.repeat(40)}`)

setTimeout(() => {}, 3000)

pipe.unref()
