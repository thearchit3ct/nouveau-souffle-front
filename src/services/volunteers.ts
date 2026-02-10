import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Volunteer,
  VolunteerAssignment,
  CreateVolunteerData,
} from '@/types';

export const volunteersApi = {
  // Public
  apply(data: CreateVolunteerData) {
    return apiFetch<ApiResponse<Volunteer>>('/api/v1/volunteers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Admin
  getAll(params?: PaginationParams & { status?: string; search?: string }) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.status) sp.set('status', params.status);
    if (params?.search) sp.set('search', params.search);
    const qs = sp.toString();
    return apiFetch<PaginatedResponse<Volunteer>>(`/api/v1/volunteers${qs ? `?${qs}` : ''}`);
  },

  getOne(id: string) {
    return apiFetch<ApiResponse<Volunteer>>(`/api/v1/volunteers/${id}`);
  },

  approve(id: string) {
    return apiFetch<ApiResponse<Volunteer>>(`/api/v1/volunteers/${id}/approve`, { method: 'PATCH' });
  },

  reject(id: string) {
    return apiFetch<ApiResponse<Volunteer>>(`/api/v1/volunteers/${id}/reject`, { method: 'PATCH' });
  },

  pause(id: string) {
    return apiFetch<ApiResponse<Volunteer>>(`/api/v1/volunteers/${id}/pause`, { method: 'PATCH' });
  },

  createAssignment(id: string, data: { eventId?: string; projectId?: string; role?: string; notes?: string }) {
    return apiFetch<ApiResponse<VolunteerAssignment>>(`/api/v1/volunteers/${id}/assignments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAssignments(id: string) {
    return apiFetch<PaginatedResponse<VolunteerAssignment>>(`/api/v1/volunteers/${id}/assignments`);
  },

  completeAssignment(assignmentId: string) {
    return apiFetch<ApiResponse<VolunteerAssignment>>(`/api/v1/volunteers/assignments/${assignmentId}/complete`, {
      method: 'PATCH',
    });
  },

  // Volunteer portal
  getMyProfile() {
    return apiFetch<ApiResponse<Volunteer>>('/api/v1/volunteers/me');
  },
};
