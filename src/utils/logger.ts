/**
 * AuthMaster Logger
 * @forgedevstack/forge-auth
 */

import type { LogLevel, LogEntry } from '../types';
import { LOG_LEVELS, LOG_COLORS, AUTH_MASTER } from '../constants';

// ============================================================================
// Logger Class
// ============================================================================

class AuthLogger {
  private level: LogLevel = 'info';
  private logs: LogEntry[] = [];
  private maxLogs = 100;
  private enabled = true;

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Check if level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled || this.level === 'none') return false;
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  /**
   * Format log message
   */
  private formatMessage(level: LogLevel, message: string): string[] {
    const color = LOG_COLORS[level as keyof typeof LOG_COLORS] || '#888';
    const levelLabel = level.toUpperCase().padEnd(5);
    
    return [
      `%c${AUTH_MASTER.logo} ${AUTH_MASTER.name}%c [${levelLabel}] %c${message}`,
      `color: #ec4899; font-weight: bold;`,
      `color: ${color}; font-weight: bold;`,
      `color: inherit;`,
    ];
  }

  /**
   * Store log entry
   */
  private storeLog(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
    };

    this.logs.push(entry);

    // Limit stored logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  /**
   * Debug log
   */
  debug(message: string, data?: unknown): void {
    this.storeLog('debug', message, data);
    if (!this.shouldLog('debug')) return;
    
    const formatted = this.formatMessage('debug', message);
    if (data !== undefined) {
      console.debug(...formatted, data);
    } else {
      console.debug(...formatted);
    }
  }

  /**
   * Info log
   */
  info(message: string, data?: unknown): void {
    this.storeLog('info', message, data);
    if (!this.shouldLog('info')) return;
    
    const formatted = this.formatMessage('info', message);
    if (data !== undefined) {
      console.info(...formatted, data);
    } else {
      console.info(...formatted);
    }
  }

  /**
   * Warn log
   */
  warn(message: string, data?: unknown): void {
    this.storeLog('warn', message, data);
    if (!this.shouldLog('warn')) return;
    
    const formatted = this.formatMessage('warn', message);
    if (data !== undefined) {
      console.warn(...formatted, data);
    } else {
      console.warn(...formatted);
    }
  }

  /**
   * Error log
   */
  error(message: string, data?: unknown): void {
    this.storeLog('error', message, data);
    if (!this.shouldLog('error')) return;
    
    const formatted = this.formatMessage('error', message);
    if (data !== undefined) {
      console.error(...formatted, data);
    } else {
      console.error(...formatted);
    }
  }

  /**
   * Group logs
   */
  group(label: string): void {
    if (!this.shouldLog('debug')) return;
    console.group(`${AUTH_MASTER.logo} ${label}`);
  }

  /**
   * End group
   */
  groupEnd(): void {
    if (!this.shouldLog('debug')) return;
    console.groupEnd();
  }

  /**
   * Log initialization
   */
  logInit(): void {
    if (this.level === 'none') return;

    console.log(
      `%c${AUTH_MASTER.logo} ${AUTH_MASTER.name} v${AUTH_MASTER.version}%c initialized`,
      'color: #ec4899; font-weight: bold; font-size: 14px;',
      'color: #22c55e; font-size: 14px;'
    );
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

export const logger = new AuthLogger();
