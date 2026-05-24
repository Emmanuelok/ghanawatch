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

export type Region =
  | "Greater Accra"
  | "Ashanti"
  | "Central"
  | "Eastern"
  | "Western"
  | "Volta"
  | "Northern"
  | "Bono"
  | "Upper East"
  | "Upper West"
  | "Oti"
  | "Western North"
  | "Bono East"
  | "Ahafo"
  | "Savannah"
  | "North East";

export type Project = {
  id: string;
  name: string;
  sector: Sector;
  location: string;
  region: Region | string;
  lat: number;
  lng: number;
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
  trustHistory: { d: string; v: number }[];
  riskHistory: { d: string; v: number }[];
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
  read?: boolean;
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
  responseHours: number;
  availableNow: boolean;
};

export type ForensicCase = {
  id: string;
  projectId: string;
  title: string;
  status: "open" | "investigating" | "evidence-gathering" | "escalated" | "resolved" | "closed";
  severity: "low" | "med" | "high" | "critical";
  openedAt: string;
  lastUpdated: string;
  lead: string;
  summary: string;
  hypothesis: string;
  evidenceItemIds: string[];
  timeline: { ts: string; actor: string; note: string }[];
  recommendedActions: string[];
  potentialLossGHS: number;
};

export type FraudPattern = {
  id: string;
  name: string;
  sector: Sector | "any";
  region: string;
  prevalence: "rare" | "common" | "endemic";
  signals: string[];
  countermeasures: string[];
  caseExamples: string[];
  refUrl?: string;
};

export type Benchmark = {
  id: string;
  category: "material" | "service" | "labor" | "import-duty" | "medical" | "funeral" | "education";
  item: string;
  unit: string;
  region: string;
  medianGHS: number;
  p10: number;
  p90: number;
  updated: string;
};

export type Notification = {
  id: string;
  kind: "alert" | "verify" | "trustee" | "milestone" | "doc" | "ledger" | "system";
  severity?: "info" | "warning" | "critical";
  title: string;
  body: string;
  ts: string;
  projectId?: string;
  read: boolean;
};
