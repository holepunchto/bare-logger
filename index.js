const { formatWithOptions } = require('bare-format')
const binding = require('./binding')

module.exports = exports = class Log {
  format(...data) {
    return format(data, binding.isTTY)
  }

  debug(...data) {
    binding.debug(this.format(...data), false)
  }

  info(...data) {
    binding.info(this.format(...data), false)
  }

  warn(...data) {
    binding.warn(this.format(...data), false)
  }

  error(...data) {
    binding.error(this.format(...data), false)
  }

  fatal(...data) {
    binding.fatal(this.format(...data), false)
  }

  clear() {}
}

const Log = exports

exports.Log = Log

exports.SystemLog = class SystemLog extends Log {
  format(...data) {
    return format(data, false)
  }

  debug(...data) {
    binding.debug(this.format(...data), true)
  }

  info(...data) {
    binding.info(this.format(...data), true)
  }

  warn(...data) {
    binding.warn(this.format(...data), true)
  }

  error(...data) {
    binding.error(this.format(...data), true)
  }

  fatal(...data) {
    binding.fatal(this.format(...data), true)
  }

  clear() {}
}

function format(data, colors) {
  return (
    formatWithOptions({ colors }, ...data)
      // NULL-bytes are string terminators in C and must be removed
      .replace(/\u0000/g, '')
  )
}
