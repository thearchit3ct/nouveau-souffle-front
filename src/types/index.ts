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
