import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  DonationRecurrence,
  CreateRecurrenceData,
  CreateRecurrenceResponse,
  RecurrenceStats,
} from '@/types';

export const recurrencesApi = {
  create(data: CreateRecurrenceData) {
    return apiFetch<ApiResponse<CreateRecurrenceResponse>>('/api/v1/recurrences', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyRecurrences() {
    return apiFetch<ApiResponse<DonationRecurrence[]>>('/api/v1/recurrences/me');
  },

  getOne(id: string) {
    return apiFetch<ApiResponse<DonationRecurrence>>(`/api/v1/recurrences/${id}`);
  },

  pause(id: string) {
    return apiFetch<ApiResponse<DonationRecurrence>>(`/api/v1/recurrences/${id}/pause`, {
      method: 'PATCH',
    });
  },

  resume(id: string) {
    return apiFetch<ApiResponse<DonationRecurrence>>(`/api/v1/recurrences/${id}/resume`, {
      method: 'PATCH',
    });
  },

  cancel(id: string) {
    return apiFetch<ApiResponse<DonationRecurrence>>(`/api/v1/recurrences/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  // Admin
  getAll(params?: PaginationParams) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return apiFetch<PaginatedResponse<DonationRecurrence>>(
      `/api/v1/recurrences${qs ? `?${qs}` : ''}`
    );
  },

  getStats() {
    return apiFetch<ApiResponse<RecurrenceStats>>('/api/v1/recurrences/stats');
  },
};
