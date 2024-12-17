declare class Log {
  static Log: typeof Log

  format(...data: any[]): string

  debug(...data: any[]): void
  info(...data: any[]): void
  warn(...data: any[]): void
  error(...data: any[]): void
  fatal(...data: any[]): void

  clear(): void
}

declare namespace Log {
  export class SystemLog {
    format(...data: any[]): string

    debug(...data: any[]): void
    info(...data: any[]): void
    warn(...data: any[]): void
    error(...data: any[]): void
    fatal(...data: any[]): void

    clear(): void
  }
}

export = Log
