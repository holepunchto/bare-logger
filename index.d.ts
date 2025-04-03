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
  constructor(options?: { colors: boolean })
}

declare interface SystemLog extends Log {}

declare class SystemLog {
  constructor()
}

declare namespace Log {
  export { Log, SystemLog }
}

export = Log
