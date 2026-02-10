import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Training,
  TrainingEnrollment,
  CreateTrainingData,
  CreateTrainingModuleData,
} from '@/types';

export const trainingsApi = {
  // Public
  getAll(params?: PaginationParams) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    const qs = sp.toString();
    return apiFetch<PaginatedResponse<Training>>(`/api/v1/trainings${qs ? `?${qs}` : ''}`);
  },

  getBySlug(slug: string) {
    return apiFetch<ApiResponse<Training>>(`/api/v1/trainings/${slug}`);
  },

  // Auth
  enroll(trainingId: string) {
    return apiFetch<ApiResponse<TrainingEnrollment>>(`/api/v1/trainings/${trainingId}/enroll`, { method: 'POST' });
  },

  getMyEnrollment(trainingId: string) {
    return apiFetch<ApiResponse<TrainingEnrollment>>(`/api/v1/trainings/${trainingId}/enrollment`);
  },

  getMyEnrollments() {
    return apiFetch<PaginatedResponse<TrainingEnrollment>>('/api/v1/trainings/me');
  },

  completeModule(enrollmentId: string, moduleId: string) {
    return apiFetch<ApiResponse<TrainingEnrollment>>(`/api/v1/trainings/enrollments/${enrollmentId}/modules/${moduleId}/complete`, { method: 'POST' });
  },

  // Admin
  getAllAdmin(params?: PaginationParams & { status?: string }) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.status) sp.set('status', params.status);
    const qs = sp.toString();
    return apiFetch<PaginatedResponse<Training>>(`/api/v1/trainings/admin${qs ? `?${qs}` : ''}`);
  },

  create(data: CreateTrainingData) {
    return apiFetch<ApiResponse<Training>>('/api/v1/trainings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<CreateTrainingData> & { status?: string }) {
    return apiFetch<ApiResponse<Training>>(`/api/v1/trainings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  remove(id: string) {
    return apiFetch<ApiResponse<{ deleted: boolean }>>(`/api/v1/trainings/${id}`, { method: 'DELETE' });
  },

  addModule(trainingId: string, data: CreateTrainingModuleData) {
    return apiFetch<ApiResponse<any>>(`/api/v1/trainings/${trainingId}/modules`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateModule(moduleId: string, data: Partial<CreateTrainingModuleData>) {
    return apiFetch<ApiResponse<any>>(`/api/v1/trainings/modules/${moduleId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  removeModule(moduleId: string) {
    return apiFetch<ApiResponse<{ deleted: boolean }>>(`/api/v1/trainings/modules/${moduleId}`, { method: 'DELETE' });
  },

  getStats() {
    return apiFetch<ApiResponse<{ totalTrainings: number; totalEnrollments: number; completionRate: number }>>('/api/v1/trainings/stats');
  },
};
