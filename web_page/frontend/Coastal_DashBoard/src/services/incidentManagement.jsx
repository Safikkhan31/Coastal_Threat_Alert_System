import { emergencyProtocols, responseTeams, evacuationZones } from './emergencyProtocols';

class IncidentManagement {
  constructor() {
    this.activeIncidents = [];
    this.incidentHistory = [];
    this.responseTeams = responseTeams;
  }

  // Create new incident
  createIncident(alertData, severity = 'warning') {
    const incident = {
      id: this.generateIncidentId(),
      type: alertData.type,
      severity: severity,
      location: alertData.location,
      description: alertData.message,
      status: 'active',
      createdAt: new Date(),
      createdBy: 'system',
      assignedTeams: [],
      timeline: [],
      resources: [],
      evacuationStatus: null,
      estimatedResolution: null,
      actualResolution: null,
      lessons: [],
      documentation: []
    };

    this.activeIncidents.push(incident);
    this.addToTimeline(incident.id, 'incident_created', 'Incident automatically created from sensor alert');
    
    // Auto-assign appropriate response teams
    this.autoAssignTeams(incident);
    
    return incident;
  }

  // Auto-assign response teams based on incident type
  autoAssignTeams(incident) {
    const assignments = [];
    
    switch (incident.type.toLowerCase()) {
      case 'water contamination':
      case 'illegal dumping':
        assignments.push('hazmat', 'medical');
        break;
      case 'storm surge':
      case 'tsunami':
        assignments.push('waterRescue', 'medical');
        break;
      case 'algal bloom':
        assignments.push('hazmat');
        break;
      default:
        assignments.push('medical');
    }

    assignments.forEach(teamKey => {
      this.assignTeam(incident.id, teamKey);
    });
  }

  // Assign response team to incident
  assignTeam(incidentId, teamKey) {
    const incident = this.getIncident(incidentId);
    const team = this.responseTeams[teamKey];
    
    if (incident && team) {
      incident.assignedTeams.push({
        teamKey,
        teamName: team.name,
        assignedAt: new Date(),
        status: 'dispatched',
        eta: this.calculateETA(incident.location, team.responseTime)
      });

      this.addToTimeline(incidentId, 'team_assigned', `${team.name} dispatched to incident`);
    }
  }

  // Update incident status
  updateIncidentStatus(incidentId, newStatus, notes = '') {
    const incident = this.getIncident(incidentId);
    if (incident) {
      const oldStatus = incident.status;
      incident.status = newStatus;
      
      this.addToTimeline(incidentId, 'status_change', 
        `Status changed from ${oldStatus} to ${newStatus}. ${notes}`);

      if (newStatus === 'resolved') {
        incident.actualResolution = new Date();
        this.resolveIncident(incidentId);
      }
    }
  }

  // Evacuation management
  initiateEvacuation(incidentId, zones = []) {
    const incident = this.getIncident(incidentId);
    if (!incident) return;

    const evacuation = {
      id: this.generateEvacuationId(),
      incidentId: incidentId,
      zones: zones.map(zoneKey => ({
        ...evacuationZones[zoneKey],
        zoneKey,
        status: 'evacuating',
        startTime: new Date(),
        estimatedCompletion: this.calculateEvacuationTime(zoneKey)
      })),
      status: 'active',
      initiatedAt: new Date(),
      totalPopulation: zones.reduce((sum, zoneKey) => 
        sum + (evacuationZones[zoneKey]?.population || 0), 0)
    };

    incident.evacuationStatus = evacuation;
    this.addToTimeline(incidentId, 'evacuation_initiated', 
      `Evacuation ordered for zones: ${zones.join(', ')}`);

    return evacuation;
  }

  // Resource management
  deployResource(incidentId, resourceType, quantity, notes = '') {
    const incident = this.getIncident(incidentId);
    if (incident) {
      incident.resources.push({
        type: resourceType,
        quantity: quantity,
        deployedAt: new Date(),
        status: 'deployed',
        notes: notes
      });

      this.addToTimeline(incidentId, 'resource_deployed', 
        `Deployed ${quantity} ${resourceType}. ${notes}`);
    }
  }

  // Incident resolution
  resolveIncident(incidentId) {
    const incident = this.getIncident(incidentId);
    if (incident) {
      // Move to history
      this.incidentHistory.push({
        ...incident,
        resolvedAt: new Date(),
        duration: incident.actualResolution - incident.createdAt
      });

      // Remove from active incidents
      this.activeIncidents = this.activeIncidents.filter(i => i.id !== incidentId);
      
      this.addToTimeline(incidentId, 'incident_resolved', 'Incident officially resolved');
    }
  }

