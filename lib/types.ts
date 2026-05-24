export type Sector =
  | "real-estate"
  | "construction"
  | "vehicle-import"
  | "business"
  | "education"
  | "funeral"
  | "medical"
  | "agriculture"
  | "remittance";

export type Risk = "low" | "med" | "high";

export type Project = {
  id: string;
  name: string;
  sector: Sector;
  location: string;
  region: string;
  diasporaOwner: string;
  ownerLocation: string;
  managedBy: string;
  managedByRelation: string;
  budgetGHS: number;
  spentGHS: number;
  startDate: string;
  targetCompletion: string;
  progress: number;
  risk: Risk;
  riskScore: number;
  status: "active" | "paused" | "alert" | "completed";
  trustScore: number;
  verifiedMilestones: number;
  totalMilestones: number;
  alerts: number;
  thumbnail: string;
  summary: string;
};

export type Document = {
  id: string;
  projectId: string;
  name: string;
  type:
    | "receipt"
    | "invoice"
    | "contract"
    | "land-title"
    | "site-plan"
    | "bill-of-quantities"
    | "permit"
    | "id"
    | "bank-statement"
    | "delivery-note";
  uploadedAt: string;
  uploadedBy: string;
  authenticityScore: number;
  flags: string[];
  status: "verified" | "flagged" | "pending" | "rejected";
  amountGHS?: number;
  vendor?: string;
  forensics: {
    metadataIntact: boolean;
    fontConsistency: number;
    compressionAnomalies: number;
    aiGeneratedProbability: number;
    duplicateOfRef?: string;
    crossRefMatched?: boolean;
    pixelTampering: number;
    chainOfCustody: number;
  };
  hash: string;
};

export type SitePhoto = {
  id: string;
  projectId: string;
  takenAt: string;
  uploadedBy: string;
  latitude: number;
  longitude: number;
  expectedLat: number;
  expectedLng: number;
  distanceM: number;
  exifIntact: boolean;
  sceneMatchScore: number;
  progressDetected: string;
  aiAnalysis: string;
  flagged: boolean;
  caption: string;
  hash: string;
};

export type AuditEvent = {
  id: string;
  projectId: string;
  ts: string;
  actor: string;
  action: string;
  category: "doc" | "site" | "payment" | "milestone" | "alert" | "verify" | "trustee" | "system";
  ref?: string;
  prevHash: string;
  hash: string;
  sig: string;
  meta?: Record<string, string | number | boolean>;
};

export type Milestone = {
  id: string;
  projectId: string;
  name: string;
  dueDate: string;
  amountGHS: number;
  status: "pending" | "in-progress" | "verified" | "released" | "disputed";
  evidenceCount: number;
  verifiedBy?: string;
};

export type Alert = {
  id: string;
  projectId: string;
  severity: "info" | "warning" | "critical";
  title: string;
  detail: string;
  ts: string;
  category: string;
};

export type Trustee = {
  id: string;
  name: string;
  profession: string;
  region: string;
  rating: number;
  jobsCompleted: number;
  specialties: string[];
  yearsActive: number;
  licensed: boolean;
  verifiedBy: string;
  feeRange: string;
  avatar: string;
  bio: string;
};
