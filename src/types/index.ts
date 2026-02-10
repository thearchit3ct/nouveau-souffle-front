// ── Generic API types ──

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ── Status enums ──

export type MembershipStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELED' | 'REJECTED';
export type DonationStatus = 'PENDING' | 'COMPLETED' | 'REJECTED' | 'REFUNDED';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELED' | 'COMPLETED';
export type RegistrationStatus = 'REGISTERED' | 'CHECKED_IN' | 'CANCELED';
export type UserRole =
  | 'ANONYMOUS'
  | 'DONOR'
  | 'MEMBER'
  | 'VOLUNTEER'
  | 'COORDINATOR'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'DELETED';

// ── User ──

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  civility?: string;
  birthDate?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  isActive?: boolean;
  status?: UserStatus;
  role: UserRole;
  addressLine1?: string;
  addressLine2?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  memberNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Membership ──

export interface MembershipType {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMonths: number;
  benefits: string[];
  active: boolean;
}

export interface Membership {
  id: string;
  userId: string;
  user?: User;
  membershipTypeId: string;
  membershipType?: MembershipType;
  memberNumber: string;
  status: MembershipStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMembershipData {
  membershipTypeId: string;
}

// ── Donation ──

export interface Donation {
  id: string;
  userId: string;
  user?: User;
  amount: number;
  projectId?: string;
  project?: Project;
  anonymous: boolean;
  status: DonationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDonationData {
  amount: number;
  projectId?: string;
  anonymous?: boolean;
}

export interface CreateDonationIntentData {
  amount: number;
  donorEmail: string;
  donorFirstName: string;
  donorLastName: string;
  projectId?: string;
  isAnonymous?: boolean;
  receiptRequested?: boolean;
  donorAddress?: string;
  donorPostalCode?: string;
  donorCity?: string;
}

export interface PaymentIntentResponse {
  donationId: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface ReceiptResponse {
  receiptUrl: string;
  receiptNumber: string;
  filename: string;
}

export interface DonationStats {
  totalAmount: number;
  totalCount: number;
  monthlyAmount: number;
  monthlyCount: number;
}

// ── Project ──

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  targetAmount?: number;
  collectedAmount?: number;
  goalAmount?: number;
  currentAmount?: number;
  status: string;
  imageUrl?: string;
  isFeatured: boolean;
  startDate?: string;
  endDate?: string;
  active: boolean;
  createdAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  targetAmount?: number;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  isFeatured?: boolean;
}

export type UpdateProjectData = Partial<CreateProjectData> & {
  status?: string;
};

// ── Event ──

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  status: EventStatus;
  visibility: string;
  startDatetime: string;
  endDatetime?: string;
  locationName?: string;
  locationAddress?: string;
  capacity: number;
  registrationsCount: number;
  price?: number;
  isFree: boolean;
  imageUrl?: string;
  program?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  event?: Event;
  userId: string;
  user?: User;
  status: RegistrationStatus;
  checkedInAt?: string;
  createdAt: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  type?: string;
  visibility?: string;
  startDatetime: string;
  endDatetime?: string;
  locationName?: string;
  locationAddress?: string;
  capacity?: number;
  price?: number;
  isFree?: boolean;
  imageUrl?: string;
  program?: string;
}

export type UpdateEventData = Partial<CreateEventData> & {
  status?: EventStatus;
};

// ── Article ──

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  status: ArticleStatus;
  viewCount: number;
  commentsEnabled: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: { firstName: string; lastName: string };
  categories: ArticleCategoryLink[];
}

export interface ArticleCategoryLink {
  category: {
    id: string;
    name: string;
    slug: string;
    color?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  displayOrder: number;
  _count?: { articles: number };
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  displayOrder?: number;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;

export interface CreateArticleData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImageUrl?: string;
  categoryIds?: string[];
  seoMetadata?: object;
  commentsEnabled?: boolean;
}

export type UpdateArticleData = Partial<CreateArticleData>;

// ── Notification ──

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  linkUrl?: string;
  createdAt: string;
}

// ── Search ──

