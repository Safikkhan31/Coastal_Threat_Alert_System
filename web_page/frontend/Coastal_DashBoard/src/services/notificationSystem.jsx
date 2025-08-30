import { emergencyContacts, communicationTemplates } from './emergencyProtocols';

class NotificationSystem {
  constructor() {
    this.notificationQueue = [];
    this.activeNotifications = [];
  }

  // Send emergency alert
  async sendEmergencyAlert(alertType, severity, location, customMessage = null) {
    const alert = {
      id: this.generateAlertId(),
      type: alertType,
      severity: severity,
      location: location,
      message: customMessage || this.getTemplateMessage(alertType, severity, location),
      timestamp: new Date(),
      status: 'pending',
      recipients: this.getRecipientList(severity)
    };

    this.notificationQueue.push(alert);
    return await this.processAlert(alert);
  }

  // Process alert through multiple channels
  async processAlert(alert) {
    const results = {
      email: await this.sendEmailAlert(alert),
      sms: await this.sendSMSAlert(alert),
      broadcast: await this.sendBroadcastAlert(alert),
      webhook: await this.sendWebhookAlert(alert),
      social: await this.sendSocialMediaAlert(alert)
    };

    alert.status = 'sent';
    alert.results = results;
    this.activeNotifications.push(alert);
    
    return results;
  }

  // Email notification system
  async sendEmailAlert(alert) {
    try {
      const emailData = {
        to: this.getEmailRecipients(alert.severity),
        subject: `${alert.severity.toUpperCase()}: ${alert.type} - ${alert.location}`,
        body: this.formatEmailMessage(alert),
        priority: alert.severity === 'critical' ? 'high' : 'normal'
      };

      // Simulate API call
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });

