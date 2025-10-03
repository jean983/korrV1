// Mock data for geotechnical projects

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface SoilLayer {
  depth: string;
  description: string;
  classification: string;
  nValue: number;
  moisture: number;
}

export interface BoreholeData {
  id: string;
  type: 'borehole';
  name: string;
  location: Location;
  depth: number;
  date: string;
  soilLayers: SoilLayer[];
}

export interface MonitoringPoint {
  id: string;
  type: 'monitoring';
  name: string;
  location: Location;
  date: string;
  instrumentType: string;
  parameters: string[];
  latestReadings: { parameter: string; value: number; unit: string; status: 'normal' | 'warning' | 'alert' }[];
}

export interface Infrastructure {
  id: string;
  type: 'infrastructure';
  name: string;
  location: Location;
  infrastructureType: string;
  status: 'operational' | 'under-construction' | 'planned';
  specifications: { key: string; value: string }[];
}

export type Asset = BoreholeData | MonitoringPoint | Infrastructure;

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'report' | 'drawing' | 'photo' | 'data' | 'specification' | 'other';
  size: number; // in bytes
  uploadedBy: string;
  uploadedAt: Date;
  projectId: string;
  tags: string[];
  url?: string;
}

export interface ProjectUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  addedAt: Date;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'database' | 'cloud-storage' | 'ftp';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  config: Record<string, string>;
}

export interface ShapefileLayer {
  id: string;
  name: string;
  projectId: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: number;
  geometryType: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
  featureCount: number;
  visible: boolean;
  opacity: number;
  color: string;
  description?: string;
  // GeoJSON data converted from shapefile
  geoJsonData: any;
  // Original projection info
  projection?: string;
}

export interface ReasoningStep {
  step: number;
  description: string;
  sources: string[];
}

export interface DigDeeperData {
  sourceName: string;
  tables: {
    title: string;
    data: { label: string; value: string }[];
  }[];
  recommendedQuestions: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  reasoning?: ReasoningStep[];
  digDeeper?: DigDeeperData;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  status: 'Active' | 'Completed' | 'Planned' | 'Archived';
  startDate: string;
  assets: Asset[];
  documents?: ProjectDocument[];
  users?: ProjectUser[];
  dataSources?: DataSource[];
  shapefileLayers?: ShapefileLayer[];
}

// London Crossrail project
const londonCrossrailProject: Project = {
  id: 'proj-001',
  name: 'London Crossrail - Paddington Station',
  description: 'Geotechnical investigation for new underground station access shaft and foundation design',
  location: 'Paddington, London, UK',
  status: 'Active',
  startDate: '2024-01-15',
  assets: [
    {
      id: 'bh-001',
      type: 'borehole',
      name: 'BH-PAD-001',
      location: {
        lat: 51.5154,
        lng: -0.1755,
        address: 'Paddington Station, London W2 1HQ'
      },
      depth: 35.0,
      date: '2024-02-10',
      soilLayers: [
        {
          depth: '0.0 - 2.5m',
          description: 'Made Ground - Gravel and brick rubble',
          classification: 'GP-GM',
          nValue: 15,
          moisture: 12
        },
        {
          depth: '2.5 - 8.0m',
          description: 'River Terrace Deposits - Dense sandy gravel',
          classification: 'GW',
          nValue: 45,
          moisture: 8
        },
        {
          depth: '8.0 - 15.0m',
          description: 'London Clay - Stiff to very stiff grey clay',
          classification: 'CH',
          nValue: 25,
          moisture: 28
        },
        {
          depth: '15.0 - 35.0m',
          description: 'London Clay - Very stiff brown clay',
          classification: 'CH',
          nValue: 30,
          moisture: 25
        }
      ]
    },
    {
      id: 'bh-002',
      type: 'borehole',
      name: 'BH-PAD-002',
      location: {
        lat: 51.5164,
        lng: -0.1765,
        address: 'Praed Street, London W2 1RH'
      },
      depth: 30.0,
      date: '2024-02-12',
      soilLayers: [
        {
          depth: '0.0 - 3.0m',
          description: 'Made Ground - Sandy clay with brick fragments',
          classification: 'SC',
          nValue: 12,
          moisture: 15
        },
        {
          depth: '3.0 - 7.5m',
          description: 'River Terrace Deposits - Medium dense gravel',
          classification: 'GW-GM',
          nValue: 38,
          moisture: 10
        },
        {
          depth: '7.5 - 30.0m',
          description: 'London Clay - Very stiff grey to brown clay',
          classification: 'CH',
          nValue: 28,
          moisture: 26
        }
      ]
    },
    {
      id: 'mon-001',
      type: 'monitoring',
      name: 'INC-PAD-001',
      location: {
        lat: 51.5158,
        lng: -0.1750,
        address: 'Paddington Station Platform 12'
      },
      date: '2024-03-01',
      instrumentType: 'Inclinometer',
      parameters: ['Horizontal displacement', 'Depth', 'Cumulative movement'],
      latestReadings: [
        { parameter: 'Horizontal displacement', value: 2.3, unit: 'mm', status: 'normal' },
        { parameter: 'Depth', value: 25, unit: 'm', status: 'normal' },
        { parameter: 'Cumulative movement', value: 4.1, unit: 'mm', status: 'normal' }
      ]
    },
    {
      id: 'inf-001',
      type: 'infrastructure',
      name: 'Access Shaft A',
      location: {
        lat: 51.5160,
        lng: -0.1760,
        address: 'Paddington Station West Entry'
      },
      infrastructureType: 'Shaft',
      status: 'under-construction',
      specifications: [
        { key: 'Depth', value: '45m' },
        { key: 'Diameter', value: '8m' },
        { key: 'Support Type', value: 'Secant Pile Wall' },
        { key: 'Design Standard', value: 'Eurocode 7' }
      ]
    }
  ]
};

