/** Options for `Log`. `colors` forces ANSI color styling on or off in formatted output. */
interface LogOptions {
  /** Whether this logger applies ANSI color styling to formatted output. Read-only. */
  colors?: boolean
}

interface Log {
  /** Whether this logger applies ANSI color styling to formatted output. Read-only. */
  readonly colors: boolean

  /**
   * Formats `data` the same way `debug`, `info`, `warn`, `error`, and `fatal` do, and returns the
   * resulting string without logging it.
   * @param data - Values to format and log; the first may be a `printf`-style format string (for
   * example `%s`, `%d`, `%o`) with the remaining values as substitutions.
   */
  format(...data: unknown[]): string

  /**
   * Logs `data` at debug level.
   * @param data - Values to format and log; the first may be a `printf`-style format string (for
   * example `%s`, `%d`, `%o`) with the remaining values as substitutions.
   */
  debug(...data: unknown[]): void
  /**
   * Logs `data` at info level.
   * @param data - Values to format and log; the first may be a `printf`-style format string (for
   * example `%s`, `%d`, `%o`) with the remaining values as substitutions.
   */
  info(...data: unknown[]): void
  /**
   * Logs `data` at warn level.
   * @param data - Values to format and log; the first may be a `printf`-style format string (for
   * example `%s`, `%d`, `%o`) with the remaining values as substitutions.
   */
  warn(...data: unknown[]): void
  /**
   * Logs `data` at error level.
   * @param data - Values to format and log; the first may be a `printf`-style format string (for
   * example `%s`, `%d`, `%o`) with the remaining values as substitutions.
   */
  error(...data: unknown[]): void
  /**
   * Logs `data` at fatal level.
   * @param data - Values to format and log; the first may be a `printf`-style format string (for
   * example `%s`, `%d`, `%o`) with the remaining values as substitutions.
   */
  fatal(...data: unknown[]): void

  /** Clears the log output. A no-op on the base `Log`. */
  clear(): void
}

declare class Log {
  /**
   * @param options - Logger options; `colors` forces ANSI color styling on or off, defaulting to
   * whether the output stream is a TTY.
   */
  constructor(options?: LogOptions)
}

interface CompositeLog extends Log {}

declare class CompositeLog {
  /**
   * @param logs - The loggers to forward every call to, in order.
   */
  constructor(logs: Log[])
}

/** Create a logger. `colors` defaults to whether the current stream is a TTY. */
declare namespace Log {
  export { Log, LogOptions, CompositeLog }
}

export = Log
