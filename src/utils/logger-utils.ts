/**
 * Logging utilities for Calendar Card Pro
 * Provides consistent log formatting, level-based filtering, and error handling
 */

let DEBUG_MODE = false;

// Add a flag to ensure the banner only shows once per session
let BANNER_SHOWN = false;

// Different log levels
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// Current log level - set to WARN for production
let CURRENT_LOG_LEVEL = LogLevel.WARN;

// Styling for log messages
const LOG_STYLES = {
  // Title pill (left side - dark grey with emoji)
  title: [
    'background: #424242',
    'color: white',
    'display: inline-block',
    'line-height: 20px',
    'text-align: center',
    'border-radius: 20px 0 0 20px',
    'font-size: 12px',
    'font-weight: bold',
    'padding: 4px 8px 4px 12px',
    'margin: 5px 0',
  ].join(';'),

  // Version pill (right side - pale blue)
  version: [
    'background: #4fc3f7',
    'color: white',
    'display: inline-block',
    'line-height: 20px',
    'text-align: center',
    'border-radius: 0 20px 20px 0',
    'font-size: 12px',
    'font-weight: bold',
    'padding: 4px 12px 4px 8px',
    'margin: 5px 0',
  ].join(';'),

  // Standard prefix (non-pill version for regular logs)
  prefix: ['color: #4fc3f7', 'font-weight: bold'].join(';'),

  // Error styling
  error: ['color: #f44336', 'font-weight: bold'].join(';'),

  // Warning styling
  warn: ['color: #ff9800', 'font-weight: bold'].join(';'),
};

/**
 * Initialize the logger with the component version
 * @param version Current component version
 * @param debugMode Whether to enable debug mode
 */
export function initializeLogger(version: string, debugMode: boolean = false): void {
  DEBUG_MODE = debugMode;
  // Use WARN as default production level instead of INFO
  CURRENT_LOG_LEVEL = debugMode ? LogLevel.DEBUG : LogLevel.WARN;

  // Show version banner (always show this regardless of log level)
  printVersionBanner(version);
}

/**
 * Print the welcome banner with version info
 * @param version Component version
 */
export function printVersionBanner(version: string): void {
  // Only show banner once per browser session
  if (BANNER_SHOWN) return;

  console.groupCollapsed(
    '%c📅 Calendar Card Pro%cv' + version + ' ',
    LOG_STYLES.title,
    LOG_STYLES.version,
  );
  console.log(
    '%c Description: %c A calendar card that supports multiple calendars with individual styling. ',
    'font-weight: bold',
    'font-weight: normal',
  );
  console.log(
    '%c GitHub: %c https://github.com/alexpfau/calendar-card-pro ',
    'font-weight: bold',
    'font-weight: normal',
  );
  console.groupEnd();

  // Mark banner as shown
  BANNER_SHOWN = true;
}

/**
 * Log any error message with flexible argument handling
 * @param messageOrError - String message or Error object
 * @param ...data - Additional data to log
 */
export function error(messageOrError: string | Error | unknown, ...data: unknown[]): void {
  if (CURRENT_LOG_LEVEL < LogLevel.ERROR) return;

  // Handle Error objects
  if (messageOrError instanceof Error) {
    // Extract error details
    const errorMessage = messageOrError.message || 'Unknown error';
    console.error(`%c[Calendar-Card-Pro] Error: ${errorMessage}`, LOG_STYLES.error);

    // Log stack trace if available
    if (messageOrError.stack) {
      console.error(messageOrError.stack);
    }

    // Log additional data if provided
    if (data.length > 0) {
      console.error('Additional context:', ...data);
    }
  }
  // Handle string messages
  else if (typeof messageOrError === 'string') {
    if (data.length > 0) {
      console.error(`%c[Calendar-Card-Pro] ${messageOrError}`, LOG_STYLES.error, ...data);
    } else {
      console.error(`%c[Calendar-Card-Pro] ${messageOrError}`, LOG_STYLES.error);
    }
  }
  // Handle other types
  else {
    console.error(
      `%c[Calendar-Card-Pro] Unknown error type:`,
      LOG_STYLES.error,
      messageOrError,
      ...data,
    );
  }
}

/**
 * Log a warning message
 * @param message Log message
 * @param data Optional data to include
 */
export function warn(message: string, ...data: unknown[]): void {
  // Fix: Current log level must be GREATER than or equal to WARN level to show
  if (CURRENT_LOG_LEVEL >= LogLevel.WARN) {
    if (data.length > 0) {
      console.warn(`%c[Calendar-Card-Pro] ${message}`, LOG_STYLES.warn, ...data);
    } else {
      console.warn(`%c[Calendar-Card-Pro] ${message}`, LOG_STYLES.warn);
    }
  }
}