// Thames Tideway Tunnel project
const thamesTidewayProject: Project = {
  id: 'proj-002',
  name: 'Thames Tideway Tunnel - Battersea',
  description: 'Ground investigation and monitoring for super sewer construction',
  location: 'Battersea, London, UK',
  status: 'Completed',
  startDate: '2023-11-20',
  assets: [
    {
      id: 'bh-101',
      type: 'borehole',
      name: 'BH-BAT-101',
      location: {
        lat: 51.4750,
        lng: -0.1540,
        address: 'Battersea Park Road, London SW11'
      },
      depth: 50.0,
      date: '2024-01-15',
      soilLayers: [
        {
          depth: '0.0 - 4.0m',
          description: 'Made Ground - Victorian fill',
          classification: 'GP-GC',
          nValue: 18,
          moisture: 14
        },
        {
          depth: '4.0 - 12.0m',
          description: 'Terrace Gravel - Dense sandy gravel',
          classification: 'GW',
          nValue: 50,
          moisture: 9
        },
        {
          depth: '12.0 - 50.0m',
          description: 'London Clay - Very stiff grey-brown clay',
          classification: 'CH',
          nValue: 35,
          moisture: 23
        }
      ]
    },
    {
      id: 'mon-101',
      type: 'monitoring',
      name: 'PZ-BAT-101',
      location: {
        lat: 51.4755,
        lng: -0.1545,
        address: 'Battersea Embankment'
      },
      date: '2024-02-01',
      instrumentType: 'Piezometer',
      parameters: ['Groundwater level', 'Pore pressure', 'Temperature'],
      latestReadings: [
        { parameter: 'Groundwater level', value: 3.2, unit: 'm below GL', status: 'normal' },
        { parameter: 'Pore pressure', value: 145, unit: 'kPa', status: 'normal' },
        { parameter: 'Temperature', value: 14.5, unit: '°C', status: 'normal' }
      ]
    },
    {
      id: 'inf-101',
      type: 'infrastructure',
      name: 'TBM Launch Chamber',
      location: {
        lat: 51.4760,
        lng: -0.1535,
        address: 'Battersea Pumping Station'
      },
      infrastructureType: 'Launch Chamber',
      status: 'operational',
      specifications: [
        { key: 'Depth', value: '60m' },
        { key: 'Length', value: '85m' },
        { key: 'Width', value: '25m' },
        { key: 'Tunnel Diameter', value: '7.2m' }
      ]
    }
  ]
};

