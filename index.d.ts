interface LogOptions {
  colors?: boolean
}

interface Log {
  readonly colors: boolean

  format(...data: unknown[]): string

  debug(...data: unknown[]): void
  info(...data: unknown[]): void
  warn(...data: unknown[]): void
  error(...data: unknown[]): void
  fatal(...data: unknown[]): void

  clear(): void
}

declare class Log {
  constructor(options?: LogOptions)
}

interface SystemLog extends Log {}

declare class SystemLog {
  constructor()
}

interface CompositeLog extends Log {}

declare class CompositeLog {
  constructor(logs: Log[])
}

declare namespace Log {
  export { Log, LogOptions, SystemLog, CompositeLog }
}

export = Log