export interface SearchHit {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  excerpt?: string;
  slug?: string;
  [key: string]: any;
}

export interface SearchIndexResult {
  index: string;
  hits: SearchHit[];
  estimatedTotalHits: number;
}

export interface SearchResponse {
  results: SearchIndexResult[];
}

// ── Recurrence ──

export type RecurrenceFrequency = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
export type RecurrenceStatus = 'ACTIVE' | 'PAUSED' | 'CANCELED' | 'EXPIRED';

export interface DonationRecurrence {
  id: string;
  userId: string;
  projectId?: string;
  amount: number;
  frequency: RecurrenceFrequency;
  status: RecurrenceStatus;
  stripeSubscriptionId?: string;
  nextPaymentDate?: string;
  lastPaymentDate?: string;
  paymentCount: number;
  createdAt: string;
  updatedAt: string;
  canceledAt?: string;
  project?: Project;
}

export interface CreateRecurrenceData {
  amount: number;
  frequency: RecurrenceFrequency;
  projectId?: string;
  paymentMethodId: string;
}

export interface CreateRecurrenceResponse {
  recurrence: DonationRecurrence;
  clientSecret: string;
}

export interface RecurrenceStats {
  totalActive: number;
  monthlyRevenue: number;
  averageAmount: number;
}

// ── Volunteer ──

export type VolunteerStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAUSED';

export interface Volunteer {
  id: string;
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  skills: string[];
  availabilities: Record<string, string[]>;
  motivation?: string;
  status: VolunteerStatus;
  coordinatorNotes?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  assignments?: VolunteerAssignment[];
}

export interface VolunteerAssignment {
  id: string;
  volunteerId: string;
  eventId?: string;
  projectId?: string;
  role?: string;
  notes?: string;
  status: string;
  assignedAt: string;
  completedAt?: string;
  event?: Event;
  project?: Project;
}

export interface CreateVolunteerData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  skills: string[];
  availabilities: Record<string, string[]>;
  motivation?: string;
}

// ── Document ──

export type DocumentVisibility = 'PUBLIC' | 'MEMBERS' | 'ADMIN';
export type DocumentCategory = 'GUIDE' | 'REPORT' | 'FORM' | 'MEETING_MINUTES' | 'STATUTES' | 'TRAINING' | 'OTHER';

export interface Document {
  id: string;
  uploadedById: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  filePath: string;
  visibility: DocumentVisibility;
  category: DocumentCategory;
  tags: string[];
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: { firstName: string; lastName: string };
}

export interface CreateDocumentData {
  title: string;
  description?: string;
  visibility?: DocumentVisibility;
  category?: DocumentCategory;
  tags?: string[];
}

// ── Training ──

export type TrainingStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type TrainingModuleType = 'VIDEO' | 'PDF' | 'QUIZ' | 'TEXT';
export type EnrollmentStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface Training {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  status: TrainingStatus;
  duration?: number;
  difficulty: string;
  tags: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  modules?: TrainingModule[];
  _count?: { enrollments: number };
}

export interface TrainingModule {
  id: string;
  trainingId: string;
  title: string;
  type: TrainingModuleType;
  content?: string;
  fileUrl?: string;
  duration?: number;
  sortOrder: number;
  createdAt: string;
}

export interface TrainingEnrollment {
  id: string;
  trainingId: string;
  userId?: string;
  volunteerId?: string;
  status: EnrollmentStatus;
  progress: number;
  startedAt: string;
  completedAt?: string;
  training?: Training;
  completions?: TrainingCompletion[];
}

export interface TrainingCompletion {
  id: string;
  enrollmentId: string;
  moduleId: string;
  completedAt: string;
}

export interface CreateTrainingData {
  title: string;
  description?: string;
  imageUrl?: string;
  duration?: number;
  difficulty?: string;
  tags?: string[];
}

export interface CreateTrainingModuleData {
  title: string;
  type?: TrainingModuleType;
  content?: string;
  fileUrl?: string;
  duration?: number;
  sortOrder?: number;
}