// HS2 Birmingham project
const hs2BirminghamProject: Project = {
  id: 'proj-003',
  name: 'HS2 Birmingham Interchange',
  description: 'Site investigation for high-speed rail station foundation design',
  location: 'Solihull, Birmingham, UK',
  status: 'Planned',
  startDate: '2024-04-01',
  assets: [
    {
      id: 'bh-201',
      type: 'borehole',
      name: 'BH-BIR-201',
      location: {
        lat: 52.4120,
        lng: -1.7220,
        address: 'Birmingham Interchange Station Site'
      },
      depth: 28.0,
      date: '2024-03-10',
      soilLayers: [
        {
          depth: '0.0 - 1.5m',
          description: 'Topsoil and fill',
          classification: 'ML',
          nValue: 8,
          moisture: 18
        },
        {
          depth: '1.5 - 8.0m',
          description: 'Glacial Till - Stiff clay with gravel',
          classification: 'CL',
          nValue: 22,
          moisture: 16
        },
        {
          depth: '8.0 - 28.0m',
          description: 'Mercia Mudstone - Weathered to strong mudstone',
          classification: 'Rock',
          nValue: 60,
          moisture: 8
        }
      ]
    },
    {
      id: 'mon-201',
      type: 'monitoring',
      name: 'VIB-BIR-201',
      location: {
        lat: 52.4125,
        lng: -1.7215,
        address: 'Site Boundary North'
      },
      date: '2024-03-15',
      instrumentType: 'Vibration Monitor',
      parameters: ['Peak particle velocity', 'Frequency', 'Duration'],
      latestReadings: [
        { parameter: 'Peak particle velocity', value: 1.2, unit: 'mm/s', status: 'normal' },
        { parameter: 'Frequency', value: 35, unit: 'Hz', status: 'normal' },
        { parameter: 'Duration', value: 2.5, unit: 'seconds', status: 'normal' }
      ]
    }
  ]
};

// All projects array
export const mockProjects: Project[] = [
  londonCrossrailProject,
  thamesTidewayProject,
  hs2BirminghamProject
];

// Sample chat conversation history
export const mockChatHistory: ChatMessage[] = [
  {
    id: 'msg-001',
    role: 'assistant',
    content: 'Hello! I\'m KorrAI, your geotechnical engineering assistant. I can help you analyze soil data, design foundations, and ensure compliance with standards. How can I assist you today?',
    timestamp: new Date('2024-09-30T09:00:00')
  },
  {
    id: 'msg-002',
    role: 'user',
    content: 'What is the bearing capacity at BH-PAD-001 at 3 meters depth?',
    timestamp: new Date('2024-09-30T09:05:00')
  },
  {
    id: 'msg-003',
    role: 'assistant',
    content: 'Based on the soil investigation data for BH-PAD-001, at 3 meters depth you encounter River Terrace Deposits consisting of dense sandy gravel (GW classification) with an SPT N-value of 45.\n\nFor preliminary bearing capacity estimation using the Terzaghi equation for a shallow foundation:\n\n**Ultimate Bearing Capacity (qu):**\nFor dense gravel (φ ≈ 38-40°), assuming a 2m x 2m square footing:\nqu ≈ 1.3 × c × Nc + γ × D × Nq + 0.4 × γ × B × Nγ\n\nWith typical values:\n- qu ≈ 800-1000 kPa\n- Allowable bearing capacity (FOS = 3): **250-350 kPa**\n\nThis is a conservative estimate. For detailed design, I recommend:\n1. Laboratory testing for precise shear strength parameters\n2. Settlement analysis\n3. Verification against Eurocode 7 requirements',
    timestamp: new Date('2024-09-30T09:05:30'),
    sources: ['BH-PAD-001 Borehole Log', 'Eurocode 7: Geotechnical Design', 'Terzaghi Bearing Capacity Theory'],
    reasoning: [
      {
        step: 1,
        description: 'Retrieved borehole data for BH-PAD-001 from project database',
        sources: ['BH-PAD-001 Borehole Log']
      },
      {
        step: 2,
        description: 'Identified soil layer at 3m depth: River Terrace Deposits (GW) with N-value of 45',
        sources: ['BH-PAD-001 Borehole Log']
      },
      {
        step: 3,
        description: 'Applied Terzaghi bearing capacity theory for granular soils',
        sources: ['Terzaghi Bearing Capacity Theory', 'Foundation Engineering Handbook']
      },
      {
        step: 4,
        description: 'Estimated friction angle (φ) from SPT N-value correlation for dense gravel',
        sources: ['SPT Correlation Charts', 'BS 8004:2015']
      },
      {
        step: 5,
        description: 'Calculated bearing capacity factors (Nc, Nq, Nγ) based on friction angle',
        sources: ['Terzaghi Bearing Capacity Theory']
      },
      {
        step: 6,
        description: 'Applied safety factor of 3.0 as per Eurocode 7 for preliminary design',
        sources: ['Eurocode 7: Geotechnical Design', 'BS EN 1997-1:2004']
      }
    ]
  }
];

