// Patient demographic information
export interface Demographics {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other' | 'Unknown';
  phoneNumber?: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
}

// Medical history entry
export interface HistoryEntry {
  id: string;
  date: string;
  type: 'Surgery' | 'Hospitalization' | 'Chronic Condition' | 'Family History' | 'Social History' | 'Other';
  description: string;
  notes?: string;
  provider?: string;
}

// Diagnosis information
export interface Diagnosis {
  id: string;
  icdCode: string;
  description: string;
  diagnosisDate: string;
  status: 'Active' | 'Resolved' | 'Chronic' | 'Suspected';
  severity?: 'Mild' | 'Moderate' | 'Severe';
  notes?: string;
  diagnosingProvider?: string;
}

// Treatment information
export interface Treatment {
  id: string;
  type: 'Medication' | 'Procedure' | 'Therapy' | 'Surgery' | 'Other';
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  dosage?: string;
  frequency?: string;
  status: 'Active' | 'Completed' | 'Discontinued' | 'On Hold';
  prescribingProvider?: string;
  notes?: string;
}

// Lab result
export interface LabResult {
  id: string;
  testName: string;
  testCode?: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  status: 'Normal' | 'Abnormal' | 'Critical' | 'Pending';
  orderDate: string;
  resultDate?: string;
  orderingProvider?: string;
  labFacility?: string;
  notes?: string;
}

// Complete patient information
export interface Patient {
  demographics: Demographics;
  history: HistoryEntry[];
  diagnoses: Diagnosis[];
  treatments: Treatment[];
  labs: LabResult[];
  lastUpdated: string;
}

// Patient search result
export interface PatientSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  lastVisit?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