export interface AnnualReceiptResponse {
  receiptUrl: string;
  receiptNumber: string;
  filename: string;
}

// ========== Module Maraude ==========

export type MaraudeStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
export type EncounterType = 'FIRST_CONTACT' | 'FOLLOW_UP' | 'EMERGENCY' | 'CHECK_IN' | 'REFERRAL_ONLY';
export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ReferralStatus = 'PROPOSED' | 'ACCEPTED' | 'COMPLETED' | 'REFUSED' | 'NO_SHOW' | 'EXPIRED';
export type BeneficiaryGender = 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';
export type HousingStatus = 'STREET' | 'SHELTER' | 'SQUAT' | 'TEMPORARY' | 'HOSTED' | 'HOUSED' | 'UNKNOWN';
export type AdministrativeStatus = 'REGULAR' | 'ASYLUM_SEEKER' | 'REFUGEE' | 'UNDOCUMENTED' | 'UNKNOWN' | 'OTHER';
export type GdprConsentStatus = 'GIVEN' | 'ORAL' | 'VITAL' | 'REFUSED' | 'NOT_ASKED' | 'WITHDRAWN';

export interface MaraudeZone {
  id: string;
  name: string;
  description?: string;
  color?: string;
  centerLat?: number;
  centerLng?: number;
  radiusKm?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Maraude {
  id: string;
  zoneId?: string;
  coordinatorId: string;
  title?: string;
  description?: string;
  status: MaraudeStatus;
  plannedStartAt: string;
  plannedEndAt?: string;
  actualStartAt?: string;
  actualEndAt?: string;
  startLocationName?: string;
  startLocationLat?: number;
  startLocationLng?: number;
  weatherConditions?: string;
  temperatureCelsius?: number;
  generalObservations?: string;
  vehicleInfo?: string;
  suppliesDistributed?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  zone?: MaraudeZone;
  coordinator?: { id: string; firstName: string; lastName: string };
  participants?: MaraudeParticipant[];
  encounters?: Encounter[];
  report?: MaraudeReport;
  incidents?: MaraudeIncident[];
  _count?: { participants: number; encounters: number };
}

export interface MaraudeParticipant {
  id: string;
  maraudeId: string;
  userId?: string;
  volunteerId?: string;
  role: string;
  joinedAt: string;
  leftAt?: string;
  user?: { id: string; firstName: string; lastName: string };
  volunteer?: { id: string; firstName: string; lastName: string };
}

export interface Beneficiary {
  id: string;
  nickname: string;
  firstName?: string;
  lastName?: string;
  estimatedAge?: number;
  dateOfBirth?: string;
  gender: BeneficiaryGender;
  nationality?: string;
  spokenLanguages: string[];
  housingStatus: HousingStatus;
  administrativeStatus: AdministrativeStatus;
  hasEmployment?: boolean;
  healthNotes?: string;
  hasPets: boolean;
  petDetails?: string;
  usualLocation?: string;
  usualLocationLat?: number;
  usualLocationLng?: number;
  photoUrl?: string;
  photoConsentGiven: boolean;
  gdprConsentStatus: GdprConsentStatus;
  gdprConsentDate?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  encounters?: Encounter[];
  referrals?: Referral[];
  _count?: { encounters: number };
}

export interface NeedCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  displayOrder: number;
  isActive: boolean;
  children?: NeedCategory[];
}

export interface ActionCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Encounter {
  id: string;
  maraudeId: string;
  beneficiaryId?: string;
  recordedById: string;
  type: EncounterType;
  urgencyLevel: UrgencyLevel;
  locationName?: string;
  locationLat?: number;
  locationLng?: number;
  physicalState?: string;
  mentalState?: string;
  socialContext?: string;
  notes?: string;
  privateNotes?: string;
  itemsDistributed?: Record<string, number>;
  durationMinutes?: number;
  createdAt: string;
  updatedAt: string;
  maraude?: { id: string; title?: string; plannedStartAt: string };
  beneficiary?: { id: string; nickname: string; usualLocation?: string };
  recordedBy?: { id: string; firstName: string; lastName: string };
  needs?: EncounterNeed[];
  actions?: EncounterAction[];
  referrals?: Referral[];
}