// Mock user data
export const mockUser = {
  id: 'user-001',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@korrai.com',
  role: 'Senior Geotechnical Engineer',
  company: 'Korrai Engineering Ltd',
  avatar: null
};

// Mock documents for projects
export const mockDocuments: ProjectDocument[] = [
  {
    id: 'doc-001',
    name: 'Q1 2024 Environmental Audit Report.pdf',
    type: 'report',
    size: 2457600,
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-03-28T10:30:00'),
    projectId: 'proj-001',
    tags: ['environmental', 'audit', 'quarterly', 'compliance']
  },
  {
    id: 'doc-002',
    name: 'Remediation Completion Certificate.pdf',
    type: 'report',
    size: 456800,
    uploadedBy: 'Emily Brown',
    uploadedAt: new Date('2024-04-15T14:20:00'),
    projectId: 'proj-001',
    tags: ['environmental', 'remediation', 'compliance']
  },
  {
    id: 'doc-003',
    name: 'Site Contamination Assessment Guide.pdf',
    type: 'specification',
    size: 1235400,
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-02-01T09:00:00'),
    projectId: 'proj-001',
    tags: ['environmental', 'standards', 'guidance']
  },
  {
    id: 'doc-004',
    name: 'Waste Management Plan v2.3.pdf',
    type: 'specification',
    size: 892400,
    uploadedBy: 'Michael Chen',
    uploadedAt: new Date('2024-03-10T11:15:00'),
    projectId: 'proj-001',
    tags: ['waste', 'management', 'procedures']
  },
  {
    id: 'doc-005',
    name: 'Hazardous Materials Register.xlsx',
    type: 'data',
    size: 234500,
    uploadedBy: 'Emily Brown',
    uploadedAt: new Date('2024-09-15T08:30:00'),
    projectId: 'proj-001',
    tags: ['hazmat', 'inventory', 'compliance']
  },
  {
    id: 'doc-006',
    name: 'Environmental Permit EP3425-AB.pdf',
    type: 'specification',
    size: 1567800,
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-20T10:00:00'),
    projectId: 'proj-001',
    tags: ['permit', 'environmental', 'legal']
  },
  {
    id: 'doc-007',
    name: 'Permit Compliance Checklist.pdf',
    type: 'specification',
    size: 456200,
    uploadedBy: 'Emily Brown',
    uploadedAt: new Date('2024-09-01T09:30:00'),
    projectId: 'proj-001',
    tags: ['permit', 'compliance', 'checklist']
  },
  {
    id: 'doc-008',
    name: 'Photo Documentation Guidelines.pdf',
    type: 'specification',
    size: 678900,
    uploadedBy: 'Michael Chen',
    uploadedAt: new Date('2024-02-15T14:00:00'),
    projectId: 'proj-001',
    tags: ['documentation', 'photography', 'standards']
  },
  {
    id: 'doc-009',
    name: 'Site Investigation Report.pdf',
    type: 'report',
    size: 2457600,
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-02-15T10:30:00'),
    projectId: 'proj-001',
    tags: ['geotechnical', 'investigation', 'phase-1']
  },
  {
    id: 'doc-010',
    name: 'Borehole Logs - Complete.pdf',
    type: 'data',
    size: 1843200,
    uploadedBy: 'Michael Chen',
    uploadedAt: new Date('2024-02-20T14:15:00'),
    projectId: 'proj-001',
    tags: ['borehole', 'raw-data', 'field-work']
  }
];

// Mock project users
export const mockProjectUsers: ProjectUser[] = [
  {
    id: 'user-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@korrai.com',
    role: 'owner',
    addedAt: new Date('2024-01-15T00:00:00')
  },
  {
    id: 'user-002',
    name: 'Michael Chen',
    email: 'michael.chen@korrai.com',
    role: 'editor',
    addedAt: new Date('2024-01-20T00:00:00')
  },
  {
    id: 'user-003',
    name: 'Emily Brown',
    email: 'emily.brown@korrai.com',
    role: 'editor',
    addedAt: new Date('2024-02-01T00:00:00')
  },
  {
    id: 'user-004',
    name: 'James Wilson',
    email: 'james.wilson@contractor.com',
    role: 'viewer',
    addedAt: new Date('2024-02-10T00:00:00')
  }
];

