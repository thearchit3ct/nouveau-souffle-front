import { apiFetch } from './api';
import type { ApiResponse, Category } from '@/types';

export const categoriesApi = {
  getAll() {
    return apiFetch<ApiResponse<Category[]>>('/api/v1/categories');
  },

  getBySlug(slug: string) {
    return apiFetch<ApiResponse<Category>>(`/api/v1/categories/${slug}`);
  },
};
