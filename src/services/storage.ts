import {
  User,
  Department,
  ComplaintCategory,
  Complaint,
  CivicNotification,
  AnalyticsSummary,
  StatusHistoryEntry,
  ComplaintStatus,
  CitizenFeedback,
} from '../types';
import { GHMC_WARDS, getClosestGHMCWard, getGHMCWardByNumber } from '../data/ghmcWards';

const STORAGE_KEYS = {
  USERS: 'ccirs_users_v2_hyd',
  DEPARTMENTS: 'ccirs_departments_v2_hyd',
  CATEGORIES: 'ccirs_categories_v2_hyd',
  COMPLAINTS: 'ccirs_complaints_v2_hyd',
  NOTIFICATIONS: 'ccirs_notifications_v2_hyd',
  CURRENT_USER: 'ccirs_auth_user_v2_hyd',
};

// Official GHMC Municipal Departments
export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-roads',
    name: 'Roads & Bridges Department',
    code: 'DEP-ROADS',
    description: 'GHMC Engineering wing responsible for main thoroughfares, internal colony roads, asphalt resurfacing, pothole filling, and flyovers.',
    headName: 'Er. K. Venkataramana, Chief Engineer (Roads)',
    email: 'ce.roads@ghmc.gov.in',
    phone: '+91 40 2111 1111',
    slaTargetHours: 48,
    activeOfficerCount: 4,
  },
  {
    id: 'dept-sanitation',
    name: 'Sanitation & Solid Waste Management',
    code: 'DEP-SANI',
    description: 'Handles daily door-to-door waste collection, primary collection points, dumper placers, street sweeping, and transfer stations.',
    headName: 'Dr. B. Sudhakar, Additional Commissioner (Sanitation)',
    email: 'ac.sanitation@ghmc.gov.in',
    phone: '+91 40 2111 2222',
    slaTargetHours: 24,
    activeOfficerCount: 6,
  },
  {
    id: 'dept-water',
    name: 'HMWSSB (Water Supply & Sewerage Board)',
    code: 'DEP-WATER',
    description: 'Hyderabad Metropolitan Water Supply and Sewerage Board — manages Krishna/Godavari drinking water pipelines, valve leakages, and sewer overflows.',
    headName: 'Er. M. Praveen Kumar, Director (Operations)',
    email: 'gm.waterworks@hmwssb.gov.in',
    phone: '+91 40 2343 1000',
    slaTargetHours: 36,
    activeOfficerCount: 5,
  },
  {
    id: 'dept-electrical',
    name: 'Public Lighting & Electrical Engineering',
    code: 'DEP-LIGHT',
    description: 'Oversees 4.5 lakh LED streetlights, CCMS timer control panels, high mast lamps, and fallen electric cable hazards across GHMC.',
    headName: 'Er. S. Anand Rao, Superintending Engineer (Electrical)',
    email: 'se.electrical@ghmc.gov.in',
    phone: '+91 40 2111 4444',
    slaTargetHours: 24,
    activeOfficerCount: 3,
  },
  {
    id: 'dept-drainage',
    name: 'Stormwater Drainage & SNDP Wing',
    code: 'DEP-DRAIN',
    description: 'Strategic Nala Development Programme (SNDP) wing clearing stormwater bottlenecks, culvert siltation, and monsoon inundation points.',
    headName: 'Er. C. Vasantha, Chief Engineer (SNDP)',
    email: 'ce.drainage@ghmc.gov.in',
    phone: '+91 40 2111 5555',
    slaTargetHours: 48,
    activeOfficerCount: 3,
  },
  {
    id: 'dept-facilities',
    name: 'Urban Forestry, Parks & Civic Facilities',
    code: 'DEP-INFRA',
    description: 'Maintains GHMC colony parks, public toilets, footpaths, road signage, children play areas, and unclassified civic problems.',
    headName: 'Shri. G. Srinivas, Director (Urban Forestry)',
    email: 'director.parks@ghmc.gov.in',
    phone: '+91 40 2111 6666',
    slaTargetHours: 72,
    activeOfficerCount: 3,
  },
];

export const INITIAL_CATEGORIES: ComplaintCategory[] = [
  {
    id: 'cat-roads',
    name: 'Roads & Potholes',
    description: 'Deep road potholes, crumbling bitumen, missing paver blocks, dangerous craters, and damaged lane dividers.',
    defaultDepartmentId: 'dept-roads',
    defaultDepartmentName: 'Roads & Bridges Department',
    slaHours: 48,
    iconName: 'Car',
    color: '#2563EB', // Royal Blue
    active: true,
  },
  {
    id: 'cat-sanitation',
    name: 'Garbage & Waste Overflow',
    description: 'Unattended dumper bins, roadside debris accumulation, commercial waste dumping, and dead animal clearance.',
    defaultDepartmentId: 'dept-sanitation',
    defaultDepartmentName: 'Sanitation & Solid Waste Management',
    slaHours: 24,
    iconName: 'Trash2',
    color: '#0D9488', // Teal
    active: true,
  },
  {
    id: 'cat-water',
    name: 'Water Supply & Pipeline Leakage',
    description: 'Burst potable water supply mains, contaminated drinking water, zero pressure, or HMWSSB valve leakage.',
    defaultDepartmentId: 'dept-water',
    defaultDepartmentName: 'HMWSSB (Water Supply & Sewerage Board)',
    slaHours: 36,
    iconName: 'Droplets',
    color: '#0284C7', // Sky Blue
    active: true,
  },
  {
    id: 'cat-lighting',
    name: 'Streetlights & Electrical Hazards',
    description: 'Dark streets, non-functioning LED lamps, dangling electrical wires, spark hazards, or leaning utility poles.',
    defaultDepartmentId: 'dept-electrical',
    defaultDepartmentName: 'Public Lighting & Electrical Engineering',
    slaHours: 24,
    iconName: 'Lightbulb',
    color: '#D97706', // Amber
    active: true,
  },
  {
    id: 'cat-drainage',
    name: 'Drainage & Sewage Blockage',
    description: 'Overflowing sewage manholes, blocked nala culverts, stagnant dirty water, and rainwater stagnation.',
    defaultDepartmentId: 'dept-drainage',
    defaultDepartmentName: 'Stormwater Drainage & SNDP Wing',
    slaHours: 48,
    iconName: 'Waves',
    color: '#7C3AED', // Purple
    active: true,
  },
  {
    id: 'cat-facilities',
    name: 'Parks & Civic Infrastructure',
    description: 'Damaged park equipment, broken footpaths, open manhole covers, missing public signage, and public amenities.',
    defaultDepartmentId: 'dept-facilities',
    defaultDepartmentName: 'Urban Forestry, Parks & Civic Facilities',
    slaHours: 72,
    iconName: 'Trees',
    color: '#059669', // Emerald
    active: true,
  },
  {
    id: 'cat-other',
    name: 'Other / Different Issue',
    description: 'Specific civic grievance not covered above. Requires citizen custom description and manual review.',
    defaultDepartmentId: 'dept-facilities',
    defaultDepartmentName: 'Urban Forestry, Parks & Civic Facilities',
    slaHours: 48,
    iconName: 'AlertCircle',
    color: '#EA580C', // Orange / Coral
    active: true,
    isCustom: true,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-citizen-1',
    name: 'Gayathri Bodanapu',
    email: 'bodanigayathri18@gmail.com',
    phone: '+91 98451 23456',
    role: 'citizen',
    createdAt: '2026-09-15T09:30:00Z',
    isActive: true,
    isApproved: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'user-citizen-2',
    name: 'Arunav Sengupta',
    email: 'arunav.citizen@ccirs.gov',
    phone: '+91 98452 78901',
    role: 'citizen',
    createdAt: '2026-09-18T11:20:00Z',
    isActive: true,
    isApproved: true,
  },
  // Approved Municipal Officers for Hyderabad
  {
    id: 'user-officer-roads',
    name: 'Er. Rajesh Kumar',
    email: 'rajesh.roads@municipal.ccirs.gov',
    phone: '+91 98453 11223',
    role: 'officer',
    officerId: 'GHMC-ENG-4921',
    wardNumber: 93,
    wardName: 'Banjara Hills',
    zone: 'Khairatabad',
    departmentId: 'dept-roads',
    departmentName: 'Roads & Bridges Department',
    designation: 'Executive Engineer (Roads - Khairatabad Zone)',
    createdAt: '2026-08-01T08:00:00Z',
    isActive: true,
    isApproved: true,
  },
  {
    id: 'user-officer-sanitation',
    name: 'Smt. Sunita Verma',
    email: 'sunita.sanitation@municipal.ccirs.gov',
    phone: '+91 98454 44556',
    role: 'officer',
    officerId: 'GHMC-SANI-1042',
    wardNumber: 105,
    wardName: 'Gachibowli',
    zone: 'Serilingampally',
    departmentId: 'dept-sanitation',
    departmentName: 'Sanitation & Solid Waste Management',
    designation: 'Assistant Medical Officer of Health (AMOH - Serilingampally)',
    createdAt: '2026-08-01T08:00:00Z',
    isActive: true,
    isApproved: true,
  },
  {
    id: 'user-officer-water',
    name: 'Er. Vikram Patel',
    email: 'vikram.water@municipal.ccirs.gov',
    phone: '+91 98455 77889',
    role: 'officer',
    officerId: 'HMWSSB-OP-8201',
    wardNumber: 149,
    wardName: 'Begumpet',
    zone: 'Secunderabad',
    departmentId: 'dept-water',
    departmentName: 'HMWSSB (Water Supply & Sewerage Board)',
    designation: 'General Manager (HMWSSB Operation & Maintenance)',
    createdAt: '2026-08-05T08:00:00Z',
    isActive: true,
    isApproved: true,
  },
  {
    id: 'user-officer-electrical',
    name: 'Er. Anil Mehta',
    email: 'anil.electrical@municipal.ccirs.gov',
    phone: '+91 98456 99001',
    role: 'officer',
    officerId: 'GHMC-ELEC-3310',
    wardNumber: 107,
    wardName: 'Madhapur',
    zone: 'Serilingampally',
    departmentId: 'dept-electrical',
    departmentName: 'Public Lighting & Electrical Engineering',
    designation: 'Sub-Divisional Electrical Inspector (Hitec City Division)',
    createdAt: '2026-08-10T08:00:00Z',
    isActive: true,
    isApproved: true,
  },
  // Sample Pending Officer Registration (to test the Administrator Approval Workflow!)
  {
    id: 'user-officer-pending-1',
    name: 'Er. Sneha Reddy',
    email: 'sneha.reddy@ghmc.gov.in',
    phone: '+91 98459 33445',
    role: 'officer',
    officerId: 'GHMC-ENG-9872',
    wardNumber: 95,
    wardName: 'Jubilee Hills',
    zone: 'Khairatabad',
    departmentId: 'dept-roads',
    departmentName: 'Roads & Bridges Department',
    designation: 'Assistant Engineer (Jubilee Hills Circle)',
    createdAt: '2026-10-24T14:15:00Z',
    isActive: true,
    isApproved: false, // Pending admin approval
  },
  // Administrator
  {
    id: 'user-admin',
    name: 'Dr. Aruna Sharma, IAS',
    email: 'admin@ccirs.gov',
    phone: '+91 40 2111 0000',
    role: 'admin',
    designation: 'GHMC Commissioner & Administrative Director',
    createdAt: '2026-07-01T08:00:00Z',
    isActive: true,
    isApproved: true,
  },
];