// Mock data sources
export const mockDataSources: DataSource[] = [
  {
    id: 'ds-001',
    name: 'AGS Data Cloud',
    type: 'cloud-storage',
    status: 'connected',
    lastSync: new Date('2024-10-02T08:30:00'),
    config: {
      provider: 'AWS S3',
      bucket: 'korrai-ags-data'
    }
  },
  {
    id: 'ds-002',
    name: 'BGS GeoIndex API',
    type: 'api',
    status: 'connected',
    lastSync: new Date('2024-10-02T07:15:00'),
    config: {
      endpoint: 'https://api.bgs.ac.uk',
      version: 'v1'
    }
  }
];

// Mock shapefile layers
export const mockShapefileLayers: ShapefileLayer[] = [
  {
    id: 'shp-001',
    name: 'Site Boundary',
    projectId: 'proj-001',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: new Date('2024-01-20T09:30:00'),
    fileSize: 45600,
    geometryType: 'Polygon',
    featureCount: 1,
    visible: true,
    opacity: 0.6,
    color: '#186181',
    description: 'Project site boundary for Paddington Station development',
    projection: 'EPSG:27700',
    geoJsonData: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Paddington Station Site',
            area: '12500',
            units: 'sq meters'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-0.1770, 51.5150],
              [-0.1740, 51.5150],
              [-0.1740, 51.5170],
              [-0.1770, 51.5170],
              [-0.1770, 51.5150]
            ]]
          }
        }
      ]
    }
  },
  {
    id: 'shp-002',
    name: 'Utilities Network',
    projectId: 'proj-001',
    uploadedBy: 'Michael Chen',
    uploadedAt: new Date('2024-02-15T14:20:00'),
    fileSize: 128400,
    geometryType: 'LineString',
    featureCount: 12,
    visible: true,
    opacity: 0.8,
    color: '#dc2626',
    description: 'Underground utilities including water, gas, and electric lines',
    projection: 'EPSG:27700',
    geoJsonData: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            type: 'Water Main',
            diameter: '300mm',
            material: 'Cast Iron'
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-0.1760, 51.5152],
              [-0.1755, 51.5155],
              [-0.1750, 51.5158]
            ]
          }
        },
        {
          type: 'Feature',
          properties: {
            type: 'Gas Main',
            diameter: '200mm',
            material: 'Steel'
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-0.1765, 51.5153],
              [-0.1760, 51.5156],
              [-0.1755, 51.5159]
            ]
          }
        }
      ]
    }
  },
  {
    id: 'shp-003',
    name: 'Sample Locations',
    projectId: 'proj-001',
    uploadedBy: 'Emily Brown',
    uploadedAt: new Date('2024-03-05T11:45:00'),
    fileSize: 32100,
    geometryType: 'Point',
    featureCount: 8,
    visible: true,
    opacity: 1.0,
    color: '#769f86',
    description: 'Soil and groundwater sampling locations',
    projection: 'EPSG:27700',
    geoJsonData: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: 'SP-001',
            type: 'Soil Sample',
            depth: '2.5m',
            date: '2024-03-01'
          },
          geometry: {
            type: 'Point',
            coordinates: [-0.1755, 51.5154]
          }
        },
        {
          type: 'Feature',
          properties: {
            id: 'SP-002',
            type: 'Groundwater',
            depth: '5.0m',
            date: '2024-03-02'
          },
          geometry: {
            type: 'Point',
            coordinates: [-0.1760, 51.5156]
          }
        }
      ]
    }
  }
];

// Activity Management Types and Data

export interface PlaybookChecklistItem {
  id: string;
  title: string;
  description?: string;
  order: number;
  isRequired: boolean;
}

export interface Playbook {
  id: string;
  name: string;
  activityType: string;
  description: string;
  checklistItems: PlaybookChecklistItem[];
  isCustom: boolean;
  createdBy?: string;
  contextGuidance?: string; // AI guidance for this type of activity
}

export interface ActivityChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: Date;
  order: number;
  linkedFiles?: string[]; // IDs of relevant documents
  aiContext?: string; // AI-generated context for this specific item
  aiContextFetched?: boolean; // Track if AI context has been fetched
}