  // Add timeline entry
  addToTimeline(incidentId, action, description, userId = 'system') {
    const incident = this.getIncident(incidentId);
    if (incident) {
      incident.timeline.push({
        id: Math.random().toString(36).substr(2, 9),
        action: action,
        description: description,
        timestamp: new Date(),
        userId: userId
      });
    }
  }

  // Utility methods
  getIncident(incidentId) {
    return this.activeIncidents.find(i => i.id === incidentId);
  }

  generateIncidentId() {
    return `INC_${new Date().getFullYear()}_${String(Date.now()).slice(-6)}`;
  }

  generateEvacuationId() {
    return `EVAC_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  calculateETA(location, responseTime) {
    const baseTime = parseInt(responseTime);
    const now = new Date();
    return new Date(now.getTime() + (baseTime * 60000)); // Convert minutes to milliseconds
  }

  calculateEvacuationTime(zoneKey) {
    const zone = evacuationZones[zoneKey];
    if (zone) {
      const baseTime = parseInt(zone.evacuationTime);
      const now = new Date();
      return new Date(now.getTime() + (baseTime * 60000));
    }
    return new Date();
  }

  // Incident analytics
  getIncidentStatistics(timeRange = '30d') {
    const cutoff = this.getTimeRangeCutoff(timeRange);
    const incidents = [...this.activeIncidents, ...this.incidentHistory]
      .filter(i => i.createdAt >= cutoff);

    return {
      total: incidents.length,
      active: this.activeIncidents.length,
      resolved: incidents.filter(i => i.status === 'resolved').length,
      byType: this.groupIncidentsByType(incidents),
      averageResolutionTime: this.calculateAverageResolutionTime(incidents),
      mostCommonLocation: this.getMostCommonLocation(incidents)
    };
  }

  groupIncidentsByType(incidents) {
    return incidents.reduce((groups, incident) => {
      const type = incident.type;
      groups[type] = (groups[type] || 0) + 1;
      return groups;
    }, {});
  }

  calculateAverageResolutionTime(incidents) {
    const resolved = incidents.filter(i => i.actualResolution);
    if (resolved.length === 0) return 0;
    
    const totalTime = resolved.reduce((sum, incident) => 
      sum + (incident.actualResolution - incident.createdAt), 0);
    
    return Math.round(totalTime / resolved.length / 1000 / 60); // minutes
  }

  getMostCommonLocation(incidents) {
    const locations = incidents.reduce((counts, incident) => {
      counts[incident.location] = (counts[incident.location] || 0) + 1;
      return counts;
    }, {});
    
    return Object.entries(locations)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';
  }

  getTimeRangeCutoff(range) {
    const now = new Date();
    const units = { d: 86400000, w: 604800000, m: 2592000000 };
    const match = range.match(/(\d+)([dwm])/);
    
    if (match) {
      const value = parseInt(match[1]);
      const unit = units[match[2]];
      return new Date(now - (value * unit));
    }
    
    return new Date(now - 86400000); // Default to 1 day
  }

  // Export incident data
  exportIncidentData(format = 'json', timeRange = '30d') {
    const cutoff = this.getTimeRangeCutoff(timeRange);
    const incidents = [...this.activeIncidents, ...this.incidentHistory]
      .filter(i => i.createdAt >= cutoff);

    switch (format) {
      case 'csv':
        return this.convertToCSV(incidents);
      case 'json':
        return JSON.stringify(incidents, null, 2);
      case 'xml':
        return this.convertToXML(incidents);
      default:
        return incidents;
    }
  }

  convertToCSV(incidents) {
    const headers = ['ID', 'Type', 'Severity', 'Location', 'Status', 'Created', 'Resolved', 'Duration (min)'];
    const rows = incidents.map(i => [
      i.id,
      i.type,
      i.severity,
      i.location,
      i.status,
      i.createdAt.toISOString(),
      i.actualResolution?.toISOString() || '',
      i.actualResolution ? Math.round((i.actualResolution - i.createdAt) / 60000) : ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  convertToXML(incidents) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<incidents>\n';
    incidents.forEach(incident => {
      xml += `  <incident id="${incident.id}">\n`;
      xml += `    <type>${incident.type}</type>\n`;
      xml += `    <severity>${incident.severity}</severity>\n`;
      xml += `    <location>${incident.location}</location>\n`;
      xml += `    <status>${incident.status}</status>\n`;
      xml += `    <created>${incident.createdAt.toISOString()}</created>\n`;
      if (incident.actualResolution) {
        xml += `    <resolved>${incident.actualResolution.toISOString()}</resolved>\n`;
      }
      xml += `  </incident>\n`;
    });
    xml += '</incidents>';
    return xml;
  }
}

export default new IncidentManagement();