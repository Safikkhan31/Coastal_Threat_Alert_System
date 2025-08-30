class AuditLogging {
  constructor() {
    this.logLevels = {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      CRITICAL: 4
    };
    
    this.currentLogLevel = this.logLevels.INFO;
    this.logBuffer = [];
    this.maxBufferSize = 1000;
    this.logRetentionDays = 90;
  }

  // Main logging method
  log(level, category, action, data, userId = 'system') {
    if (this.logLevels[level] < this.currentLogLevel) {
      return; // Skip if below current log level
    }

    const logEntry = {
      id: this.generateLogId(),
      timestamp: new Date(),
      level: level,
      category: category,
      action: action,
      userId: userId,
      sessionId: this.getSessionId(),
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
      data: this.sanitizeData(data),
      hash: this.generateHash(level + category + action + JSON.stringify(data))
    };

    this.addToBuffer(logEntry);
    this.persistLog(logEntry);

    // Send critical logs immediately
    if (level === 'CRITICAL' || level === 'ERROR') {
      this.sendImmediateAlert(logEntry);
    }

    return logEntry.id;
  }

  // Specific logging methods for different categories
  logUserAction(action, userId, data = {}) {
    return this.log('INFO', 'USER_ACTION', action, {
      userId: userId,
      ...data
    }, userId);
  }

  logSystemEvent(event, data = {}) {
    return this.log('INFO', 'SYSTEM_EVENT', event, data);
  }

  logSensorData(sensorId, readings, status = 'normal') {
    const level = status === 'error' ? 'ERROR' : 'DEBUG';
    return this.log(level, 'SENSOR_DATA', 'data_received', {
      sensorId: sensorId,
      readings: readings,
      status: status
    });
  }

  logAlert(alertType, severity, location, data = {}) {
    const level = severity === 'critical' ? 'CRITICAL' : 'WARN';
    return this.log(level, 'ALERT', alertType, {
      severity: severity,
      location: location,
      ...data
    });
  }

  logSecurityEvent(event, userId = null, data = {}) {
    return this.log('WARN', 'SECURITY', event, {
      userId: userId,
      ...data
    }, userId);
  }

  logAPIRequest(endpoint, method, userId, responseCode, duration) {
    const level = responseCode >= 400 ? 'ERROR' : 'DEBUG';
    return this.log(level, 'API_REQUEST', `${method} ${endpoint}`, {
      userId: userId,
      responseCode: responseCode,
      duration: duration,
      timestamp: new Date()
    }, userId);
  }

  logDataChange(table, recordId, changes, userId) {
    return this.log('INFO', 'DATA_CHANGE', `${table}_modified`, {
      table: table,
      recordId: recordId,
      changes: changes,
      userId: userId
    }, userId);
  }

  // Audit trail specific methods
  createAuditTrail(entityType, entityId, operation, oldValues = {}, newValues = {}, userId) {
    return this.log('INFO', 'AUDIT_TRAIL', operation, {
      entityType: entityType,
      entityId: entityId,
      operation: operation,
      oldValues: oldValues,
      newValues: newValues,
      changes: this.calculateChanges(oldValues, newValues)
    }, userId);
  }

  // Compliance logging
  logComplianceEvent(regulation, requirement, status, evidence = {}) {
    return this.log('INFO', 'COMPLIANCE', `${regulation}_${requirement}`, {
      regulation: regulation,
      requirement: requirement,
      status: status, // compliant, non-compliant, pending
      evidence: evidence,
      auditDate: new Date()
    });
  }

  // Performance monitoring
  logPerformanceMetric(metric, value, threshold = null) {
    const level = threshold && value > threshold ? 'WARN' : 'DEBUG';
    return this.log(level, 'PERFORMANCE', metric, {
      metric: metric,
      value: value,
      threshold: threshold,
      timestamp: new Date()
    });
  }

  // Error tracking and analysis
  logError(error, context = {}, userId = null) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      code: error.code,
      context: context
    };

    return this.log('ERROR', 'ERROR', 'exception_occurred', errorData, userId);
  }

  // Log analysis and reporting
  async generateAuditReport(startDate, endDate, categories = [], userId = null) {
    const filters = {
      startDate: startDate,
      endDate: endDate,
      categories: categories,
      userId: userId
    };

    const logs = await this.queryLogs(filters);
    
    return {
      reportId: this.generateReportId(),
      generatedAt: new Date(),
      period: { start: startDate, end: endDate },
      filters: filters,
      summary: this.analyzeLogs(logs),
      logs: logs,
      statistics: this.calculateStatistics(logs)
    };
  }

  async queryLogs(filters) {
    // In a real implementation, this would query the database
    return this.logBuffer.filter(log => {
      if (filters.startDate && log.timestamp < filters.startDate) return false;
      if (filters.endDate && log.timestamp > filters.endDate) return false;
      if (filters.categories.length && !filters.categories.includes(log.category)) return false;
      if (filters.userId && log.userId !== filters.userId) return false;
      return true;
    });
  }

  analyzeLogs(logs) {
    const analysis = {
      totalEvents: logs.length,
      byLevel: {},
      byCategory: {},
      byUser: {},
      errorRate: 0,
      criticalEvents: 0,
      timeDistribution: {}
    };

    logs.forEach(log => {
      // Count by level
      analysis.byLevel[log.level] = (analysis.byLevel[log.level] || 0) + 1;
      
      // Count by category
      analysis.byCategory[log.category] = (analysis.byCategory[log.category] || 0) + 1;
      
      // Count by user
      analysis.byUser[log.userId] = (analysis.byUser[log.userId] || 0) + 1;
      
      // Calculate error rate
      if (log.level === 'ERROR' || log.level === 'CRITICAL') {
        analysis.errorRate++;
      }
      
      if (log.level === 'CRITICAL') {
        analysis.criticalEvents++;
      }
      
      // Time distribution (by hour)
      const hour = log.timestamp.getHours();
      analysis.timeDistribution[hour] = (analysis.timeDistribution[hour] || 0) + 1;
    });

    analysis.errorRate = (analysis.errorRate / logs.length * 100).toFixed(2);
    
    return analysis;
  }

  calculateStatistics(logs) {
    const now = new Date();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    return {
      last24Hours: logs.filter(log => log.timestamp > oneDayAgo).length,
      lastWeek: logs.filter(log => log.timestamp > oneWeekAgo).length,
      averagePerDay: (logs.length / 30).toFixed(1),
      mostActiveUser: this.getMostActiveUser(logs),
      mostCommonAction: this.getMostCommonAction(logs),
      peakHour: this.getPeakHour(logs)
    };
  }

  // Security and integrity methods
  verifyLogIntegrity(logEntry) {
    const expectedHash = this.generateHash(
      logEntry.level + logEntry.category + logEntry.action + JSON.stringify(logEntry.data)
    );
    return expectedHash === logEntry.hash;
  }

  detectAnomalousActivity(userId, timeWindow = 3600000) { // 1 hour default
    const cutoff = new Date(Date.now() - timeWindow);
    const userLogs = this.logBuffer.filter(log => 
      log.userId === userId && log.timestamp > cutoff
    );

    const anomalies = [];
    
    // Check for unusual activity patterns
    if (userLogs.length > 100) { // Too many actions
      anomalies.push({
        type: 'excessive_activity',
        count: userLogs.length,
        threshold: 100
      });
    }

    // Check for failed login attempts
    const failedLogins = userLogs.filter(log => 
      log.category === 'SECURITY' && log.action === 'login_failed'
    );
    
    if (failedLogins.length > 5) {
      anomalies.push({
        type: 'multiple_failed_logins',
        count: failedLogins.length,
        threshold: 5
      });
    }

    return anomalies;
  }

  // Utility methods
  addToBuffer(logEntry) {
    this.logBuffer.push(logEntry);
    
    // Maintain buffer size
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }
  }

  async persistLog(logEntry) {
    // In a real implementation, this would write to database
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      console.error('Failed to persist log:', error);
    }
  }

  sendImmediateAlert(logEntry) {
    // Send critical alerts to administrators
    const alertData = {
      subject: `Critical System Event: ${logEntry.action}`,
      body: `A critical event has occurred in the system:\n\n${JSON.stringify(logEntry, null, 2)}`,
      priority: 'high',
      recipients: ['admin@coastal-system.gov', 'ops@coastal-system.gov']
    };

    fetch('/api/notifications/emergency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData)
    }).catch(error => console.error('Failed to send alert:', error));
  }

  sanitizeData(data) {
    // Remove sensitive information from logs
    const sanitized = { ...data };
    const sensitiveFields = ['password', 'token', 'api_key', 'ssn', 'credit_card'];
    
    const recursiveSanitize = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          recursiveSanitize(obj[key]);
        } else if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          obj[key] = '[REDACTED]';
        }
      }
    };

    recursiveSanitize(sanitized);
    return sanitized;
  }

  generateLogId() {
    return `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateReportId() {
    return `RPT_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  generateHash(input) {
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  getSessionId() {
    return sessionStorage.getItem('sessionId') || 'no-session';
  }

  getClientIP() {
    return 'client-ip'; // In real implementation, get from request
  }

  getUserAgent() {
    return navigator.userAgent || 'unknown';
  }

  calculateChanges(oldValues, newValues) {
    const changes = {};
    
    // Find changed fields
    for (const key in newValues) {
      if (oldValues[key] !== newValues[key]) {
        changes[key] = {
          from: oldValues[key],
          to: newValues[key]
        };
      }
    }
    
    // Find removed fields
    for (const key in oldValues) {
      if (!(key in newValues)) {
        changes[key] = {
          from: oldValues[key],
          to: null,
          removed: true
        };
      }
    }
    
    return changes;
  }

  getMostActiveUser(logs) {
    const userCounts = {};
    logs.forEach(log => {
      userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
    });
    
    return Object.entries(userCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown';
  }

  getMostCommonAction(logs) {
    const actionCounts = {};
    logs.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });
    
    return Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown';
  }

  getPeakHour(logs) {
    const hourCounts = {};
    logs.forEach(log => {
      const hour = log.timestamp.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    return Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 0;
  }

  // Data retention management
  async cleanupOldLogs() {
    const cutoffDate = new Date(Date.now() - (this.logRetentionDays * 24 * 60 * 60 * 1000));
    
    try {
      const result = await fetch('/api/logs/cleanup', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cutoffDate: cutoffDate.toISOString() })
      });
      
      if (result.ok) {
        const response = await result.json();
        this.log('INFO', 'MAINTENANCE', 'logs_cleaned', {
          cutoffDate: cutoffDate,
          deletedCount: response.deletedCount
        });
        return response.deletedCount;
      }
    } catch (error) {
      this.logError(error, { operation: 'log_cleanup' });
    }
    
    return 0;
  }

  // Export methods for compliance
  async exportLogsForCompliance(startDate, endDate, format = 'json') {
    const logs = await this.queryLogs({ startDate, endDate });
    const exportData = {
      exportId: this.generateReportId(),
      exportedAt: new Date(),
      period: { start: startDate, end: endDate },
      totalRecords: logs.length,
      logs: logs
    };

    switch (format.toLowerCase()) {
      case 'csv':
        return this.convertLogsToCSV(logs);
      case 'xml':
        return this.convertLogsToXML(exportData);
      case 'json':
      default:
        return JSON.stringify(exportData, null, 2);
    }
  }

  convertLogsToCSV(logs) {
    const headers = ['Timestamp', 'Level', 'Category', 'Action', 'User ID', 'IP Address', 'Data'];
    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.level,
      log.category,
      log.action,
      log.userId,
      log.ipAddress,
      JSON.stringify(log.data).replace(/,/g, ';') // Escape commas
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  convertLogsToXML(exportData) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += `<audit_export id="${exportData.exportId}" exported_at="${exportData.exportedAt.toISOString()}">\n`;
    xml += `  <period start="${exportData.period.start.toISOString()}" end="${exportData.period.end.toISOString()}" />\n`;
    xml += `  <total_records>${exportData.totalRecords}</total_records>\n`;
    xml += '  <logs>\n';
    
    exportData.logs.forEach(log => {
      xml += `    <log id="${log.id}" timestamp="${log.timestamp.toISOString()}">\n`;
      xml += `      <level>${log.level}</level>\n`;
      xml += `      <category>${log.category}</category>\n`;
      xml += `      <action>${log.action}</action>\n`;
      xml += `      <user_id>${log.userId}</user_id>\n`;
      xml += `      <ip_address>${log.ipAddress}</ip_address>\n`;
      xml += `      <data><![CDATA[${JSON.stringify(log.data)}]]></data>\n`;
      xml += '    </log>\n';
    });
    
    xml += '  </logs>\n';
    xml += '</audit_export>';
    
    return xml;
  }

  // Real-time monitoring and dashboards
  getSystemHealth() {
    const recentLogs = this.logBuffer.filter(log => 
      log.timestamp > new Date(Date.now() - 3600000) // Last hour
    );

    const errors = recentLogs.filter(log => 
      log.level === 'ERROR' || log.level === 'CRITICAL'
    );

    const warnings = recentLogs.filter(log => log.level === 'WARN');

    return {
      status: errors.length > 10 ? 'critical' : errors.length > 5 ? 'warning' : 'healthy',
      totalEvents: recentLogs.length,
      errorCount: errors.length,
      warningCount: warnings.length,
      errorRate: ((errors.length / recentLogs.length) * 100).toFixed(2),
      lastError: errors[errors.length - 1]?.timestamp || null,
      topErrors: this.getTopErrors(errors)
    };
  }

  getTopErrors(errorLogs) {
    const errorCounts = {};
    errorLogs.forEach(log => {
      const key = `${log.category}:${log.action}`;
      errorCounts[key] = (errorCounts[key] || 0) + 1;
    });

    return Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([error, count]) => ({ error, count }));
  }

  // Log search and filtering
  searchLogs(query, filters = {}) {
    const searchTerms = query.toLowerCase().split(' ');
    
    return this.logBuffer.filter(log => {
      // Text search
      const logText = JSON.stringify(log).toLowerCase();
      const matchesSearch = searchTerms.every(term => logText.includes(term));
      
      if (!matchesSearch) return false;

      // Apply filters
      if (filters.level && log.level !== filters.level) return false;
      if (filters.category && log.category !== filters.category) return false;
      if (filters.userId && log.userId !== filters.userId) return false;
      if (filters.startDate && log.timestamp < new Date(filters.startDate)) return false;
      if (filters.endDate && log.timestamp > new Date(filters.endDate)) return false;

      return true;
    });
  }

  // Scheduled maintenance and monitoring
  async performScheduledMaintenance() {
    const maintenanceLog = {
      startTime: new Date(),
      tasks: []
    };

    try {
      // Clean up old logs
      const deletedCount = await this.cleanupOldLogs();
      maintenanceLog.tasks.push({ 
        task: 'log_cleanup', 
        status: 'completed', 
        details: { deletedCount } 
      });

      // Verify log integrity
      const integrityCheck = await this.verifyAllLogsIntegrity();
      maintenanceLog.tasks.push({ 
        task: 'integrity_check', 
        status: 'completed', 
        details: integrityCheck 
      });

      // Generate system health report
      const healthReport = this.getSystemHealth();
      maintenanceLog.tasks.push({ 
        task: 'health_check', 
        status: 'completed', 
        details: healthReport 
      });

      maintenanceLog.endTime = new Date();
      maintenanceLog.duration = maintenanceLog.endTime - maintenanceLog.startTime;
      maintenanceLog.status = 'completed';

    } catch (error) {
      maintenanceLog.endTime = new Date();
      maintenanceLog.status = 'failed';
      maintenanceLog.error = error.message;
      
      this.logError(error, { operation: 'scheduled_maintenance' });
    }

    this.log('INFO', 'MAINTENANCE', 'scheduled_maintenance', maintenanceLog);
    return maintenanceLog;
  }

  async verifyAllLogsIntegrity() {
    let validCount = 0;
    let invalidCount = 0;
    const invalidLogs = [];

    this.logBuffer.forEach(log => {
      if (this.verifyLogIntegrity(log)) {
        validCount++;
      } else {
        invalidCount++;
        invalidLogs.push(log.id);
      }
    });

    return {
      totalChecked: this.logBuffer.length,
      validCount,
      invalidCount,
      integrityRate: ((validCount / this.logBuffer.length) * 100).toFixed(2),
      invalidLogIds: invalidLogs
    };
  }
}