/**
 * Log an info message
 * @param message Log message
 * @param data Optional data to include
 */
export function info(message: string, ...data: unknown[]): void {
  // Fix: Current log level must be GREATER than or equal to INFO level to show
  if (CURRENT_LOG_LEVEL >= LogLevel.INFO) {
    if (data.length > 0) {
      console.log(`%c[Calendar-Card-Pro] ${message}`, LOG_STYLES.prefix, ...data);
    } else {
      console.log(`%c[Calendar-Card-Pro] ${message}`, LOG_STYLES.prefix);
    }
  }
}

/**
 * Log a debug message (only in debug mode)
 * @param message Log message
 * @param data Optional data to include
 */
export function debug(message: string, ...data: unknown[]): void {
  // Fix: Current log level must be GREATER than or equal to DEBUG level to show
  if (CURRENT_LOG_LEVEL >= LogLevel.DEBUG) {
    if (data.length > 0) {
      // Apply consistent styling to debug messages too
      console.log(`%c[Calendar-Card-Pro] ${message}`, LOG_STYLES.prefix, ...data);
    } else {
      console.log(`%c[Calendar-Card-Pro] ${message}`, LOG_STYLES.prefix);
    }
  }
}

/**
 * Set the current logging level
 * @param level LogLevel to set
 */
export function setLogLevel(level: LogLevel): void {
  CURRENT_LOG_LEVEL = level;
}

/**
 * Enable or disable debug mode
 * @param enable Whether to enable debug mode
 */
export function setDebugMode(enable: boolean): void {
  DEBUG_MODE = enable;
  // Use WARN as default production level instead of INFO
  CURRENT_LOG_LEVEL = enable ? LogLevel.DEBUG : LogLevel.WARN;
  info(`Debug mode ${enable ? 'enabled' : 'disabled'}`);

  (window as any).__CALENDAR_CARD_PRO_DEBUG__ = enable;
}

/**
 * Check if debug mode is enabled
 * @returns {boolean} True if debug mode is enabled
 */
export function isDebugEnabled(): boolean {
  // Check for debug flag in localStorage or URL parameters
  return (
    localStorage.getItem('calendar-card-debug') === 'true' ||
    window.location.search.includes('debug=true')
  );
}

/**
 * Check if diagnostics mode is enabled
 * @returns {boolean} True if diagnostics mode is enabled
 */
export function isDiagnosticsEnabled(): boolean {
  return localStorage.getItem('calendar-card-diagnostics') === 'true';
}

// Create diagnostic styles if diagnostics are enabled
if (isDiagnosticsEnabled()) {
  const diagnosticStyles = document.createElement('style');
  diagnosticStyles.textContent = `
    /* Diagnostic outlines for layer visualization */
    .card-container::before {
      outline: 2px solid blue !important;
    }
    .card-container::after {
      outline: 2px solid red !important;
    }
    .card-content {
      outline: 2px solid green !important;
    }
  `;

  // Append to document head only once
  if (!document.head.querySelector('#calendar-card-diagnostics')) {
    diagnosticStyles.id = 'calendar-card-diagnostics';
    document.head.appendChild(diagnosticStyles);
  }
}

/**
 * Custom error class for Calendar Card Pro
 */
export class CalendarCardError extends Error {
  /**
   * Create a new CalendarCardError
   *
   * @param message - Error message
   * @param severity - Error severity level
   */
  constructor(
    public message: string,
    public severity: 'warning' | 'error' = 'error',
  ) {
    super(message);
    this.name = 'CalendarCardError';
  }
}

/**
 * Log an error with standard formatting and optional context
 *
 * @param err Error object or message
 * @param context Optional context info about where the error occurred
 */
export function logError(err: unknown, context?: string): void {
  const errorMessage = err instanceof Error ? err.message : String(err);
  const contextInfo = context ? ` during ${context}` : '';

  // Call the error function (not the parameter)
  error(`Error${contextInfo}: ${errorMessage}`);

  // If it's an actual Error object with stack, log that separately
  if (err instanceof Error && err.stack) {
    console.error(err.stack);
  }
}

/**
 * Specialized handler for API errors with context
 * @param err - Error from API call (renamed from 'error')
 * @param context - Additional context about the API call
 */
export function handleApiError(err: unknown, context?: Record<string, unknown>): void {
  // Create enhanced context
  const enhancedContext = {
    ...(context || {}),
    timestamp: new Date().toISOString(),
    // Add any API-specific metadata here
  };

  // Use the main error function with the enhanced context
  error(err, enhancedContext); // Now using different names
}
