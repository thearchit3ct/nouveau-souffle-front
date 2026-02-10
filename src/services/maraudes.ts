import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Maraude,
  MaraudeZone,
  MaraudeReport,
  CreateMaraudeData,
} from '@/types';

export const maraudesApi = {
  // Sessions
  create(data: CreateMaraudeData) {
    return apiFetch<ApiResponse<Maraude>>('/api/v1/maraudes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll(params?: PaginationParams & { status?: string; zoneId?: string }) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.status) sp.set('status', params.status);
    if (params?.zoneId) sp.set('zoneId', params.zoneId);
    const qs = sp.toString();
    return apiFetch<PaginatedResponse<Maraude>>(`/api/v1/maraudes${qs ? `?${qs}` : ''}`);
  },

  getUpcoming(limit = 10) {
    return apiFetch<ApiResponse<Maraude[]>>(`/api/v1/maraudes/upcoming?limit=${limit}`);
  },

  getOne(id: string) {
    return apiFetch<ApiResponse<Maraude>>(`/api/v1/maraudes/${id}`);
  },

  update(id: string, data: Partial<CreateMaraudeData>) {
    return apiFetch<ApiResponse<Maraude>>(`/api/v1/maraudes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  start(id: string) {
    return apiFetch<ApiResponse<Maraude>>(`/api/v1/maraudes/${id}/start`, { method: 'PATCH' });
  },

  end(id: string) {
    return apiFetch<ApiResponse<Maraude>>(`/api/v1/maraudes/${id}/end`, { method: 'PATCH' });
  },

  join(id: string) {
    return apiFetch<ApiResponse<any>>(`/api/v1/maraudes/${id}/join`, { method: 'POST' });
  },

  leave(id: string) {
    return apiFetch<any>(`/api/v1/maraudes/${id}/leave`, { method: 'DELETE' });
  },

  getEncounters(id: string) {
    return apiFetch<ApiResponse<any[]>>(`/api/v1/maraudes/${id}/encounters`);
  },

  // Report
  createReport(maraudeId: string, data: Partial<MaraudeReport>) {
    return apiFetch<ApiResponse<MaraudeReport>>(`/api/v1/maraudes/${maraudeId}/report`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Zones
  getZones() {
    return apiFetch<ApiResponse<MaraudeZone[]>>('/api/v1/maraude-zones');
  },

  createZone(data: { name: string; description?: string; color?: string; centerLat?: number; centerLng?: number; radiusKm?: number }) {
    return apiFetch<ApiResponse<MaraudeZone>>('/api/v1/maraude-zones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateZone(id: string, data: Partial<MaraudeZone>) {
    return apiFetch<ApiResponse<MaraudeZone>>(`/api/v1/maraude-zones/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteZone(id: string) {
    return apiFetch<any>(`/api/v1/maraude-zones/${id}`, { method: 'DELETE' });
  },
};
