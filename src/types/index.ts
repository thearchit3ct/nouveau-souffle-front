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
export type UserRole = 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN';

// ── User ──

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  role: UserRole;
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

// ── Event ──

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  location: string;
  capacity: number;
  registrationCount: number;
  status: EventStatus;
  imageUrl?: string;
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
  description: string;
  date: string;
  endDate?: string;
  location: string;
  capacity: number;
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
