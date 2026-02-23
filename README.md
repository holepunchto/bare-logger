# bare-logger

Low-level logger for Bare.

## Usage

```js
const Log = require('bare-logger')

const log = new Log()

log.info('Hello %s', 'world!')
```

## Multiple loggers

`CompositeLog` can be used to output to multiple loggers. Such as console and file loggers.

```js
const { Log, CompositeLog } = require('bare-logger')

const log1 = new Log()
const log2 = new Log()
const log = new CompositeLog([log1, log2])

log.info('Hello %s', 'world!')
```

## License

Apache-2.0