// Realistic Initial Complaints in Hyderabad with real GHMC Wards & Coordinates
export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CCIRS-2026-8491',
    title: 'Severe 2-foot asphalt crater and crumbling pavement on Road No 12, Banjara Hills',
    description: 'Dangerous pothole formed after recent heavy showers near Taj Krishna junction on Road No 12. Pavement aggregates are scattered across the roadway, causing extreme risk to motorists and cyclists.',
    categoryId: 'cat-roads',
    categoryName: 'Roads & Potholes',
    priority: 'Critical',
    status: 'In Progress',
    citizenId: 'user-citizen-1',
    citizenName: 'Gayathri Bodanapu',
    citizenPhone: '+91 98451 23456',
    citizenEmail: 'bodanigayathri18@gmail.com',
    departmentId: 'dept-roads',
    departmentName: 'Roads & Bridges Department',
    assignedOfficerId: 'user-officer-roads',
    assignedOfficerName: 'Er. Rajesh Kumar',
    wardNumber: 105,
    wardName: 'Banjara Hills',
    zone: 'Khairatabad',
    location: {
      address: 'Road No 12, Near Taj Krishna Junction, Banjara Hills, Ward 105, Hyderabad',
      latitude: 17.4156,
      longitude: 78.4345,
      accuracyMeters: 6,
      landmark: 'Near Taj Krishna Junction, Road No 12',
      wardNumber: 105,
      wardName: 'Banjara Hills',
      zone: 'Khairatabad',
    },
    images: ['/src/assets/images/civic_issue_pothole_1792817454409.jpg'],
    createdAt: '2026-10-22T09:15:00Z',
    updatedAt: '2026-10-23T14:30:00Z',
    statusHistory: [
      {
        id: 'hist-1',
        complaintId: 'CCIRS-2026-8491',
        status: 'Submitted',
        changedBy: 'Gayathri Bodanapu',
        changedByRole: 'citizen',
        timestamp: '2026-10-22T09:15:00Z',
        remarks: 'Complaint registered by citizen with high-accuracy GPS location and photo evidence.',
      },
      {
        id: 'hist-2',
        complaintId: 'CCIRS-2026-8491',
        status: 'Assigned',
        changedBy: 'System Auto-Router',
        changedByRole: 'admin',
        timestamp: '2026-10-22T09:15:05Z',
        remarks: 'Automatically assigned to Roads & Bridges Department under GHMC Category Rules. Dispatched to Er. Rajesh Kumar (Ward 105 Inspector).',
      },
      {
        id: 'hist-3',
        complaintId: 'CCIRS-2026-8491',
        status: 'In Progress',
        changedBy: 'Er. Rajesh Kumar',
        changedByRole: 'officer',
        timestamp: '2026-10-23T14:30:00Z',
        remarks: 'Road maintenance crew dispatched with cold bitumen emulsion mix and asphalt compaction roller. Work underway.',
      },
    ],
  },
  {
    id: 'CCIRS-2026-8488',
    title: 'Overflowing commercial waste dumper bin and pavement litter near Gachibowli Junction',
    description: 'Municipal waste dumper near Gachibowli Outer Ring Road flyover has overflowed onto pedestrian walkway. Stray animals scattering refuse, generating foul odor in front of IT complex.',
    categoryId: 'cat-sanitation',
    categoryName: 'Garbage & Waste Overflow',
    priority: 'High',
    status: 'Resolved',
    citizenId: 'user-citizen-1',
    citizenName: 'Gayathri Bodanapu',
    citizenPhone: '+91 98451 23456',
    citizenEmail: 'bodanigayathri18@gmail.com',
    departmentId: 'dept-sanitation',
    departmentName: 'Sanitation & Solid Waste Management',
    assignedOfficerId: 'user-officer-sanitation',
    assignedOfficerName: 'Smt. Sunita Verma',
    wardNumber: 113,
    wardName: 'Gachibowli',
    zone: 'Serilingampally',
    location: {
      address: 'Gachibowli Stadium Road, Commercial Arcade, Ward 113, Hyderabad',
      latitude: 17.4401,
      longitude: 78.3489,
      accuracyMeters: 5,
      landmark: 'Opposite Gachibowli Indoor Stadium Gate 3',
      wardNumber: 113,
      wardName: 'Gachibowli',
      zone: 'Serilingampally',
    },
    images: ['/src/assets/images/civic_issue_garbage_1792817455474.jpg'],
    createdAt: '2026-10-21T07:45:00Z',
    updatedAt: '2026-10-22T11:20:00Z',
    resolvedAt: '2026-10-22T11:20:00Z',
    resolutionEvidence: {
      id: 'res-8488',
      complaintId: 'CCIRS-2026-8488',
      resolvedAt: '2026-10-22T11:20:00Z',
      resolvedByOfficerId: 'user-officer-sanitation',
      resolvedByOfficerName: 'Smt. Sunita Verma',
      workDescription: 'GHMC hydraulic compactor truck TS-09-UB-4421 deployed. 3.2 tons of accumulated commercial garbage cleared, sidewalk swept clean, and bin collection pad disinfected with bleaching powder.',
      evidenceImages: ['/src/assets/images/civic_clean_dumpster_1792927532461.jpg'],
      materialsUsed: 'Hydraulic Compactor, 25kg Bleaching Powder & Disinfectant Spray',
    },
    feedback: {
      id: 'fb-8488',
      complaintId: 'CCIRS-2026-8488',
      citizenId: 'user-citizen-1',
      citizenName: 'Gayathri Bodanapu',
      rating: 5,
      comments: 'Very swift response by GHMC sanitation team! The sidewalk was thoroughly washed and the bin cleared.',
      createdAt: '2026-10-22T13:40:00Z',
      resolutionSatisfactory: true,
    },
    statusHistory: [
      {
        id: 'hist-8488-1',
        complaintId: 'CCIRS-2026-8488',
        status: 'Submitted',
        changedBy: 'Gayathri Bodanapu',
        changedByRole: 'citizen',
        timestamp: '2026-10-21T07:45:00Z',
        remarks: 'Issue filed by citizen with location coordinates and photo.',
      },
      {
        id: 'hist-8488-2',
        complaintId: 'CCIRS-2026-8488',
        status: 'Assigned',
        changedBy: 'System Auto-Router',
        changedByRole: 'admin',
        timestamp: '2026-10-21T07:45:08Z',
        remarks: 'Assigned to Sanitation Department. Officer: Smt. Sunita Verma.',
      },
      {
        id: 'hist-8488-3',
        complaintId: 'CCIRS-2026-8488',
        status: 'In Progress',
        changedBy: 'Smt. Sunita Verma',
        changedByRole: 'officer',
        timestamp: '2026-10-21T09:30:00Z',
        remarks: 'Waste compactor truck en route for priority morning round.',
      },
      {
        id: 'hist-8488-4',
        complaintId: 'CCIRS-2026-8488',
        status: 'Resolved',
        changedBy: 'Smt. Sunita Verma',
        changedByRole: 'officer',
        timestamp: '2026-10-22T11:20:00Z',
        remarks: 'Cleaned thoroughly and sanitized. Resolution evidence photo attached.',
        evidenceImages: ['/src/assets/images/civic_clean_dumpster_1792927532461.jpg'],
      },
    ],
  },
  {
    id: 'CCIRS-2026-8472',
    title: 'Bent streetlight pole with exposed wiring near Cyber Towers junction, Madhapur',
    description: 'Municipal utility pole tilted dangerously after being hit by a commercial vehicle at night. Sparking junction box and hanging live cables directly above pedestrian pathway.',
    categoryId: 'cat-lighting',
    categoryName: 'Streetlights & Electrical Hazards',
    priority: 'Critical',
    status: 'Assigned',
    citizenId: 'user-citizen-2',
    citizenName: 'Arunav Sengupta',
    citizenPhone: '+91 98452 78901',
    citizenEmail: 'arunav.citizen@ccirs.gov',
    departmentId: 'dept-electrical',
    departmentName: 'Public Lighting & Electrical Engineering',
    assignedOfficerId: 'user-officer-electrical',
    assignedOfficerName: 'Er. Anil Mehta',
    wardNumber: 115,
    wardName: 'Madhapur',
    zone: 'Serilingampally',
    location: {
      address: 'Near Cyber Towers Junction, Hitec City Road, Madhapur, Ward 115, Hyderabad',
      latitude: 17.4486,
      longitude: 78.3908,
      accuracyMeters: 4,
      landmark: 'Adjacent to Metro Pillar 1142',
      wardNumber: 115,
      wardName: 'Madhapur',
      zone: 'Serilingampally',
    },
    images: ['/src/assets/images/civic_issue_streetlight_1792817455417.jpg'],
    createdAt: '2026-10-24T08:10:00Z',
    updatedAt: '2026-10-24T08:10:06Z',
    statusHistory: [
      {
        id: 'hist-8472-1',
        complaintId: 'CCIRS-2026-8472',
        status: 'Submitted',
        changedBy: 'Arunav Sengupta',
        changedByRole: 'citizen',
        timestamp: '2026-10-24T08:10:00Z',
        remarks: 'Citizen reported hazardous leaning streetlight pole with exposed wiring.',
      },
      {
        id: 'hist-8472-2',
        complaintId: 'CCIRS-2026-8472',
        status: 'Assigned',
        changedBy: 'System Auto-Router',
        changedByRole: 'admin',
        timestamp: '2026-10-24T08:10:06Z',
        remarks: 'Auto-routed to Public Lighting & Electrical Works. Safety crew notified for immediate power isolation.',
      },
    ],
  },
  {
    id: 'CCIRS-2026-8470',
    title: 'Broken non-functional LED streetlight pole on Road No 10, Banjara Hills',
    description: 'Streetlight pole had burned out bulb and short-circuited controller box, causing complete dark zone along road curve.',
    categoryId: 'cat-lighting',
    categoryName: 'Streetlights & Electrical Hazards',
    priority: 'High',
    status: 'Resolved',
    citizenId: 'user-citizen-1',
    citizenName: 'Gayathri Bodanapu',
    citizenPhone: '+91 98451 23456',
    citizenEmail: 'bodanigayathri18@gmail.com',
    departmentId: 'dept-electrical',
    departmentName: 'Public Lighting & Electrical Engineering',
    assignedOfficerId: 'user-officer-electrical',
    assignedOfficerName: 'Er. Anil Mehta',
    wardNumber: 105,
    wardName: 'Banjara Hills',
    zone: 'Khairatabad',
    location: {
      address: 'Road No 10, Near Cancer Hospital Curve, Banjara Hills, Ward 105, Hyderabad',
      latitude: 17.4198,
      longitude: 78.4412,
      accuracyMeters: 5,
      landmark: 'Opposite Road 10 Park Entry',
      wardNumber: 105,
      wardName: 'Banjara Hills',
      zone: 'Khairatabad',
    },
    images: ['/src/assets/images/civic_issue_streetlight_1792817455417.jpg'],
    createdAt: '2026-10-20T18:30:00Z',
    updatedAt: '2026-10-21T20:15:00Z',
    resolvedAt: '2026-10-21T20:15:00Z',
    resolutionEvidence: {
      id: 'res-8470',
      complaintId: 'CCIRS-2026-8470',
      resolvedAt: '2026-10-21T20:15:00Z',
      resolvedByOfficerId: 'user-officer-electrical',
      resolvedByOfficerName: 'Er. Anil Mehta',
      workDescription: 'Pole realigned to vertical position with high-tensile base bolts. Installed new 120W energy-efficient LED luminaire and sealed waterproof electrical junction box.',
      evidenceImages: ['/src/assets/images/civic_repaired_light_1792927550075.jpg'],
      materialsUsed: '120W Philips LED Fixture, MCB Switch, Waterproof Cable Glands',
    },
    feedback: {
      id: 'fb-8470',
      complaintId: 'CCIRS-2026-8470',
      citizenId: 'user-citizen-1',
      citizenName: 'Gayathri Bodanapu',
      rating: 5,
      comments: 'Repaired on the same evening! Street is now safely lit.',
      createdAt: '2026-10-21T21:00:00Z',
      resolutionSatisfactory: true,
    },
    statusHistory: [
      {
        id: 'hist-8470-1',
        complaintId: 'CCIRS-2026-8470',
        status: 'Submitted',
        changedBy: 'Gayathri Bodanapu',
        changedByRole: 'citizen',
        timestamp: '2026-10-20T18:30:00Z',
        remarks: 'Reported dark street section due to broken fixture.',
      },
      {
        id: 'hist-8470-2',
        complaintId: 'CCIRS-2026-8470',
        status: 'Assigned',
        changedBy: 'System Auto-Router',
        changedByRole: 'admin',
        timestamp: '2026-10-20T18:30:05Z',
        remarks: 'Assigned to Electrical Department.',
      },
      {
        id: 'hist-8470-3',
        complaintId: 'CCIRS-2026-8470',
        status: 'Resolved',
        changedBy: 'Er. Anil Mehta',
        changedByRole: 'officer',
        timestamp: '2026-10-21T20:15:00Z',
        remarks: 'New LED luminaire installed and tested. Certified with resolution photo.',
        evidenceImages: ['/src/assets/images/civic_repaired_light_1792927550075.jpg'],
      },
    ],
  },
  {
    id: 'CCIRS-2026-8465',
    title: 'High-pressure drinking water main rupture flooding Begumpet Main Road',
    description: 'Massive burst in underground HMWSSB drinking water pipeline creating torrent of water and localized flooding on roadway near Prakash Nagar.',
    categoryId: 'cat-water',
    categoryName: 'Water Supply & Pipeline Leakage',
    priority: 'High',
    status: 'In Progress',
    citizenId: 'user-citizen-1',
    citizenName: 'Gayathri Bodanapu',
    citizenPhone: '+91 98451 23456',
    citizenEmail: 'bodanigayathri18@gmail.com',
    departmentId: 'dept-water',
    departmentName: 'HMWSSB (Water Supply & Sewerage Board)',
    assignedOfficerId: 'user-officer-water',
    assignedOfficerName: 'Er. Vikram Patel',
    wardNumber: 149,
    wardName: 'Begumpet',
    zone: 'Secunderabad',
    location: {
      address: 'Prakash Nagar Junction, Begumpet Main Road, Ward 149, Hyderabad',
      latitude: 17.4412,
      longitude: 78.4712,
      accuracyMeters: 6,
      landmark: 'Near Begumpet Post Office',
      wardNumber: 149,
      wardName: 'Begumpet',
      zone: 'Secunderabad',
    },
    images: ['/src/assets/images/civic_water_leak_1792927477707.jpg'],
    createdAt: '2026-10-24T10:00:00Z',
    updatedAt: '2026-10-24T12:15:00Z',
    statusHistory: [
      {
        id: 'hist-8465-1',
        complaintId: 'CCIRS-2026-8465',
        status: 'Submitted',
        changedBy: 'Gayathri Bodanapu',
        changedByRole: 'citizen',
        timestamp: '2026-10-24T10:00:00Z',
        remarks: 'Reported with high priority due to clean water wastage.',
      },
      {
        id: 'hist-8465-2',
        complaintId: 'CCIRS-2026-8465',
        status: 'Assigned',
        changedBy: 'System Auto-Router',
        changedByRole: 'admin',
        timestamp: '2026-10-24T10:00:04Z',
        remarks: 'Assigned to HMWSSB Operation & Maintenance division.',
      },
      {
        id: 'hist-8465-3',
        complaintId: 'CCIRS-2026-8465',
        status: 'In Progress',
        changedBy: 'Er. Vikram Patel',
        changedByRole: 'officer',
        timestamp: '2026-10-24T12:15:00Z',
        remarks: 'Emergency isolation valve turned off. Excavation team on site to install pipe clamp sleeve.',
      },
    ],
  },
  {
    id: 'CCIRS-2026-8450',
    title: 'Open stormwater culvert choked with silt near Charminar Lad Bazar',
    description: 'Roadside drainage conduit blocked with plastic bags and fallen masonry, resulting in sewage stagnation during morning pedestrian hours.',
    categoryId: 'cat-drainage',
    categoryName: 'Drainage & Sewage Blockage',
    priority: 'Medium',
    status: 'Submitted',
    citizenId: 'user-citizen-2',
    citizenName: 'Arunav Sengupta',
    citizenPhone: '+91 98452 78901',
    citizenEmail: 'arunav.citizen@ccirs.gov',
    departmentId: 'dept-drainage',
    departmentName: 'Stormwater Drainage & SNDP Wing',
    wardNumber: 53,
    wardName: 'Ghansi Bazar',
    zone: 'Charminar',
    location: {
      address: 'Lad Bazar Road, South of Charminar, Ward 53, Hyderabad',
      latitude: 17.3621,
      longitude: 78.4712,
      accuracyMeters: 8,
      landmark: 'Near Charminar Heritage Police Station',
      wardNumber: 53,
      wardName: 'Ghansi Bazar',
      zone: 'Charminar',
    },
    images: ['/src/assets/images/civic_drainage_choke_1792927496927.jpg'],
    createdAt: '2026-10-24T16:20:00Z',
    updatedAt: '2026-10-24T16:20:00Z',
    statusHistory: [
      {
        id: 'hist-8450-1',
        complaintId: 'CCIRS-2026-8450',
        status: 'Submitted',
        changedBy: 'Arunav Sengupta',
        changedByRole: 'citizen',
        timestamp: '2026-10-24T16:20:00Z',
        remarks: 'Citizen submission received. Pending review by SNDP Drainage Wing.',
      },
    ],
  },
  {
    id: 'CCIRS-2026-8439',
    title: 'Damaged children swing set and broken perimeter railing at KPHB Colony Park',
    description: 'Multiple wooden bench slats missing and children swing chain detached at Phase 3 Community Garden.',
    categoryId: 'cat-facilities',
    categoryName: 'Parks & Civic Infrastructure',
    priority: 'Low',
    status: 'Rejected',
    citizenId: 'user-citizen-1',
    citizenName: 'Gayathri Bodanapu',
    citizenPhone: '+91 98451 23456',
    citizenEmail: 'bodanigayathri18@gmail.com',
    departmentId: 'dept-facilities',
    departmentName: 'Urban Forestry, Parks & Civic Facilities',
    assignedOfficerId: 'user-officer-sanitation',
    assignedOfficerName: 'Smt. Sunita Verma',
    wardNumber: 132,
    wardName: 'KPHB Colony',
    zone: 'Kukatpally',
    location: {
      address: 'Phase 3 Community Park, KPHB Colony, Ward 132, Hyderabad',
      latitude: 17.4923,
      longitude: 78.3989,
      accuracyMeters: 7,
      landmark: 'Near KPHB Colony Water Tank',
      wardNumber: 132,
      wardName: 'KPHB Colony',
      zone: 'Kukatpally',
    },
    images: ['/src/assets/images/civic_park_damage_1792927513582.jpg'],
    createdAt: '2026-10-18T16:00:00Z',
    updatedAt: '2026-10-19T10:15:00Z',
    statusHistory: [
      {
        id: 'hist-8439-1',
        complaintId: 'CCIRS-2026-8439',
        status: 'Submitted',
        changedBy: 'Gayathri Bodanapu',
        changedByRole: 'citizen',
        timestamp: '2026-10-18T16:00:00Z',
        remarks: 'Citizen submission received.',
      },
      {
        id: 'hist-8439-2',
        complaintId: 'CCIRS-2026-8439',
        status: 'Rejected',
        changedBy: 'Dr. Aruna Sharma, IAS',
        changedByRole: 'admin',
        timestamp: '2026-10-19T10:15:00Z',
        remarks: 'Duplicate Notice: GHMC Urban Forestry contract #UF-2026-KPHB has already commenced site modernization of all 14 park swings in this sector.',
      },
    ],
  },
];

