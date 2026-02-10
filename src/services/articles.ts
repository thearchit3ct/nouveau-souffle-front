import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  Article,
  CreateArticleData,
  UpdateArticleData,
} from '@/types';

interface ArticleQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  status?: string;
}

export const articlesApi = {
  getAll(params?: ArticleQueryParams) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    const qs = searchParams.toString();
    return apiFetch<PaginatedResponse<Article>>(`/api/v1/articles${qs ? `?${qs}` : ''}`);
  },

  getBySlug(slug: string) {
    return apiFetch<ApiResponse<Article>>(`/api/v1/articles/${slug}`);
  },

  // Admin endpoints
  getAllAdmin(params?: ArticleQueryParams) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    const qs = searchParams.toString();
    return apiFetch<PaginatedResponse<Article>>(`/api/v1/articles/admin${qs ? `?${qs}` : ''}`);
  },

  create(data: CreateArticleData) {
    return apiFetch<ApiResponse<Article>>('/api/v1/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateArticleData) {
    return apiFetch<ApiResponse<Article>>(`/api/v1/articles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  publish(id: string) {
    return apiFetch<ApiResponse<Article>>(`/api/v1/articles/${id}/publish`, {
      method: 'PATCH',
    });
  },

  archive(id: string) {
    return apiFetch<ApiResponse<Article>>(`/api/v1/articles/${id}/archive`, {
      method: 'PATCH',
    });
  },

  remove(id: string) {
    return apiFetch<void>(`/api/v1/articles/${id}`, {
      method: 'DELETE',
    });
  },
};