export interface ActivityNote {
  id: string;
  content: string;
  type: 'text' | 'voice';
  createdBy: string;
  createdAt: Date;
  voiceUrl?: string; // for voice notes
  duration?: number; // for voice notes in seconds
}

export interface ActivityFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  activityType: string; // predefined or custom
  projectId: string;
  linkedAssets?: string[]; // optional asset IDs
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  assignedUsers: string[]; // user IDs
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  checklist: ActivityChecklistItem[];
  notes: ActivityNote[];
  files: ActivityFile[];
  playbook?: Playbook;
  aiContext?: string; // AI-generated context and recommendations
  isRecurring: boolean; // whether this is a recurring activity
}

// Predefined activity types
export const activityTypes = [
  'Site Inspection',
  'Environmental Audit',
  'Asset Maintenance',
  'Soil Testing',
  'Structural Assessment',
  'Safety Inspection',
  'Progress Review',
  'Compliance Check',
  'Custom'
];

// Mock playbooks
export const mockPlaybooks: Playbook[] = [
  {
    id: 'pb-001',
    name: 'Environmental Audit Playbook',
    activityType: 'Environmental Audit',
    description: 'Standard playbook for conducting comprehensive environmental audits on geotechnical sites',
    isCustom: false,
    contextGuidance: 'Extract context from past environmental reports, identify outstanding issues from previous audits, reference applicable environmental standards and regulations.',
    checklistItems: [
      {
        id: 'ci-001',
        title: 'Review previous environmental reports',
        description: 'Check past audit findings and ensure follow-up actions were completed',
        order: 1,
        isRequired: true
      },
      {
        id: 'ci-002',
        title: 'Inspect site for contamination indicators',
        description: 'Visual inspection for oil spills, discoloration, unusual odors',
        order: 2,
        isRequired: true
      },
      {
        id: 'ci-003',
        title: 'Review waste management procedures',
        description: 'Verify proper storage, labeling, and disposal of hazardous materials',
        order: 3,
        isRequired: true
      },
      {
        id: 'ci-004',
        title: 'Check compliance with environmental permits',
        description: 'Verify all permits are current and conditions are being met',
        order: 4,
        isRequired: true
      },
      {
        id: 'ci-005',
        title: 'Document findings with photos',
        description: 'Capture photographic evidence of any issues or concerns',
        order: 5,
        isRequired: false
      },
      {
        id: 'ci-006',
        title: 'Interview site personnel',
        description: 'Discuss environmental procedures with site team',
        order: 6,
        isRequired: false
      }
    ]
  },
  {
    id: 'pb-002',
    name: 'Site Inspection Playbook',
    activityType: 'Site Inspection',
    description: 'General site inspection protocol for ongoing construction and monitoring',
    isCustom: false,
    contextGuidance: 'Review recent monitoring data, identify active assets requiring inspection, reference design specifications and construction drawings.',
    checklistItems: [
      {
        id: 'ci-101',
        title: 'Review monitoring data from linked assets',
        description: 'Check recent readings for any alerts or anomalies',
        order: 1,
        isRequired: true
      },
      {
        id: 'ci-102',
        title: 'Visual inspection of site conditions',
        description: 'Overall site walkthrough noting any changes or concerns',
        order: 2,
        isRequired: true
      },
      {
        id: 'ci-103',
        title: 'Verify safety measures in place',
        description: 'Check barriers, signage, and safety equipment',
        order: 3,
        isRequired: true
      },
      {
        id: 'ci-104',
        title: 'Inspect instrumentation and monitoring equipment',
        description: 'Verify all instruments are functioning and accessible',
        order: 4,
        isRequired: true
      },
      {
        id: 'ci-105',
        title: 'Document site conditions',
        description: 'Photos and notes on current state',
        order: 5,
        isRequired: false
      }
    ]
  },
  {
    id: 'pb-003',
    name: 'Asset Maintenance Playbook',
    activityType: 'Asset Maintenance',
    description: 'Routine maintenance procedures for monitoring equipment and infrastructure',
    isCustom: false,
    contextGuidance: 'Review maintenance history, identify overdue maintenance items, reference equipment manuals and manufacturer guidelines.',
    checklistItems: [
      {
        id: 'ci-201',
        title: 'Review maintenance logs',
        description: 'Check previous maintenance records for this asset',
        order: 1,
        isRequired: true
      },
      {
        id: 'ci-202',
        title: 'Inspect physical condition of equipment',
        description: 'Check for damage, wear, corrosion',
        order: 2,
        isRequired: true
      },
      {
        id: 'ci-203',
        title: 'Calibrate instruments',
        description: 'Verify and adjust calibration as needed',
        order: 3,
        isRequired: true
      },
      {
        id: 'ci-204',
        title: 'Clean equipment and sensors',
        description: 'Remove debris and ensure sensors are unobstructed',
        order: 4,
        isRequired: false
      },
      {
        id: 'ci-205',
        title: 'Update maintenance records',
        description: 'Document all maintenance activities performed',
        order: 5,
        isRequired: true
      }
    ]
  }
];

