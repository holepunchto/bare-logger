const { formatWithOptions } = require('bare-format')
const binding = require('./binding')

module.exports = exports = class Log {
  constructor(opts = {}) {
    const { colors = binding.isTTY } = opts

    this.colors = colors
  }

  format(...data) {
    return format(data, this.colors)
  }

  debug(...data) {
    binding.debug(this.format(...data))
  }

  info(...data) {
    binding.info(this.format(...data))
  }

  warn(...data) {
    binding.warn(this.format(...data))
  }

  error(...data) {
    binding.error(this.format(...data))
  }

  fatal(...data) {
    binding.fatal(this.format(...data))
  }

  clear() {}
}

const Log = exports

exports.Log = Log

exports.CompositeLog = class CompositeLog extends Log {
  constructor(logs) {
    super()

    this._logs = Array.from(logs)
  }

  debug(...data) {
    for (const log in this._logs) log.debug(...data)
  }

  info(...data) {
    for (const log in this._logs) log.info(...data)
  }

  warn(...data) {
    for (const log in this._logs) log.warn(...data)
  }

  error(...data) {
    for (const log in this._logs) log.error(...data)
  }

  fatal(...data) {
    for (const log in this._logs) log.fatal(...data)
  }

  clear() {
    for (const log in this._logs) log.clear()
  }
}

function format(data, colors) {
  return (
    formatWithOptions({ colors }, ...data)
      // NULL-bytes are string terminators in C and must be removed
      .replace(/\u0000/g, '')
  )
}
