interface Log {
  format(...data: unknown[]): string

  debug(...data: unknown[]): void
  info(...data: unknown[]): void
  warn(...data: unknown[]): void
  error(...data: unknown[]): void
  fatal(...data: unknown[]): void

  clear(): void
}

declare class Log {}

declare namespace Log {
  export { Log, Log as SystemLog }
}

export = Log
