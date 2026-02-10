import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Event,
  EventRegistration,
  CreateEventData,
  UpdateEventData,
} from '@/types';

export const eventsApi = {
  getAll(params?: PaginationParams) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return apiFetch<PaginatedResponse<Event>>(`/api/v1/events${qs ? `?${qs}` : ''}`);
  },

  getOne(id: string) {
    return apiFetch<ApiResponse<Event>>(`/api/v1/events/${id}`);
  },

  register(id: string) {
    return apiFetch<ApiResponse<EventRegistration>>(`/api/v1/events/${id}/register`, {
      method: 'POST',
    });
  },

  cancelRegistration(id: string) {
    return apiFetch<void>(`/api/v1/events/${id}/register`, {
      method: 'DELETE',
    });
  },

  // Admin
  create(data: CreateEventData) {
    return apiFetch<ApiResponse<Event>>('/api/v1/admin/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateEventData) {
    return apiFetch<ApiResponse<Event>>(`/api/v1/admin/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  cancel(id: string) {
    return apiFetch<ApiResponse<Event>>(`/api/v1/admin/events/${id}/cancel`, {
      method: 'POST',
    });
  },

  getRegistrations(id: string, params?: PaginationParams) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return apiFetch<PaginatedResponse<EventRegistration>>(
      `/api/v1/admin/events/${id}/registrations${qs ? `?${qs}` : ''}`
    );
  },

  checkIn(eventId: string, regId: string) {
    return apiFetch<ApiResponse<EventRegistration>>(
      `/api/v1/admin/events/${eventId}/registrations/${regId}/check-in`,
      { method: 'POST' }
    );
  },
};
