// Emergency Response Protocols and Procedures

export const emergencyProtocols = {
  // Tsunami Warning Protocol
  tsunami: {
    level1: {
      name: "Tsunami Watch",
      description: "Potential tsunami threat detected",
      actions: [
        "Monitor seismic activity",
        "Prepare evacuation routes",
        "Alert coastal communities",
        "Contact emergency services"
      ],
      contacts: ["Coast Guard", "Local Emergency Management", "Weather Service"],
      timeframe: "Immediate - 30 minutes"
    },
    level2: {
      name: "Tsunami Warning",
      description: "Imminent tsunami threat",
      actions: [
        "Activate emergency sirens",
        "Initiate mandatory evacuation",
        "Deploy emergency response teams",
        "Establish emergency shelters"
      ],
      contacts: ["All Emergency Services", "Media Outlets", "Government Officials"],
      timeframe: "Immediate"
    }
  },

  // Storm Surge Protocol
  stormSurge: {
    level1: {
      name: "Storm Surge Watch",
      description: "Storm surge conditions possible",
      actions: [
        "Monitor weather conditions",
        "Prepare flood barriers",
        "Alert vulnerable areas",
        "Coordinate with meteorological services"
      ],
      contacts: ["National Weather Service", "Local Authorities"],
      timeframe: "6-48 hours advance"
    },
    level2: {
      name: "Storm Surge Warning",
      description: "Life-threatening storm surge expected",
      actions: [
        "Mandatory evacuation of flood zones",
        "Deploy emergency resources",
        "Activate emergency shelters",
        "Close vulnerable infrastructure"
      ],
      contacts: ["All Emergency Services", "Transportation Authorities"],
      timeframe: "Immediate - 6 hours"
    }
  },

  // Water Contamination Protocol
  contamination: {
    level1: {
      name: "Water Quality Alert",
      description: "Elevated contamination levels detected",
      actions: [
        "Increase water quality monitoring",
        "Issue public advisory",
        "Investigate contamination source",
        "Coordinate with health authorities"
      ],
      contacts: ["Health Department", "Environmental Protection"],
      timeframe: "1-4 hours"
    },
    level2: {
      name: "Water Emergency",
      description: "Dangerous contamination levels",
      actions: [
        "Issue do-not-use water advisory",
        "Provide alternative water sources",
        "Identify and isolate contamination source",
        "Deploy water treatment resources"
      ],
      contacts: ["Health Department", "Water Utilities", "Emergency Management"],
      timeframe: "Immediate"
    }
  }
};

export const emergencyContacts = {
  primary: [
    { name: "Coast Guard", phone: "+1-800-USCG-911", email: "ops@uscg.gov" },
    { name: "Emergency Management", phone: "+1-555-EMG-MGMT", email: "emergency@county.gov" },
    { name: "Environmental Protection", phone: "+1-555-EPA-HOTL", email: "response@epa.gov" }
  ],
  secondary: [
    { name: "National Weather Service", phone: "+1-555-WEATHER", email: "forecast@noaa.gov" },
    { name: "Health Department", phone: "+1-555-HEALTH", email: "alerts@health.gov" },
    { name: "Water Utilities", phone: "+1-555-WATER", email: "ops@waterutil.gov" }
  ],
  media: [
    { name: "Emergency Broadcast System", phone: "+1-555-EBS-CAST", email: "alerts@ebs.gov" },
    { name: "Local News Networks", phone: "+1-555-NEWS-NET", email: "newsroom@localnews.com" }
  ]
};

export const evacuationZones = {
  zoneA: {
    name: "Immediate Coastal Zone",
    population: 1200,
    shelters: ["Community Center A", "High School Gymnasium"],
    evacuationTime: "15 minutes",
    routes: ["Highway 101 North", "Coastal Road East"]
  },
  zoneB: {
    name: "Low-lying Areas",
    population: 3500,
    shelters: ["City Hall", "Recreation Center", "Middle School"],
    evacuationTime: "30 minutes",
    routes: ["Main Street", "Industrial Blvd", "Highway 101"]
  },
  zoneC: {
    name: "River Delta Region",
    population: 800,
    shelters: ["Fire Station 3", "Community Church"],
    evacuationTime: "20 minutes",
    routes: ["River Road", "Delta Highway"]
  }
};

export const communicationTemplates = {
  tsunami: {
    watch: "TSUNAMI WATCH issued for [LOCATION]. Monitor official channels for updates. Prepare to evacuate if conditions worsen.",
    warning: "TSUNAMI WARNING - EVACUATE NOW! Move to higher ground immediately. Tsunami waves expected within [TIME]. Follow evacuation routes."
  },
  contamination: {
    advisory: "WATER QUALITY ADVISORY: Elevated contamination detected in [LOCATION]. Avoid water contact. Boil water before consumption.",
    emergency: "WATER EMERGENCY: Dangerous contamination levels. DO NOT USE TAP WATER. Alternative water sources available at [LOCATIONS]."
  },
  storm: {
    watch: "STORM SURGE WATCH: Potential flooding in coastal areas. Monitor conditions and prepare to evacuate low-lying areas.",
    warning: "STORM SURGE WARNING: Life-threatening flooding imminent. Evacuate flood-prone areas immediately."
  }
};

export const responseTeams = {
  waterRescue: {
    name: "Water Rescue Team",
    members: 12,
    equipment: ["Rescue Boats", "Diving Equipment", "Life Jackets"],
    responseTime: "15 minutes",
    coverage: "Coastal Zone A-C"
  },
  hazmat: {
    name: "Hazardous Materials Team",
    members: 8,
    equipment: ["Chemical Detection", "Containment Gear", "Decontamination Unit"],
    responseTime: "30 minutes",
    coverage: "All Zones"
  },
  medical: {
    name: "Emergency Medical Team",
    members: 15,
    equipment: ["Mobile Medical Unit", "Trauma Supplies", "Defibrillators"],
    responseTime: "10 minutes",
    coverage: "All Zones"
  }
};