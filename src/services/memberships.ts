import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Membership,
  MembershipType,
  CreateMembershipData,
} from '@/types';

export const membershipsApi = {
  getTypes() {
    return apiFetch<ApiResponse<MembershipType[]>>('/api/v1/membership-types');
  },

  getMyMembership() {
    return apiFetch<ApiResponse<Membership>>('/api/v1/memberships/me');
  },

  create(data: CreateMembershipData) {
    return apiFetch<ApiResponse<Membership>>('/api/v1/memberships', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  renew(id: string) {
    return apiFetch<ApiResponse<Membership>>(`/api/v1/memberships/${id}/renew`, {
      method: 'POST',
    });
  },

  // Admin
  getAll(params?: PaginationParams & { status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    const qs = searchParams.toString();
    return apiFetch<PaginatedResponse<Membership>>(`/api/v1/admin/memberships${qs ? `?${qs}` : ''}`);
  },

  getOne(id: string) {
    return apiFetch<ApiResponse<Membership>>(`/api/v1/admin/memberships/${id}`);
  },

  validate(id: string) {
    return apiFetch<ApiResponse<Membership>>(`/api/v1/admin/memberships/${id}/validate`, {
      method: 'POST',
    });
  },

  reject(id: string) {
    return apiFetch<ApiResponse<Membership>>(`/api/v1/admin/memberships/${id}/reject`, {
      method: 'POST',
    });
  },
};
