const fs = require('bare-fs')
const Pipe = require('bare-pipe')

const pipe = new Pipe(1)

const bundle = fs.readFileSync(Bare.argv[2])
const barrier = new SharedArrayBuffer(4)

const a = new Bare.Thread('bare:/thread.bundle', bundle, { data: { tag: 'A', barrier } })
const b = new Bare.Thread('bare:/thread.bundle', bundle, { data: { tag: 'B', barrier } })

a.join()
b.join()

pipe.unref()
