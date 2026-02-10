import { apiFetch } from './api';
import type { ApiResponse, Project } from '@/types';

export const projectsApi = {
  getAll() {
    return apiFetch<ApiResponse<Project[]>>('/api/v1/projects');
  },

  getOne(id: string) {
    return apiFetch<ApiResponse<Project>>(`/api/v1/projects/${id}`);
  },
};