// Configuration management
export const LoggingConfig = {
  levels: {
    DEBUG: { color: '#808080', priority: 0 },
    INFO: { color: '#0066cc', priority: 1 },
    WARN: { color: '#ff9900', priority: 2 },
    ERROR: { color: '#cc0000', priority: 3 },
    CRITICAL: { color: '#990000', priority: 4 }
  },
  
  categories: {
    USER_ACTION: 'User Actions',
    SYSTEM_EVENT: 'System Events',
    SENSOR_DATA: 'Sensor Data',
    ALERT: 'Alerts',
    SECURITY: 'Security Events',
    API_REQUEST: 'API Requests',
    DATA_CHANGE: 'Data Changes',
    AUDIT_TRAIL: 'Audit Trail',
    COMPLIANCE: 'Compliance',
    PERFORMANCE: 'Performance',
    ERROR: 'Errors',
    MAINTENANCE: 'Maintenance'
  },

  retentionPolicies: {
    DEBUG: 7,    // days
    INFO: 30,    // days
    WARN: 90,    // days
    ERROR: 365,  // days
    CRITICAL: 2555 // 7 years
  },

  complianceRequirements: {
    EPA: {
      retention: 2555, // 7 years
      categories: ['SENSOR_DATA', 'ALERT', 'COMPLIANCE']
    },
    SOX: {
      retention: 2555, // 7 years
      categories: ['AUDIT_TRAIL', 'DATA_CHANGE', 'USER_ACTION']
    },
    GDPR: {
      retention: 2190, // 6 years
      categories: ['USER_ACTION', 'DATA_CHANGE']
    }
  }
};

export default new AuditLogging();