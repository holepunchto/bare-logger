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

## API

See the [`bare-logger` reference](https://docs.pears.com/reference/bare/modules/bare-logger).

## Threat model

`bare-logger` is one of the addons Bare compiles into its binary, so it inherits [Bare's threat model](https://github.com/holepunchto/bare/blob/main/docs/threat-model.md). See [`docs/threat-model.md`](docs/threat-model.md) for where this addon sits in it.

## License

Apache-2.0
