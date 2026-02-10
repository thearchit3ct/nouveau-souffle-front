import { apiFetch } from './api';
import type { ApiResponse, PaginatedResponse, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface UsersListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  civility?: string;
  addressLine1?: string;
  addressLine2?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  birthDate?: string;
}

export const usersApi = {
  getMe() {
    return apiFetch<ApiResponse<User>>('/api/v1/users/me');
  },

  updateMe(data: UpdateProfileData) {
    return apiFetch<ApiResponse<User>>('/api/v1/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async uploadAvatar(file: File): Promise<ApiResponse<User>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/users/me/avatar`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(
        (body as { message?: string })?.message || `Upload failed: ${response.status}`,
      );
    }

    return response.json();
  },

  getAll(params: UsersListParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.role) searchParams.set('role', params.role);
    if (params.status) searchParams.set('status', params.status);

    const qs = searchParams.toString();
    return apiFetch<PaginatedResponse<User>>(`/api/v1/users${qs ? `?${qs}` : ''}`);
  },

  getById(id: string) {
    return apiFetch<ApiResponse<User>>(`/api/v1/users/${id}`);
  },

  updateRole(id: string, role: string) {
    return apiFetch<ApiResponse<User>>(`/api/v1/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  updateStatus(id: string, status: string) {
    return apiFetch<ApiResponse<User>>(`/api/v1/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
