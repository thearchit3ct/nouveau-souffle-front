import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Project,
  CreateProjectData,
  UpdateProjectData,
} from '@/types';

export const projectsApi = {
  getAll(params?: PaginationParams) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return apiFetch<PaginatedResponse<Project>>(`/api/v1/projects${qs ? `?${qs}` : ''}`);
  },

  getOne(id: string) {
    return apiFetch<ApiResponse<Project>>(`/api/v1/projects/${id}`);
  },

  getBySlug(slug: string) {
    return apiFetch<ApiResponse<Project>>(`/api/v1/projects/${slug}`);
  },

  // Admin endpoints
  create(data: CreateProjectData) {
    return apiFetch<ApiResponse<Project>>('/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: UpdateProjectData) {
    return apiFetch<ApiResponse<Project>>(`/api/v1/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  archive(id: string) {
    return apiFetch<ApiResponse<Project>>(`/api/v1/projects/${id}`, {
      method: 'DELETE',
    });
  },
};