      return { success: response.ok, timestamp: new Date() };
    } catch (error) {
      console.error('Email alert failed:', error);
      return { success: false, error: error.message };
    }
  }

  // SMS notification system
  async sendSMSAlert(alert) {
    try {
      const smsData = {
        to: this.getSMSRecipients(alert.severity),
        message: this.formatSMSMessage(alert)
      };

      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smsData)
      });

      return { success: response.ok, timestamp: new Date() };
    } catch (error) {
      console.error('SMS alert failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Emergency broadcast system
  async sendBroadcastAlert(alert) {
    try {
      const broadcastData = {
        message: alert.message,
        severity: alert.severity,
        location: alert.location,
        duration: alert.severity === 'critical' ? 300 : 180 // seconds
      };

      const response = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(broadcastData)
      });

      return { success: response.ok, timestamp: new Date() };
    } catch (error) {
      console.error('Broadcast alert failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Webhook notifications for external systems
  async sendWebhookAlert(alert) {
    try {
      const webhookData = {
        alert_id: alert.id,
        type: alert.type,
        severity: alert.severity,
        location: alert.location,
        message: alert.message,
        timestamp: alert.timestamp.toISOString()
      };

      // Send to configured webhook endpoints
      const webhookEndpoints = this.getWebhookEndpoints();
      const promises = webhookEndpoints.map(endpoint =>
        fetch(endpoint.url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-API-Key': endpoint.apiKey 
          },
          body: JSON.stringify(webhookData)
        })
      );

      const results = await Promise.allSettled(promises);
      return { success: true, results, timestamp: new Date() };
    } catch (error) {
      console.error('Webhook alert failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Social media alert posting
  async sendSocialMediaAlert(alert) {
    if (alert.severity !== 'critical' && alert.severity !== 'warning') {
      return { success: true, skipped: true, reason: 'Low severity' };
    }

    try {
      const socialData = {
        message: this.formatSocialMessage(alert),
        hashtags: ['#CoastalAlert', '#EmergencyUpdate', `#${alert.location.replace(/\s+/g, '')}`],
        urgent: alert.severity === 'critical'
      };

      const response = await fetch('/api/notifications/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialData)
      });

      return { success: response.ok, timestamp: new Date() };
    } catch (error) {
      console.error('Social media alert failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Utility methods
  generateAlertId() {
    return `ALERT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getTemplateMessage(alertType, severity, location) {
    const templates = communicationTemplates;
    if (templates[alertType] && templates[alertType][severity]) {
      return templates[alertType][severity].replace('[LOCATION]', location);
    }
    return `${severity.toUpperCase()} ${alertType} detected at ${location}. Follow official guidance.`;
  }

  getRecipientList(severity) {
    const contacts = emergencyContacts;
    switch (severity) {
      case 'critical':
        return [...contacts.primary, ...contacts.secondary, ...contacts.media];
      case 'warning':
        return [...contacts.primary, ...contacts.secondary];
      default:
        return contacts.primary;
    }
  }

  getEmailRecipients(severity) {
    return this.getRecipientList(severity).map(contact => contact.email);
  }

  getSMSRecipients(severity) {
    return this.getRecipientList(severity).map(contact => contact.phone);
  }

  formatEmailMessage(alert) {
    return `
      COASTAL THREAT ALERT SYSTEM
      
      Alert Type: ${alert.type}
      Severity: ${alert.severity.toUpperCase()}
      Location: ${alert.location}
      Time: ${alert.timestamp.toLocaleString()}
      
      Message: ${alert.message}
      
      This is an automated alert from the Coastal Threat Alert System.
      For more information, contact the Emergency Operations Center.
    `;
  }

  formatSMSMessage(alert) {
    return `ALERT: ${alert.type} - ${alert.severity.toUpperCase()} at ${alert.location}. ${alert.message.substring(0, 100)}${alert.message.length > 100 ? '...' : ''}`;
  }

  formatSocialMessage(alert) {
    const emoji = alert.severity === 'critical' ? '🚨' : '⚠️';
    return `${emoji} ${alert.severity.toUpperCase()} ALERT: ${alert.type} detected at ${alert.location}. ${alert.message}`;
  }

  getWebhookEndpoints() {
    return [
      { url: 'https://api.emergency.gov/alerts', apiKey: 'emergency_api_key' },
      { url: 'https://api.weather.gov/alerts', apiKey: 'weather_api_key' },
      { url: 'https://api.local.gov/emergency', apiKey: 'local_api_key' }
    ];
  }

  // Alert acknowledgment tracking
  acknowledgeAlert(alertId, userId, notes = '') {
    const alert = this.activeNotifications.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = userId;
      alert.acknowledgedAt = new Date();
      alert.acknowledgmentNotes = notes;
      
      // Log acknowledgment
      this.logActivity('alert_acknowledged', {
        alertId,
        userId,
        notes,
        timestamp: new Date()
      });
    }
  }

  // Activity logging
  logActivity(action, data) {
    const logEntry = {
      id: this.generateAlertId(),
      action,
      data,
      timestamp: new Date()
    };

    // Send to logging service
    fetch('/api/logs/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry)
    }).catch(error => console.error('Logging failed:', error));
  }

  // Get alert statistics
  getAlertStatistics(timeRange = '24h') {
    const now = new Date();
    const cutoff = new Date(now - this.parseTimeRange(timeRange));
    
    const recentAlerts = this.activeNotifications.filter(
      alert => alert.timestamp >= cutoff
    );

    return {
      total: recentAlerts.length,
      critical: recentAlerts.filter(a => a.severity === 'critical').length,
      warning: recentAlerts.filter(a => a.severity === 'warning').length,
      acknowledged: recentAlerts.filter(a => a.acknowledged).length,
      averageResponseTime: this.calculateAverageResponseTime(recentAlerts)
    };
  }

  parseTimeRange(range) {
    const units = { h: 3600000, d: 86400000, w: 604800000 };
    const match = range.match(/(\d+)([hdw])/);
    if (match) {
      return parseInt(match[1]) * units[match[2]];
    }
    return 86400000; // Default to 24 hours
  }

  calculateAverageResponseTime(alerts) {
    const acknowledgedAlerts = alerts.filter(a => a.acknowledged);
    if (acknowledgedAlerts.length === 0) return 0;
    
    const totalTime = acknowledgedAlerts.reduce((sum, alert) => {
      return sum + (alert.acknowledgedAt - alert.timestamp);
    }, 0);
    
    return Math.round(totalTime / acknowledgedAlerts.length / 1000 / 60); // minutes
  }
}

export default new NotificationSystem();