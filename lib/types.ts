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

// ---- Human verification layer ----

export type IdentityVerification = {
  id: string;
  userId: string;
  status: "unstarted" | "in-review" | "verified" | "rejected" | "expired";
  level: "basic" | "enhanced" | "regulated";
  idType: "ghana-card" | "passport" | "drivers-license" | "voter-id" | "other";
  idNumber?: string;
  fullName: string;
  dob?: string;
  nationality: string;
  selfieMatch?: number; // 0-100
  livenessPass?: boolean;
  phoneVerified?: boolean;
  addressVerified?: boolean;
  amlClear?: boolean;
  pepCheck?: boolean;
  verifiedAt?: string;
  expiresAt?: string;
  reviewer?: string;
};

export type HumanReview = {
  id: string;
  caseId: string;
  projectId: string;
  reviewer: { id: string; name: string; role: string; license: string };
  status: "pending" | "approved" | "rejected" | "escalated" | "more-evidence";
  aiVerdict: string;
  aiConfidence: number;
  analystVerdict?: string;
  analystNote?: string;
  decisionAt?: string;
  slaHours: number;
  evidenceReviewed: number;
  priority: "low" | "med" | "high" | "critical";
};

export type Signatory = {
  id: string;
  name: string;
  role: "diaspora-owner" | "next-of-kin" | "co-investor" | "trustee" | "lawyer" | "witness";
  status: "pending" | "signed" | "declined";
  verifiedIdentity: boolean;
  contact: string;
  signedAt?: string;
};

export type TrusteeApplication = {
  id: string;
  applicant: string;
  profession: string;
  yearsExperience: number;
  region: string;
  licenseAuthority: string;
  licenseNumber: string;
  stage: "submitted" | "license-check" | "background-check" | "skill-test" | "references" | "approved" | "rejected";
  appliedAt: string;
};

// ---- Live activity feed ----

export type LiveEvent = {
  id: string;
  ts: string;
  category: "verify" | "site" | "doc" | "payment" | "trustee" | "case" | "kyc" | "system";
  message: string;
  region?: string;
  amountGHS?: number;
};

// ---- Insurance ----

export type InsuranceQuote = {
  baseRate: number;
  riskMultiplier: number;
  trusteePresenceDiscount: number;
  premiumAnnualGHS: number;
  coverageMaxGHS: number;
  deductibleGHS: number;
};

// ---- Hometown community rooms ----

export type HometownRoom = {
  id: string;
  name: string;
  region: string;
  members: number;
  activeProjects: number;
  pooledGHS: number;
  description: string;
  lastMessage?: { actor: string; text: string; ts: string };
  verified: boolean;
};

// ---- Vendor directory ----

export type Vendor = {
  id: string;
  name: string;
  category: "cement" | "rebar" | "roofing" | "blocks" | "tiles" | "paint" | "plumbing" | "electrical" | "hardware" | "timber" | "aluminum" | "labor" | "transport";
  region: string;
  city: string;
  rating: number;
  reviewCount: number;
  jobsCompleted: number;
  yearsActive: number;
  gra_tin: string;
  momoMerchantId: string;
  licensed: boolean;
  letterheadVerified: boolean;
  bio: string;
  productLines: string[];
  priceBand: "budget" | "mid" | "premium";
  responseHours: number;
  lastVerifiedAt: string;
};

export type Product = {
  id: string;
  vendorId: string;
  name: string;
  unit: string;
  priceGHS: number;
  stockLevel: "high" | "medium" | "low" | "out";
  category: Vendor["category"];
  imageColor: string;
  description: string;
  deliveryDays: number;
  minOrder: number;
};

// ---- Disputes / ADR ----

export type Dispute = {
  id: string;
  projectId: string;
  raisedBy: string;
  raisedAgainst: string;
  amountGHS: number;
  type: "service-quality" | "non-delivery" | "overcharge" | "documentation" | "encroachment" | "title" | "other";
  stage: "raised" | "negotiation" | "mediation" | "arbitration" | "court" | "resolved" | "withdrawn";
  openedAt: string;
  lastUpdated: string;
  summary: string;
  arbitratorAssigned?: string;
  evidenceCount: number;
  hearings: { ts: string; mode: "video" | "in-person" | "written"; notes: string }[];
  resolution?: { ts: string; outcome: "in-favour-claimant" | "in-favour-respondent" | "split" | "withdrawn"; awardGHS?: number; note: string };
};
