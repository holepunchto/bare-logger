declare class Log {
  format(...data: any[]): string

  debug(...data: any[]): void
  info(...data: any[]): void
  warn(...data: any[]): void
  error(...data: any[]): void
  fatal(...data: any[]): void

  clear(): void
}

declare namespace Log {
  export { Log, Log as SystemLog }
}

export = Log
