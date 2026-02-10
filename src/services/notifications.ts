import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Notification,
} from '@/types';

export const notificationsApi = {
  getAll(params?: PaginationParams) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return apiFetch<PaginatedResponse<Notification>>(`/api/v1/notifications${qs ? `?${qs}` : ''}`);
  },

  getUnreadCount() {
    return apiFetch<ApiResponse<{ count: number }>>('/api/v1/notifications/unread-count');
  },

  markAsRead(id: string) {
    return apiFetch<void>(`/api/v1/notifications/${id}/read`, {
      method: 'POST',
    });
  },

  markAllAsRead() {
    return apiFetch<void>('/api/v1/notifications/read-all', {
      method: 'POST',
    });
  },
};
