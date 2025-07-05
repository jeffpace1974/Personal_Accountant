// Security and audit logging utility
interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';
  category: 'AUTH' | 'API' | 'DATA' | 'SYSTEM' | 'USER';
  action: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  details?: any;
  success: boolean;
}

class SecurityLogger {
  private static instance: SecurityLogger;
  private logs: LogEntry[] = [];

  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  private createLogEntry(
    level: LogEntry['level'],
    category: LogEntry['category'],
    action: string,
    success: boolean,
    details?: any,
    userId?: string
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      action,
      userId,
      sessionId: this.getSessionId(),
      ipAddress: this.getClientIP(),
      details,
      success
    };
  }

  private getSessionId(): string {
    // Generate or retrieve session ID for tracking
    return sessionStorage.getItem('sessionId') || 'anonymous';
  }

  private getClientIP(): string {
    // In production, this would be captured server-side
    return 'localhost';
  }

  // Authentication events
  logAuthAttempt(userId: string, success: boolean, details?: any): void {
    const entry = this.createLogEntry('SECURITY', 'AUTH', 'LOGIN_ATTEMPT', success, details, userId);
    this.writeLog(entry);
  }

  logLogout(userId: string): void {
    const entry = this.createLogEntry('INFO', 'AUTH', 'LOGOUT', true, {}, userId);
    this.writeLog(entry);
  }

  // Plaid API events
  logPlaidAPICall(action: string, success: boolean, details?: any, userId?: string): void {
    const entry = this.createLogEntry('INFO', 'API', `PLAID_${action}`, success, details, userId);
    this.writeLog(entry);
  }

  // Data access events
  logDataAccess(action: string, dataType: string, success: boolean, userId?: string, details?: any): void {
    const entry = this.createLogEntry('INFO', 'DATA', `DATA_${action}_${dataType}`, success, details, userId);
    this.writeLog(entry);
  }

  // Security events
  logSecurityEvent(action: string, success: boolean, details?: any, userId?: string): void {
    const entry = this.createLogEntry('SECURITY', 'SYSTEM', action, success, details, userId);
    this.writeLog(entry);
  }

  // System events
  logSystemEvent(action: string, success: boolean, details?: any): void {
    const entry = this.createLogEntry('INFO', 'SYSTEM', action, success, details);
    this.writeLog(entry);
  }

  private writeLog(entry: LogEntry): void {
    // Store in memory for development
    this.logs.push(entry);
    
    // Console output for development
    const logLevel = entry.level === 'SECURITY' ? 'warn' : 'info';
    console[logLevel](`[${entry.timestamp}] ${entry.level}:${entry.category} - ${entry.action}`, entry);
    
    // In production, this would write to centralized logging system
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement centralized logging (e.g., CloudWatch, Splunk)
      this.sendToRemoteLogging(entry);
    }
    
    // Maintain only last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  private sendToRemoteLogging(entry: LogEntry): void {
    // Placeholder for production logging implementation
    // This would send logs to external logging service
  }

  // Get logs for audit purposes
  getAuditLogs(filters?: {
    startDate?: Date;
    endDate?: Date;
    level?: LogEntry['level'];
    category?: LogEntry['category'];
    userId?: string;
  }): LogEntry[] {
    let filteredLogs = [...this.logs];

    if (filters) {
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= filters.endDate!);
      }
      if (filters.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filters.level);
      }
      if (filters.category) {
        filteredLogs = filteredLogs.filter(log => log.category === filters.category);
      }
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
    }

    return filteredLogs;
  }

  // Export logs for audit
  exportAuditLogs(format: 'json' | 'csv' = 'json'): string {
    const logs = this.getAuditLogs();
    
    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'category', 'action', 'userId', 'sessionId', 'ipAddress', 'success', 'details'];
      const csvRows = logs.map(log => [
        log.timestamp,
        log.level,
        log.category,
        log.action,
        log.userId || '',
        log.sessionId || '',
        log.ipAddress || '',
        log.success.toString(),
        JSON.stringify(log.details || {})
      ]);
      
      return [headers, ...csvRows].map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(logs, null, 2);
  }
}

// Export singleton instance
export const securityLogger = SecurityLogger.getInstance();

// Convenience functions
export const logAuthAttempt = (userId: string, success: boolean, details?: any) => 
  securityLogger.logAuthAttempt(userId, success, details);

export const logPlaidAPICall = (action: string, success: boolean, details?: any, userId?: string) => 
  securityLogger.logPlaidAPICall(action, success, details, userId);

export const logDataAccess = (action: string, dataType: string, success: boolean, userId?: string, details?: any) => 
  securityLogger.logDataAccess(action, dataType, success, userId, details);

export const logSecurityEvent = (action: string, success: boolean, details?: any, userId?: string) => 
  securityLogger.logSecurityEvent(action, success, details, userId);

export const logSystemEvent = (action: string, success: boolean, details?: any) => 
  securityLogger.logSystemEvent(action, success, details);