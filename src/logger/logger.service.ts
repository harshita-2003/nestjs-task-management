import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private getTime(): string {
    return new Date().toISOString();
  }

  log(message: string) {
    console.log(`\x1b[32m[LOG] [${this.getTime()}]\x1b[0m ${message}`);
  }

  error(message: string, trace?: string) {
    console.error(`\x1b[31m[ERROR] [${this.getTime()}]\x1b[0m ${message}`);
    if (trace) console.error(`\x1b[90m${trace}\x1b[0m`);
  }

  warn(message: string) {
    console.warn(`\x1b[33m[WARNING] [${this.getTime()}]\x1b[0m ${message}`);
  }

  debug(message: string) {
    console.debug(`\x1b[36m[DEBUG] [${this.getTime()}]\x1b[0m ${message}`);
  }

  verbose(message: string) {
    console.log(`\x1b[35m[VERBOSE] [${this.getTime()}]\x1b[0m ${message}`);
  }
}