export const INITIAL_NOTIFICATIONS: CivicNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-citizen-1',
    complaintId: 'CCIRS-2026-8491',
    title: 'Status Updated: In Progress',
    message: 'Your complaint regarding road pothole at Banjara Hills (Ward 105) is now In Progress by Roads Department.',
    type: 'status_change',
    isRead: false,
    createdAt: '2026-10-23T14:30:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-citizen-1',
    complaintId: 'CCIRS-2026-8488',
    title: 'Issue Resolved & Verified',
    message: 'Sanitation Department resolved your garbage overflow complaint at Gachibowli (Ward 113). Please rate the repair quality!',
    type: 'resolution',
    isRead: true,
    createdAt: '2026-10-22T11:20:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-officer-roads',
    complaintId: 'CCIRS-2026-8491',
    title: 'New Complaint Assignment',
    message: 'Critical priority complaint #CCIRS-2026-8491 (Road No 12, Banjara Hills) assigned to your department queue.',
    type: 'assignment',
    isRead: false,
    createdAt: '2026-10-22T09:15:05Z',
  },
];

type StorageListener = () => void;

class StorageService {
  private users: User[] = [];
  private departments: Department[] = [];
  private categories: ComplaintCategory[] = [];
  private complaints: Complaint[] = [];
  private notifications: CivicNotification[] = [];
  private currentUser: User | null = null;
  private listeners: Set<StorageListener> = new Set();

