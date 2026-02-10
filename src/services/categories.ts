import { apiFetch } from './api';
import type { ApiResponse, Category, CreateCategoryData, UpdateCategoryData } from '@/types';

export const categoriesApi = {
  getAll() {
    return apiFetch<ApiResponse<Category[]>>('/api/v1/categories');
  },

  getBySlug(slug: string) {
    return apiFetch<ApiResponse<Category>>(`/api/v1/categories/${slug}`);
  },

  // Admin endpoints
  create(data: CreateCategoryData) {
    return apiFetch<ApiResponse<Category>>('/api/v1/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateCategoryData) {
    return apiFetch<ApiResponse<Category>>(`/api/v1/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  remove(id: string) {
    return apiFetch<void>(`/api/v1/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
