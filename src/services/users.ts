import { apiFetch } from './api';
import type { ApiResponse, User } from '@/types';

export const usersApi = {
  getMe() {
    return apiFetch<ApiResponse<User>>('/api/v1/users/me');
  },

  updateMe(data: { firstName?: string; lastName?: string; phone?: string; address?: string }) {
    return apiFetch<ApiResponse<User>>('/api/v1/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