  constructor() {
    this.init();
  }

  public subscribe(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Error notifying storage listener', err);
      }
    });
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (storedUsers) {
        let loadedUsers: User[] = JSON.parse(storedUsers);
        // Synchronize ward details with verified GHMC official 150 wards dataset
        loadedUsers = loadedUsers.map((u) => {
          if (u.wardNumber) {
            const verified = getGHMCWardByNumber(u.wardNumber);
            if (verified) {
              u.wardName = verified.wardName;
              u.zone = verified.zone;
            }
          }
          return u;
        });
        this.users = loadedUsers;
      } else {
        this.users = [...INITIAL_USERS];
      }

      const storedDept = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      this.departments = storedDept ? JSON.parse(storedDept) : [...INITIAL_DEPARTMENTS];

      const storedCat = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      this.categories = storedCat ? JSON.parse(storedCat) : [...INITIAL_CATEGORIES];

      const storedComplaints = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      if (storedComplaints) {
        let loaded: Complaint[] = JSON.parse(storedComplaints);
        // Correct legacy generic cityscape references in previously stored complaints
        loaded = loaded.map((c) => {
          if (c.id === 'CCIRS-2026-8488' && c.resolutionEvidence) {
            c.resolutionEvidence.evidenceImages = ['/src/assets/images/civic_clean_dumpster_1792927532461.jpg'];
          }
          if (c.id === 'CCIRS-2026-8465' && c.images.some((img) => img.includes('cityscape'))) {
            c.images = ['/src/assets/images/civic_water_leak_1792927477707.jpg'];
          }
          if (c.id === 'CCIRS-2026-8450' && c.images.some((img) => img.includes('garbage'))) {
            c.images = ['/src/assets/images/civic_drainage_choke_1792927496927.jpg'];
          }
          if (c.id === 'CCIRS-2026-8439' && c.images.some((img) => img.includes('cityscape'))) {
            c.images = ['/src/assets/images/civic_park_damage_1792927513582.jpg'];
          }
          return c;
        });
        if (!loaded.some((c) => c.id === 'CCIRS-2026-8470')) {
          const resolvedLight = INITIAL_COMPLAINTS.find((c) => c.id === 'CCIRS-2026-8470');
          if (resolvedLight) loaded.splice(3, 0, resolvedLight);
        }
        this.complaints = loaded;
      } else {
        this.complaints = [...INITIAL_COMPLAINTS];
      }

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      this.notifications = storedNotifs ? JSON.parse(storedNotifs) : [...INITIAL_NOTIFICATIONS];

      const storedAuth = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (storedAuth) {
        const parsed: User = JSON.parse(storedAuth);
        if (parsed && parsed.wardNumber) {
          const verified = getGHMCWardByNumber(parsed.wardNumber);
          if (verified) {
            parsed.wardName = verified.wardName;
            parsed.zone = verified.zone;
          }
        }
        this.currentUser = parsed;
      } else {
        this.currentUser = null;
      }
    } catch (e) {
      console.warn('Storage initialization fallback to default Hyderabad seed data', e);
      this.users = [...INITIAL_USERS];
      this.departments = [...INITIAL_DEPARTMENTS];
      this.categories = [...INITIAL_CATEGORIES];
      this.complaints = [...INITIAL_COMPLAINTS];
      this.notifications = [...INITIAL_NOTIFICATIONS];
      this.currentUser = null;
    }
    this.persist();
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(this.departments));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(this.complaints));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
      if (this.currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('Could not persist to localStorage:', e);
    }
    this.notifyListeners();
  }

  // --- Auth & Users ---
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  setCurrentUser(user: User | null): void {
    this.currentUser = user;
    this.persist();
  }

  getUsers(): User[] {
    return [...this.users];
  }

  addUser(user: User): User {
    this.users.unshift(user);
    this.persist();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    if (this.currentUser && this.currentUser.id === id) {
      this.currentUser = { ...this.currentUser, ...updates };
    }
    this.persist();
    return this.users[idx];
  }

  approveOfficer(officerUserId: string, adminUser?: User): User | null {
    const officer = this.users.find((u) => u.id === officerUserId);
    if (!officer || officer.role !== 'officer') return null;

    officer.isApproved = true;
    officer.isActive = true;
    officer.rejectionReason = undefined;

    const approverName = adminUser?.name || this.currentUser?.name || 'GHMC Administrator';

    // Create notification for officer
    this.addNotification({
      userId: officer.id,
      complaintId: '',
      title: 'Municipal Officer Account Approved',
      message: `Your officer credentials (ID: ${officer.officerId || 'Staff'}) have been verified and approved by ${approverName}. You now have full access to your assigned department queue.`,
      type: 'officer_approval',
    });

    this.persist();
    return officer;
  }

  rejectOfficer(officerUserId: string, reasonOrAdmin?: string | User, maybeReason?: string): User | null {
    const officer = this.users.find((u) => u.id === officerUserId);
    if (!officer || officer.role !== 'officer') return null;

    const reason = typeof reasonOrAdmin === 'string' ? reasonOrAdmin : (maybeReason || 'Credentials could not be verified.');
    const adminUser = typeof reasonOrAdmin === 'object' ? reasonOrAdmin : this.currentUser;
    const reviewerName = adminUser?.name || 'GHMC Administrator';

    officer.isApproved = false;
    officer.isActive = false;
    officer.rejectionReason = reason;

    // Create notification for officer
    this.addNotification({
      userId: officer.id,
      complaintId: '',
      title: 'Officer Registration Declined',
      message: `Your officer registration was reviewed by ${reviewerName} and not approved. Reason: ${reason}`,
      type: 'officer_rejection',
    });

    this.persist();
    return officer;
  }

  // --- Departments ---
  getDepartments(): Department[] {
    return this.departments.map((d) => {
      const activeOfficerCount = this.users.filter(
        (u) => u.role === 'officer' && u.departmentId === d.id && u.isActive && u.isApproved !== false
      ).length;
      const totalComplaints = this.complaints.filter((c) => c.departmentId === d.id).length;
      const resolvedComplaints = this.complaints.filter(
        (c) => c.departmentId === d.id && c.status === 'Resolved'
      ).length;
      return {
        ...d,
        activeOfficerCount: activeOfficerCount || d.activeOfficerCount || 1,
        totalComplaints,
        resolvedComplaints,
      };
    });
  }

  addDepartment(dept: Department): Department {
    this.departments.push(dept);
    this.persist();
    return dept;
  }

  updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const idx = this.departments.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    this.departments[idx] = { ...this.departments[idx], ...updates };
    this.persist();
    return this.departments[idx];
  }

  // --- Categories ---
  getCategories(): ComplaintCategory[] {
    return [...this.categories];
  }

  addCategory(cat: ComplaintCategory): ComplaintCategory {
    this.categories.push(cat);
    this.persist();
    return cat;
  }

  updateCategory(id: string, updates: Partial<ComplaintCategory>): ComplaintCategory | null {
    const idx = this.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.categories[idx] = { ...this.categories[idx], ...updates };
    this.persist();
    return this.categories[idx];
  }

  // --- Complaints ---
  getComplaints(): Complaint[] {
    return [...this.complaints];
  }

  getComplaintById(id: string): Complaint | undefined {
    return this.complaints.find((c) => c.id.toLowerCase() === id.trim().toLowerCase());
  }

  createComplaint(params: {
    title: string;
    description: string;
    categoryId: string;
    customCategoryName?: string;
    priority: Complaint['priority'];
    citizen: User;
    location: Complaint['location'];
    images: string[];
    wardNumber?: number;
    wardName?: string;
    zone?: string;
  }): Complaint {
    const category = this.categories.find((c) => c.id === params.categoryId) || this.categories[0];
    const department =
      this.departments.find((d) => d.id === category.defaultDepartmentId) || this.departments[0];

    // Find available department officer for automatic routing
    const deptOfficers = this.users.filter(
      (u) => u.role === 'officer' && u.departmentId === department.id && u.isActive && u.isApproved !== false
    );
    const assignedOfficer = deptOfficers.length > 0 ? deptOfficers[0] : undefined;

    const currentYear = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `CCIRS-${currentYear}-${randomSuffix}`;
    const now = new Date().toISOString();

    const initialHistory: StatusHistoryEntry[] = [
      {
        id: `hist-${Date.now()}-1`,
        complaintId,
        status: 'Submitted',
        changedBy: params.citizen.name,
        changedByRole: params.citizen.role,
        timestamp: now,
        remarks: 'Complaint registered by citizen with GPS coordinates and photographic evidence.',
      },
    ];

    let currentStatus: ComplaintStatus = 'Submitted';
    if (assignedOfficer) {
      currentStatus = 'Assigned';
      initialHistory.push({
        id: `hist-${Date.now()}-2`,
        complaintId,
        status: 'Assigned',
        changedBy: 'System Auto-Router',
        changedByRole: 'admin',
        timestamp: new Date(Date.now() + 2000).toISOString(),
        remarks: `Automatically assigned to ${department.name} under default GHMC routing rules. Assigned to ${assignedOfficer.name} (${assignedOfficer.designation || 'Municipal Officer'}).`,
      });
    }

    // Display title & category formatting for custom 'Other'
    const finalCategoryName =
      category.id === 'cat-other' && params.customCategoryName
        ? `Other: ${params.customCategoryName.trim()}`
        : category.name;

    const newComplaint: Complaint = {
      id: complaintId,
      title: params.title,
      description: params.description,
      categoryId: category.id,
      categoryName: finalCategoryName,
      customCategoryName: params.customCategoryName?.trim(),
      priority: params.priority,
      status: currentStatus,
      citizenId: params.citizen.id,
      citizenName: params.citizen.name,
      citizenPhone: params.citizen.phone,
      citizenEmail: params.citizen.email,
      departmentId: department.id,
      departmentName: department.name,
      assignedOfficerId: assignedOfficer?.id,
      assignedOfficerName: assignedOfficer?.name,
      wardNumber: params.wardNumber,
      wardName: params.wardName,
      zone: params.zone,
      location: params.location,
      images: params.images,
      createdAt: now,
      updatedAt: now,
      statusHistory: initialHistory,
    };

    this.complaints.unshift(newComplaint);

    // Create In-App Notification for Citizen
    this.addNotification({
      userId: params.citizen.id,
      complaintId,
      title: 'Complaint Registered Successfully',
      message: `Your complaint #${complaintId} has been registered and routed to ${department.name}.`,
      type: 'assignment',
    });

    // Create Notification for Officer
    if (assignedOfficer) {
      this.addNotification({
        userId: assignedOfficer.id,
        complaintId,
        title: 'New Complaint Assignment',
        message: `Complaint #${complaintId} (${params.priority} priority) assigned to your department queue.`,
        type: 'assignment',
      });
    }

    this.persist();
    return newComplaint;
  }

  updateComplaintStatus(
    complaintId: string,
    newStatus: ComplaintStatus,
    actor: User,
    remarks: string,
    evidenceImages?: string[],
    workDescription?: string,
    materialsUsed?: string
  ): Complaint | null {
    const complaint = this.complaints.find((c) => c.id === complaintId);
    if (!complaint) return null;

    const now = new Date().toISOString();

    const historyEntry: StatusHistoryEntry = {
      id: `hist-${Date.now()}`,
      complaintId,
      status: newStatus,
      changedBy: actor.name,
      changedByRole: actor.role,
      timestamp: now,
      remarks: remarks || `Status transitioned to ${newStatus}`,
      evidenceImages,
    };

    complaint.status = newStatus;
    complaint.updatedAt = now;
    complaint.statusHistory.push(historyEntry);

    if (newStatus === 'Resolved') {
      complaint.resolvedAt = now;
      complaint.resolutionEvidence = {
        id: `res-${Date.now()}`,
        complaintId,
        resolvedAt: now,
        resolvedByOfficerId: actor.id,
        resolvedByOfficerName: actor.name,
        workDescription: workDescription || remarks || 'Municipal repair work completed.',
        evidenceImages: evidenceImages || [],
        materialsUsed,
      };

      // Notify citizen for feedback
      this.addNotification({
        userId: complaint.citizenId,
        complaintId,
        title: 'Issue Resolved — Feedback Requested',
        message: `Your complaint #${complaint.id} has been resolved by ${complaint.departmentName}. Tap to verify and rate the service!`,
        type: 'resolution',
      });
    } else {
      // General status notification
      this.addNotification({
        userId: complaint.citizenId,
        complaintId,
        title: `Status Update: ${newStatus}`,
        message: `Complaint #${complaint.id} status changed to "${newStatus}" by ${actor.name}.`,
        type: 'status_change',
      });
    }

    this.persist();
    return complaint;
  }

  reassignComplaint(
    complaintId: string,
    newDeptId: string,
    newOfficerId?: string,
    actor?: User
  ): Complaint | null {
    const complaint = this.complaints.find((c) => c.id === complaintId);
    if (!complaint) return null;

    const dept = this.departments.find((d) => d.id === newDeptId);
    if (!dept) return null;

    const officer = newOfficerId ? this.users.find((u) => u.id === newOfficerId) : undefined;
    const now = new Date().toISOString();

    complaint.departmentId = dept.id;
    complaint.departmentName = dept.name;
    complaint.assignedOfficerId = officer?.id;
    complaint.assignedOfficerName = officer?.name;
    complaint.status = 'Assigned';
    complaint.updatedAt = now;

    complaint.statusHistory.push({
      id: `hist-${Date.now()}`,
      complaintId,
      status: 'Assigned',
      changedBy: actor ? actor.name : 'Administrator',
      changedByRole: actor ? actor.role : 'admin',
      timestamp: now,
      remarks: `Reassigned to ${dept.name}${officer ? ` (Assigned Officer: ${officer.name})` : ''} by administrative re-routing.`,
    });

    if (officer) {
      this.addNotification({
        userId: officer.id,
        complaintId,
        title: 'Complaint Reassigned to You',
        message: `Complaint #${complaint.id} has been transferred and assigned to your queue.`,
        type: 'assignment',
      });
    }

    this.persist();
    return complaint;
  }

  submitFeedback(
    complaintId: string,
    rating: number,
    comments: string,
    citizen: User,
    satisfactory: boolean = true
  ): CitizenFeedback | null {
    const complaint = this.complaints.find((c) => c.id === complaintId);
    if (!complaint) return null;

    const feedback: CitizenFeedback = {
      id: `fb-${Date.now()}`,
      complaintId,
      citizenId: citizen.id,
      citizenName: citizen.name,
      rating,
      comments,
      createdAt: new Date().toISOString(),
      resolutionSatisfactory: satisfactory,
    };

    complaint.feedback = feedback;
    complaint.updatedAt = new Date().toISOString();

    // Notify assigned officer of citizen rating
    if (complaint.assignedOfficerId) {
      this.addNotification({
        userId: complaint.assignedOfficerId,
        complaintId,
        title: `Citizen Rated Resolution: ${'★'.repeat(rating)} (${rating}/5)`,
        message: `Citizen ${citizen.name} provided feedback for #${complaint.id}: "${comments.slice(0, 70)}..."`,
        type: 'system',
      });
    }

    this.persist();
    return feedback;
  }

  // --- Notifications ---
  getNotifications(userId: string): CivicNotification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  addNotification(params: {
    userId: string;
    complaintId: string;
    title: string;
    message: string;
    type: CivicNotification['type'];
  }): CivicNotification {
    const notif: CivicNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: params.userId,
      complaintId: params.complaintId,
      title: params.title,
      message: params.message,
      type: params.type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    this.persist();
    return notif;
  }

  markNotificationAsRead(id: string): void {
    const n = this.notifications.find((item) => item.id === id);
    if (n) {
      n.isRead = true;
      this.persist();
    }
  }

  markAllNotificationsAsRead(userId: string): void {
    this.notifications.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
    this.persist();
  }

  // --- Analytics & Statistics ---
  getAnalytics(): AnalyticsSummary {
    const totalComplaints = this.complaints.length;
    const submitted = this.complaints.filter((c) => c.status === 'Submitted').length;
    const assigned = this.complaints.filter((c) => c.status === 'Assigned').length;
    const inProgress = this.complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = this.complaints.filter((c) => c.status === 'Resolved').length;
    const rejected = this.complaints.filter((c) => c.status === 'Rejected').length;

    const resolutionRatePercent =
      totalComplaints > 0 ? Math.round((resolved / (totalComplaints - rejected || 1)) * 100) : 0;

    // Average resolution time in hours
    const resolvedItems = this.complaints.filter((c) => c.status === 'Resolved' && c.resolvedAt);
    let avgHours = 22.4;
    if (resolvedItems.length > 0) {
      const totalHours = resolvedItems.reduce((acc, c) => {
        const diff = new Date(c.resolvedAt!).getTime() - new Date(c.createdAt).getTime();
        return acc + diff / (1000 * 60 * 60);
      }, 0);
      avgHours = Math.round((totalHours / resolvedItems.length) * 10) / 10;
    }

    // Feedback rating calculation
    const feedbacks = this.complaints.filter((c) => c.feedback).map((c) => c.feedback!.rating);
    const avgRating =
      feedbacks.length > 0
        ? Math.round((feedbacks.reduce((a, b) => a + b, 0) / feedbacks.length) * 10) / 10
        : 4.9;

    // Category breakdown
    const byCategory = this.categories.map((cat) => ({
      name: cat.name,
      count: this.complaints.filter(
        (c) => c.categoryId === cat.id || (cat.id === 'cat-other' && c.customCategoryName)
      ).length,
      color: cat.color,
    }));

    // Department breakdown
    const byDepartment = this.departments.map((dept) => {
      const total = this.complaints.filter((c) => c.departmentId === dept.id).length;
      const deptResolved = this.complaints.filter(
        (c) => c.departmentId === dept.id && c.status === 'Resolved'
      ).length;
      return {
        name: dept.name,
        total,
        resolved: deptResolved,
        rate: total > 0 ? Math.round((deptResolved / total) * 100) : 0,
      };
    });

    // Zone breakdown
    const zones = ['Khairatabad', 'Serilingampally', 'Secunderabad', 'Charminar', 'Kukatpally', 'LB Nagar'];
    const byZone = zones.map((z) => ({
      name: z,
      count: this.complaints.filter((c) => c.zone === z || c.location.zone === z).length,
    }));

    // Monthly trends (demo 6 months)
    const monthlyTrend = [
      { month: 'May 2026', submitted: 48, resolved: 44 },
      { month: 'Jun 2026', submitted: 64, resolved: 59 },
      { month: 'Jul 2026', submitted: 92, resolved: 82 },
      { month: 'Aug 2026', submitted: 118, resolved: 104 },
      { month: 'Sep 2026', submitted: 105, resolved: 96 },
      { month: 'Oct 2026', submitted: totalComplaints + 38, resolved: resolved + 34 },
    ];

    return {
      totalComplaints,
      submitted,
      assigned,
      inProgress,
      resolved,
      rejected,
      resolutionRatePercent: Math.min(100, Math.max(0, resolutionRatePercent)),
      averageResolutionHours: avgHours,
      averageRating: avgRating,
      totalFeedbackCount: feedbacks.length,
      byCategory,
      byDepartment,
      byZone,
      monthlyTrend,
    };
  }

  // --- Reset to Initial Seed Data ---
  resetToSeedData(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.DEPARTMENTS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    this.init();
  }

  // --- Generate MySQL DDL Script for Lab Submission (Updated with GHMC fields) ---
  generateMySQLSchemaSQL(): string {
    return `-- ==========================================================
-- CCIRS: Crowdsourced Civic Issue Reporting & Resolution System
-- Database Management System: MySQL 8.0+ / MariaDB 10.5+
-- Greater Hyderabad Municipal Corporation (GHMC) Schema
-- Academic Software Engineering Lab Project Schema - Iteration 1
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS \`ccirs_ghmc_db\` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE \`ccirs_ghmc_db\`;

-- 1. Table structure for \`departments\`
DROP TABLE IF EXISTS \`departments\`;
CREATE TABLE \`departments\` (
  \`department_id\` VARCHAR(36) NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`code\` VARCHAR(20) NOT NULL UNIQUE,
  \`description\` TEXT,
  \`head_name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(120) NOT NULL,
  \`phone\` VARCHAR(25) NOT NULL,
  \`sla_target_hours\` INT NOT NULL DEFAULT 48,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`department_id\`),
  INDEX \`idx_dept_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table structure for \`users\` (Citizens, Municipal Officers, Admins)
DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`user_id\` VARCHAR(36) NOT NULL,
  \`full_name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`phone_number\` VARCHAR(20) NOT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('citizen', 'officer', 'admin') NOT NULL DEFAULT 'citizen',
  \`officer_id\` VARCHAR(50) NULL, -- Official GHMC Employee ID e.g. GHMC-ENG-4921
  \`department_id\` VARCHAR(36) NULL,
  \`designation\` VARCHAR(120) NULL,
  \`ward_number\` INT NULL, -- Assigned GHMC Ward 1 to 150
  \`ward_name\` VARCHAR(100) NULL,
  \`zone\` VARCHAR(50) NULL, -- LB Nagar, Charminar, Khairatabad, etc.
  \`is_approved\` BOOLEAN NOT NULL DEFAULT TRUE, -- Officers require admin verification
  \`rejection_reason\` TEXT NULL,
  \`avatar_url\` VARCHAR(255) NULL,
  \`is_active\` BOOLEAN NOT NULL DEFAULT TRUE,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`user_id\`),
  INDEX \`idx_user_email\` (\`email\`),
  INDEX \`idx_user_role\` (\`role\`),
  INDEX \`idx_officer_id\` (\`officer_id\`),
  CONSTRAINT \`fk_users_department\` FOREIGN KEY (\`department_id\`) 
    REFERENCES \`departments\` (\`department_id\`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table structure for \`complaint_categories\`
DROP TABLE IF EXISTS \`complaint_categories\`;
CREATE TABLE \`complaint_categories\` (
  \`category_id\` VARCHAR(36) NOT NULL,
  \`category_name\` VARCHAR(100) NOT NULL,
  \`description\` TEXT,
  \`default_department_id\` VARCHAR(36) NOT NULL,
  \`sla_hours\` INT NOT NULL DEFAULT 48,
  \`icon_name\` VARCHAR(50) NOT NULL DEFAULT 'AlertCircle',
  \`color_hex\` VARCHAR(10) NOT NULL DEFAULT '#2563EB',
  \`is_custom\` BOOLEAN NOT NULL DEFAULT FALSE,
  \`is_active\` BOOLEAN NOT NULL DEFAULT TRUE,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`category_id\`),
  CONSTRAINT \`fk_categories_default_dept\` FOREIGN KEY (\`default_department_id\`) 
    REFERENCES \`departments\` (\`department_id\`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table structure for \`complaints\`
DROP TABLE IF EXISTS \`complaints\`;
CREATE TABLE \`complaints\` (
  \`complaint_id\` VARCHAR(32) NOT NULL, -- e.g. CCIRS-2026-8491
  \`title\` VARCHAR(255) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`category_id\` VARCHAR(36) NOT NULL,
  \`custom_category_name\` VARCHAR(150) NULL, -- For 'Other' custom categories
  \`priority\` ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL DEFAULT 'Medium',
  \`status\` ENUM('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected') NOT NULL DEFAULT 'Submitted',
  \`citizen_id\` VARCHAR(36) NOT NULL,
  \`department_id\` VARCHAR(36) NOT NULL,
  \`assigned_officer_id\` VARCHAR(36) NULL,
  \`ward_number\` INT NULL, -- GHMC Ward Number 1-150
  \`ward_name\` VARCHAR(100) NULL,
  \`zone\` VARCHAR(50) NULL,
  \`address\` VARCHAR(255) NOT NULL,
  \`latitude\` DECIMAL(10, 8) NOT NULL,
  \`longitude\` DECIMAL(11, 8) NOT NULL,
  \`accuracy_meters\` DECIMAL(6, 2) NULL,
  \`landmark\` VARCHAR(150) NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  \`resolved_at\` TIMESTAMP NULL,
  PRIMARY KEY (\`complaint_id\`),
  INDEX \`idx_complaint_status\` (\`status\`),
  INDEX \`idx_complaint_dept\` (\`department_id\`),
  INDEX \`idx_complaint_officer\` (\`assigned_officer_id\`),
  INDEX \`idx_complaint_ward\` (\`ward_number\`),
  INDEX \`idx_complaint_citizen\` (\`citizen_id\`),
  CONSTRAINT \`fk_complaints_citizen\` FOREIGN KEY (\`citizen_id\`) 
    REFERENCES \`users\` (\`user_id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT \`fk_complaints_dept\` FOREIGN KEY (\`department_id\`) 
    REFERENCES \`departments\` (\`department_id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT \`fk_complaints_officer\` FOREIGN KEY (\`assigned_officer_id\`) 
    REFERENCES \`users\` (\`user_id\`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT \`fk_complaints_category\` FOREIGN KEY (\`category_id\`) 
    REFERENCES \`complaint_categories\` (\`category_id\`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table structure for \`complaint_images\`
DROP TABLE IF EXISTS \`complaint_images\`;
CREATE TABLE \`complaint_images\` (
  \`image_id\` VARCHAR(36) NOT NULL,
  \`complaint_id\` VARCHAR(32) NOT NULL,
  \`image_url\` TEXT NOT NULL,
  \`image_type\` ENUM('complaint_evidence', 'resolution_proof') NOT NULL DEFAULT 'complaint_evidence',
  \`file_size_bytes\` BIGINT NULL,
  \`mime_type\` VARCHAR(50) DEFAULT 'image/jpeg',
  \`uploaded_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`image_id\`),
  INDEX \`idx_image_complaint\` (\`complaint_id\`),
  CONSTRAINT \`fk_images_complaint\` FOREIGN KEY (\`complaint_id\`) 
    REFERENCES \`complaints\` (\`complaint_id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table structure for \`complaint_status_history\`
DROP TABLE IF EXISTS \`complaint_status_history\`;
CREATE TABLE \`complaint_status_history\` (
  \`history_id\` VARCHAR(36) NOT NULL,
  \`complaint_id\` VARCHAR(32) NOT NULL,
  \`status\` ENUM('Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected') NOT NULL,
  \`changed_by_user_id\` VARCHAR(36) NULL,
  \`changed_by_name\` VARCHAR(120) NOT NULL,
  \`changed_by_role\` ENUM('citizen', 'officer', 'admin') NOT NULL,
  \`remarks\` TEXT NOT NULL,
  \`timestamp\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`history_id\`),
  INDEX \`idx_history_complaint\` (\`complaint_id\`),
  CONSTRAINT \`fk_history_complaint\` FOREIGN KEY (\`complaint_id\`) 
    REFERENCES \`complaints\` (\`complaint_id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table structure for \`resolution_evidence\`
DROP TABLE IF EXISTS \`resolution_evidence\`;
CREATE TABLE \`resolution_evidence\` (
  \`evidence_id\` VARCHAR(36) NOT NULL,
  \`complaint_id\` VARCHAR(32) NOT NULL UNIQUE,
  \`resolved_by_officer_id\` VARCHAR(36) NOT NULL,
  \`resolved_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`work_description\` TEXT NOT NULL,
  \`materials_used\` VARCHAR(255) NULL,
  PRIMARY KEY (\`evidence_id\`),
  CONSTRAINT \`fk_evidence_complaint\` FOREIGN KEY (\`complaint_id\`) 
    REFERENCES \`complaints\` (\`complaint_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`fk_evidence_officer\` FOREIGN KEY (\`resolved_by_officer_id\`) 
    REFERENCES \`users\` (\`user_id\`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table structure for \`citizen_feedback\`
DROP TABLE IF EXISTS \`citizen_feedback\`;
CREATE TABLE \`citizen_feedback\` (
  \`feedback_id\` VARCHAR(36) NOT NULL,
  \`complaint_id\` VARCHAR(32) NOT NULL UNIQUE,
  \`citizen_id\` VARCHAR(36) NOT NULL,
  \`rating\` TINYINT NOT NULL CHECK (\`rating\` BETWEEN 1 AND 5),
  \`comments\` TEXT NOT NULL,
  \`is_satisfactory\` BOOLEAN NOT NULL DEFAULT TRUE,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`feedback_id\`),
  CONSTRAINT \`fk_feedback_complaint\` FOREIGN KEY (\`complaint_id\`) 
    REFERENCES \`complaints\` (\`complaint_id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`fk_feedback_citizen\` FOREIGN KEY (\`citizen_id\`) 
    REFERENCES \`users\` (\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table structure for \`notifications\`
DROP TABLE IF EXISTS \`notifications\`;
CREATE TABLE \`notifications\` (
  \`notification_id\` VARCHAR(36) NOT NULL,
  \`user_id\` VARCHAR(36) NOT NULL,
  \`complaint_id\` VARCHAR(32) NOT NULL,
  \`title\` VARCHAR(150) NOT NULL,
  \`message\` TEXT NOT NULL,
  \`type\` ENUM('status_change', 'assignment', 'resolution', 'feedback_request', 'officer_approval', 'officer_rejection', 'system') NOT NULL,
  \`is_read\` BOOLEAN NOT NULL DEFAULT FALSE,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`notification_id\`),
  INDEX \`idx_notif_user\` (\`user_id\`),
  INDEX \`idx_notif_unread\` (\`user_id\`, \`is_read\`),
  CONSTRAINT \`fk_notif_user\` FOREIGN KEY (\`user_id\`) 
    REFERENCES \`users\` (\`user_id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;
  }

  generateMySQLSeedSQL(): string {
    return `-- ==========================================================
-- CCIRS: Seed Data Script for MySQL 8.0+
-- Populates GHMC departments, categories, registered officers, sample complaints in Hyderabad
-- ==========================================================

USE \`ccirs_ghmc_db\`;

-- 1. Insert Departments
INSERT INTO \`departments\` (\`department_id\`, \`name\`, \`code\`, \`description\`, \`head_name\`, \`email\`, \`phone\`, \`sla_target_hours\`) VALUES
('dept-roads', 'Roads & Bridges Department', 'DEP-ROADS', 'Road pavement maintenance and pothole repairs', 'Er. K. Venkataramana', 'ce.roads@ghmc.gov.in', '+91 40 2111 1111', 48),
('dept-sanitation', 'Sanitation & Solid Waste Management', 'DEP-SANI', 'Daily garbage clearance and street hygiene', 'Dr. B. Sudhakar', 'ac.sanitation@ghmc.gov.in', '+91 40 2111 2222', 24),
('dept-water', 'HMWSSB (Water Supply & Sewerage Board)', 'DEP-WATER', 'Water supply pipelines and sewer management', 'Er. M. Praveen Kumar', 'gm.waterworks@hmwssb.gov.in', '+91 40 2343 1000', 36),
('dept-electrical', 'Public Lighting & Electrical Engineering', 'DEP-LIGHT', 'Streetlight maintenance and electric pole safety', 'Er. S. Anand Rao', 'se.electrical@ghmc.gov.in', '+91 40 2111 4444', 24),
('dept-drainage', 'Stormwater Drainage & SNDP Wing', 'DEP-DRAIN', 'Culvert desilting and open stormwater drains', 'Er. C. Vasantha', 'ce.drainage@ghmc.gov.in', '+91 40 2111 5555', 48),
('dept-facilities', 'Urban Forestry, Parks & Civic Facilities', 'DEP-INFRA', 'Parks, gardens, and civic public structures', 'Shri. G. Srinivas', 'director.parks@ghmc.gov.in', '+91 40 2111 6666', 72);

-- 2. Insert Categories
INSERT INTO \`complaint_categories\` (\`category_id\`, \`category_name\`, \`description\`, \`default_department_id\`, \`sla_hours\`, \`icon_name\`, \`color_hex\`, \`is_custom\`, \`is_active\`) VALUES
('cat-roads', 'Roads & Potholes', 'Crumbling asphalt and road craters', 'dept-roads', 48, 'Car', '#2563EB', 0, 1),
('cat-sanitation', 'Garbage & Waste Overflow', 'Overflowing public bins and road-side dumping', 'dept-sanitation', 24, 'Trash2', '#0D9488', 0, 1),
('cat-water', 'Water Supply & Pipeline Leakage', 'Water main bursts and contaminated drinking water', 'dept-water', 36, 'Droplets', '#0284C7', 0, 1),
('cat-lighting', 'Streetlights & Electrical Hazards', 'Dark streets and leaning electric poles', 'dept-electrical', 24, 'Lightbulb', '#D97706', 0, 1),
('cat-drainage', 'Drainage & Sewage Blockage', 'Clogged roadside gutters and overflowing sewage', 'dept-drainage', 48, 'Waves', '#7C3AED', 0, 1),
('cat-facilities', 'Parks & Civic Infrastructure', 'Damaged park equipment and broken walking tracks', 'dept-facilities', 72, 'Trees', '#059669', 0, 1),
('cat-other', 'Other / Different Issue', 'Custom civic problem specified by citizen', 'dept-facilities', 48, 'AlertCircle', '#EA580C', 1, 1);

-- 3. Insert Users
INSERT INTO \`users\` (\`user_id\`, \`full_name\`, \`email\`, \`phone_number\`, \`password_hash\`, \`role\`, \`officer_id\`, \`department_id\`, \`designation\`, \`ward_number\`, \`ward_name\`, \`zone\`, \`is_approved\`, \`is_active\`) VALUES
('user-citizen-1', 'Gayathri Bodanapu', 'bodanigayathri18@gmail.com', '+91 98451 23456', '$2b$12$e8xL4aB2l5.wN40NqO6W.eN93G4xK6u54JqF97B6XzL/Qh.V5C2gO', 'citizen', NULL, NULL, NULL, NULL, NULL, NULL, 1, 1),
('user-citizen-2', 'Arunav Sengupta', 'arunav.citizen@ccirs.gov', '+91 98452 78901', '$2b$12$e8xL4aB2l5.wN40NqO6W.eN93G4xK6u54JqF97B6XzL/Qh.V5C2gO', 'citizen', NULL, NULL, NULL, NULL, NULL, NULL, 1, 1),
('user-officer-roads', 'Er. Rajesh Kumar', 'rajesh.roads@municipal.ccirs.gov', '+91 98453 11223', '$2b$12$e8xL4aB2l5.wN40NqO6W.eN93G4xK6u54JqF97B6XzL/Qh.V5C2gO', 'officer', 'GHMC-ENG-4921', 'dept-roads', 'Executive Engineer (Roads)', 105, 'Banjara Hills', 'Khairatabad', 1, 1),
('user-officer-sanitation', 'Smt. Sunita Verma', 'sunita.sanitation@municipal.ccirs.gov', '+91 98454 44556', '$2b$12$e8xL4aB2l5.wN40NqO6W.eN93G4xK6u54JqF97B6XzL/Qh.V5C2gO', 'officer', 'GHMC-SANI-1042', 'dept-sanitation', 'AMOH (Sanitation)', 113, 'Gachibowli', 'Serilingampally', 1, 1),
('user-officer-water', 'Er. Vikram Patel', 'vikram.water@municipal.ccirs.gov', '+91 98455 77889', '$2b$12$e8xL4aB2l5.wN40NqO6W.eN93G4xK6u54JqF97B6XzL/Qh.V5C2gO', 'officer', 'HMWSSB-OP-8201', 'dept-water', 'General Manager (HMWSSB)', 149, 'Begumpet', 'Secunderabad', 1, 1),
('user-officer-electrical', 'Er. Anil Mehta', 'anil.electrical@municipal.ccirs.gov', '+91 98456 99001', '$2b$12$e8xL4aB2l5.wN40NqO6W.eN93G4xK6u54JqF97B6XzL/Qh.V5C2gO', 'officer', 'GHMC-ELEC-3310', 'dept-electrical', 'Sub-Divisional Inspector', 115, 'Madhapur', 'Serilingampally', 1, 1),
('user-admin', 'Dr. Aruna Sharma, IAS', 'admin@ccirs.gov', '+91 40 2111 0000', '$2b$12$e8xL4aB2l5.wN40NqO6W.eN93G4xK6u54JqF97B6XzL/Qh.V5C2gO', 'admin', NULL, NULL, 'Commissioner & Administrative Director', NULL, NULL, NULL, 1, 1);

-- 4. Insert Complaints
INSERT INTO \`complaints\` (\`complaint_id\`, \`title\`, \`description\`, \`category_id\`, \`priority\`, \`status\`, \`citizen_id\`, \`department_id\`, \`assigned_officer_id\`, \`ward_number\`, \`ward_name\`, \`zone\`, \`address\`, \`latitude\`, \`longitude\`, \`created_at\`, \`resolved_at\`) VALUES
('CCIRS-2026-8491', 'Severe 2-foot asphalt crater and crumbling pavement on Road No 12, Banjara Hills', 'Dangerous pothole formed after recent heavy showers near Taj Krishna junction on Road No 12.', 'cat-roads', 'Critical', 'In Progress', 'user-citizen-1', 'dept-roads', 'user-officer-roads', 105, 'Banjara Hills', 'Khairatabad', 'Road No 12, Near Taj Krishna Junction, Banjara Hills, Ward 105, Hyderabad', 17.41560000, 78.43450000, '2026-10-22 09:15:00', NULL),
('CCIRS-2026-8488', 'Overflowing commercial waste dumper bin and pavement litter near Gachibowli Junction', 'Municipal waste dumper near Gachibowli Outer Ring Road flyover has overflowed onto pedestrian walkway.', 'cat-sanitation', 'High', 'Resolved', 'user-citizen-1', 'dept-sanitation', 'user-officer-sanitation', 113, 'Gachibowli', 'Serilingampally', 'Gachibowli Stadium Road, Commercial Arcade, Ward 113, Hyderabad', 17.44010000, 78.34890000, '2026-10-21 07:45:00', '2026-10-22 11:20:00'),
('CCIRS-2026-8472', 'Bent streetlight pole with exposed wiring near Cyber Towers junction, Madhapur', 'Municipal utility pole tilted dangerously after being hit by a commercial vehicle at night.', 'cat-lighting', 'Critical', 'Assigned', 'user-citizen-2', 'dept-electrical', 'user-officer-electrical', 115, 'Madhapur', 'Serilingampally', 'Near Cyber Towers Junction, Hitec City Road, Madhapur, Ward 115, Hyderabad', 17.44860000, 78.39080000, '2026-10-24 08:10:00', NULL);
`;
  }
}

export const storage = new StorageService();
