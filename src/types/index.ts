export type UserRole = 'citizen' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  departmentId?: string; // For municipal officers
  departmentName?: string;
  designation?: string;
  officerId?: string; // Official municipal employee ID (e.g. "GHMC-ENG-4921")
  wardNumber?: number; // Assigned GHMC ward
  wardName?: string;
  zone?: string;
  isApproved?: boolean; // True for approved officers or citizens; false for pending officer registrations
  rejectionReason?: string;
  avatarUrl?: string;
  createdAt: string;
  isActive: boolean;
}

export type ComplaintStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ComplaintCategory {
  id: string;
  name: string;
  description: string;
  defaultDepartmentId: string;
  defaultDepartmentName: string;
  slaHours: number;
  iconName: string;
  color: string;
  active: boolean;
  isCustom?: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headName: string;
  email: string;
  phone: string;
  slaTargetHours: number;
  activeOfficerCount?: number;
  totalComplaints?: number;
  resolvedComplaints?: number;
}

export interface StatusHistoryEntry {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  changedBy: string;
  changedByRole: UserRole;
  timestamp: string;
  remarks: string;
  evidenceImages?: string[];
}

export interface ResolutionEvidence {
  id: string;
  complaintId: string;
  resolvedAt: string;
  resolvedByOfficerId: string;
  resolvedByOfficerName: string;
  workDescription: string;
  evidenceImages: string[];
  materialsUsed?: string;
}

export interface CitizenFeedback {
  id: string;
  complaintId: string;
  citizenId: string;
  citizenName: string;
  rating: number; // 1 to 5
  comments: string;
  createdAt: string;
  resolutionSatisfactory: boolean;
}

export interface Complaint {
  id: string; // e.g. "CCIRS-2026-1042"
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  customCategoryName?: string; // When category is 'Other'
  priority: ComplaintPriority;
  status: ComplaintStatus;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  departmentId: string;
  departmentName: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  wardNumber?: number;
  wardName?: string;
  zone?: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    accuracyMeters?: number;
    landmark?: string;
    wardNumber?: string | number;
    wardName?: string;
    zone?: string;
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  statusHistory: StatusHistoryEntry[];
  resolutionEvidence?: ResolutionEvidence;
  feedback?: CitizenFeedback;
}

export interface CivicNotification {
  id: string;
  userId: string;
  complaintId: string;
  title: string;
  message: string;
  type: 'status_change' | 'assignment' | 'resolution' | 'feedback_request' | 'officer_approval' | 'officer_rejection' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalComplaints: number;
  submitted: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  resolutionRatePercent: number;
  averageResolutionHours: number;
  averageRating: number;
  totalFeedbackCount: number;
  byCategory: { name: string; count: number; color: string }[];
  byDepartment: { name: string; total: number; resolved: number; rate: number }[];
  byZone?: { name: string; count: number }[];
  monthlyTrend: { month: string; submitted: number; resolved: number }[];
}