export interface EncounterNeed {
  id: string;
  encounterId: string;
  needCategoryId: string;
  priority: number;
  isAddressed: boolean;
  notes?: string;
  needCategory?: NeedCategory;
}

export interface EncounterAction {
  id: string;
  encounterId: string;
  actionCategoryId: string;
  quantity: number;
  notes?: string;
  actionCategory?: ActionCategory;
}

export interface ReferralStructure {
  id: string;
  name: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  capacity?: number;
  admissionCriteria?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Referral {
  id: string;
  encounterId?: string;
  beneficiaryId: string;
  structureId?: string;
  referredById: string;
  structureName?: string;
  reason?: string;
  status: ReferralStatus;
  notes?: string;
  appointmentDate?: string;
  completedAt?: string;
  followUpDate?: string;
  followUpNotes?: string;
  createdAt: string;
  updatedAt: string;
  beneficiary?: { id: string; nickname: string };
  structure?: { id: string; name: string; type: string };
  referredBy?: { id: string; firstName: string; lastName: string };
}

export interface MaraudeReport {
  id: string;
  maraudeId: string;
  authorId: string;
  totalEncounters: number;
  newBeneficiaries: number;
  followUpEncounters: number;
  emergencyEncounters: number;
  referralsMade: number;
  mealsDistributed: number;
  blanketsDistributed: number;
  hygieneKitsDistributed: number;
  otherDistributions?: Record<string, number>;
  summary?: string;
  pointsOfAttention?: string;
  positiveHighlights?: string;
  suggestions?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaraudeIncident {
  id: string;
  maraudeId: string;
  reportedById: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description?: string;
  locationName?: string;
  occurredAt: string;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaraudeDashboardStats {
  totalMaraudes: number;
  activeMaraudes: number;
  maraudesThisMonth: number;
  totalEncounters: number;
  encountersThisMonth: number;
  totalBeneficiaries: number;
  newBeneficiariesThisMonth: number;
  pendingReferrals: number;
  criticalEncounters: number;
}

export interface CreateMaraudeData {
  zoneId?: string;
  title?: string;
  description?: string;
  plannedStartAt: string;
  plannedEndAt?: string;
  startLocationName?: string;
  startLocationLat?: number;
  startLocationLng?: number;
  vehicleInfo?: string;
}

export interface CreateBeneficiaryData {
  nickname: string;
  firstName?: string;
  lastName?: string;
  estimatedAge?: number;
  gender?: BeneficiaryGender;
  housingStatus?: HousingStatus;
  administrativeStatus?: AdministrativeStatus;
  usualLocation?: string;
  usualLocationLat?: number;
  usualLocationLng?: number;
  gdprConsentStatus?: GdprConsentStatus;
  notes?: string;
  tags?: string[];
  spokenLanguages?: string[];
}

export interface CreateEncounterData {
  maraudeId: string;
  beneficiaryId?: string;
  type?: EncounterType;
  urgencyLevel?: UrgencyLevel;
  locationName?: string;
  locationLat?: number;
  locationLng?: number;
  physicalState?: string;
  mentalState?: string;
  socialContext?: string;
  notes?: string;
  privateNotes?: string;
  itemsDistributed?: Record<string, number>;
  durationMinutes?: number;
  needCategoryIds?: string[];
  actionCategoryIds?: string[];
}

export interface QuickEncounterData {
  maraudeId: string;
  beneficiaryId?: string;
  newBeneficiaryNickname?: string;
  locationLat?: number;
  locationLng?: number;
  needCodes?: string[];
  actionCodes?: string[];
  notes?: string;
}

export interface CreateReferralData {
  encounterId?: string;
  beneficiaryId: string;
  structureId?: string;
  structureName?: string;
  reason?: string;
  notes?: string;
  appointmentDate?: string;
}

export interface CreateReferralStructureData {
  name: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  capacity?: number;
  admissionCriteria?: string;
  latitude?: number;
  longitude?: number;
}