// Mock activities
export const mockActivities: Activity[] = [
  {
    id: 'act-001',
    name: 'Q2 Environmental Audit',
    description: 'Quarterly environmental compliance audit for London Crossrail project site',
    activityType: 'Environmental Audit',
    projectId: 'proj-001',
    linkedAssets: ['bh-001', 'bh-002', 'inf-001'],
    status: 'in-progress',
    assignedUsers: ['user-001', 'user-003'],
    createdBy: 'user-001',
    createdAt: new Date('2024-09-25T10:00:00'),
    updatedAt: new Date('2024-10-01T14:30:00'),
    playbook: mockPlaybooks[0],
    aiContext: 'Previous audit (Q1 2024) identified minor oil staining near BH-PAD-001. Follow-up required. Site operating under Environmental Permit EP3425/AB. Recent groundwater monitoring shows no contamination.',
    isRecurring: true,
    checklist: [
      {
        id: 'aci-001',
        title: 'Review previous environmental reports',
        description: 'Check past audit findings and ensure follow-up actions were completed',
        order: 1,
        completed: true,
        completedBy: 'user-001',
        completedAt: new Date('2024-09-26T11:20:00'),
        linkedFiles: ['doc-001', 'doc-002'],
        aiContext: 'Q1 2024 Environmental Audit Report identified minor oil staining at coordinates (51.5155, -0.1753) near BH-PAD-001. Remediation was scheduled for Week 14. Current status shows completed remediation with photographic evidence. Previous audits from 2023 showed full compliance. Focus areas for this quarter: verify remediation effectiveness, check for any new contamination sources.',
        aiContextFetched: true
      },
      {
        id: 'aci-002',
        title: 'Inspect site for contamination indicators',
        description: 'Visual inspection for oil spills, discoloration, unusual odors',
        order: 2,
        completed: true,
        completedBy: 'user-003',
        completedAt: new Date('2024-09-28T09:15:00'),
        linkedFiles: ['doc-003'],
        aiContext: 'Based on historical data, common contamination indicators at this site include: diesel fuel staining from construction equipment (typically near vehicle parking areas), concrete wash-out areas (alkaline pH), and minor hydraulic oil leaks. The remediated area from Q1 should be prioritized. Environmental Standard BS 10175:2011+A2:2017 requires visual inspection of excavation areas. Check specifically around boreholes BH-PAD-001 and BH-PAD-002.',
        aiContextFetched: true
      },
      {
        id: 'aci-003',
        title: 'Review waste management procedures',
        description: 'Verify proper storage, labeling, and disposal of hazardous materials',
        order: 3,
        completed: false,
        linkedFiles: ['doc-004', 'doc-005']
      },
      {
        id: 'aci-004',
        title: 'Check compliance with environmental permits',
        description: 'Verify all permits are current and conditions are being met',
        order: 4,
        completed: false,
        linkedFiles: ['doc-006', 'doc-007']
      },
      {
        id: 'aci-005',
        title: 'Document findings with photos',
        description: 'Capture photographic evidence of any issues or concerns',
        order: 5,
        completed: false,
        linkedFiles: ['doc-008']
      }
    ],
    notes: [
      {
        id: 'note-001',
        content: 'Oil staining from Q1 has been remediated. Area now clean.',
        type: 'text',
        createdBy: 'user-003',
        createdAt: new Date('2024-09-28T09:20:00')
      }
    ],
    files: [
      {
        id: 'file-001',
        name: 'Site Photos - North Area.jpg',
        type: 'image/jpeg',
        size: 2457600,
        url: '#',
        uploadedBy: 'user-003',
        uploadedAt: new Date('2024-09-28T09:25:00')
      }
    ]
  },
  {
    id: 'act-002',
    name: 'Monthly Inclinometer Check',
    description: 'Regular inspection and data collection from INC-PAD-001',
    activityType: 'Asset Maintenance',
    projectId: 'proj-001',
    linkedAssets: ['mon-001'],
    status: 'planned',
    assignedUsers: ['user-002'],
    createdBy: 'user-001',
    createdAt: new Date('2024-10-01T09:00:00'),
    updatedAt: new Date('2024-10-01T09:00:00'),
    playbook: mockPlaybooks[2],
    aiContext: 'Last calibration performed 30 days ago. Instrument showing normal readings. No alerts triggered.',
    isRecurring: true,
    checklist: [
      {
        id: 'aci-101',
        title: 'Review maintenance logs',
        description: 'Check previous maintenance records for this asset',
        order: 1,
        completed: false
      },
      {
        id: 'aci-102',
        title: 'Inspect physical condition of equipment',
        description: 'Check for damage, wear, corrosion',
        order: 2,
        completed: false
      },
      {
        id: 'aci-103',
        title: 'Calibrate instruments',
        description: 'Verify and adjust calibration as needed',
        order: 3,
        completed: false
      },
      {
        id: 'aci-104',
        title: 'Update maintenance records',
        description: 'Document all maintenance activities performed',
        order: 4,
        completed: false
      }
    ],
    notes: [],
    files: []
  },
  {
    id: 'act-003',
    name: 'Thames Tideway TBM Launch Inspection',
    description: 'Pre-launch safety and structural inspection of TBM chamber',
    activityType: 'Site Inspection',
    projectId: 'proj-002',
    linkedAssets: ['inf-101', 'mon-101'],
    status: 'completed',
    assignedUsers: ['user-001', 'user-002', 'user-004'],
    createdBy: 'user-001',
    createdAt: new Date('2024-09-15T08:00:00'),
    updatedAt: new Date('2024-09-20T16:00:00'),
    playbook: mockPlaybooks[1],
    aiContext: 'Chamber construction completed. All monitoring points showing stable readings. Ready for TBM launch sequence.',
    isRecurring: false,
    checklist: [
      {
        id: 'aci-201',
        title: 'Review monitoring data from linked assets',
        description: 'Check recent readings for any alerts or anomalies',
        order: 1,
        completed: true,
        completedBy: 'user-002',
        completedAt: new Date('2024-09-16T10:00:00')
      },
      {
        id: 'aci-202',
        title: 'Visual inspection of site conditions',
        description: 'Overall site walkthrough noting any changes or concerns',
        order: 2,
        completed: true,
        completedBy: 'user-001',
        completedAt: new Date('2024-09-17T09:30:00')
      },
      {
        id: 'aci-203',
        title: 'Verify safety measures in place',
        description: 'Check barriers, signage, and safety equipment',
        order: 3,
        completed: true,
        completedBy: 'user-004',
        completedAt: new Date('2024-09-17T11:00:00')
      },
      {
        id: 'aci-204',
        title: 'Inspect instrumentation and monitoring equipment',
        description: 'Verify all instruments are functioning and accessible',
        order: 4,
        completed: true,
        completedBy: 'user-002',
        completedAt: new Date('2024-09-18T14:00:00')
      },
      {
        id: 'aci-205',
        title: 'Document site conditions',
        description: 'Photos and notes on current state',
        order: 5,
        completed: true,
        completedBy: 'user-001',
        completedAt: new Date('2024-09-20T15:30:00')
      }
    ],
    notes: [
      {
        id: 'note-101',
        content: 'All safety systems operational. Chamber ready for TBM launch.',
        type: 'text',
        createdBy: 'user-001',
        createdAt: new Date('2024-09-20T15:45:00')
      },
      {
        id: 'note-102',
        content: 'Voice note from site - final walkthrough',
        type: 'voice',
        createdBy: 'user-001',
        createdAt: new Date('2024-09-20T16:00:00'),
        voiceUrl: '#',
        duration: 45
      }
    ],
    files: [
      {
        id: 'file-101',
        name: 'TBM Chamber Inspection Report.pdf',
        type: 'application/pdf',
        size: 3145728,
        url: '#',
        uploadedBy: 'user-001',
        uploadedAt: new Date('2024-09-20T16:30:00')
      }
    ]
  }
];