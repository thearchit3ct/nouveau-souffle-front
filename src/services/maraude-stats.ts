import { apiFetch } from './api';
import type {
  ApiResponse,
  MaraudeDashboardStats,
} from '@/types';

export const maraudeStatsApi = {
  getDashboard() {
    return apiFetch<ApiResponse<MaraudeDashboardStats>>('/api/v1/maraude-stats/dashboard');
  },

  getActivity(params?: { startDate?: string; endDate?: string }) {
    const sp = new URLSearchParams();
    if (params?.startDate) sp.set('startDate', params.startDate);
    if (params?.endDate) sp.set('endDate', params.endDate);
    const qs = sp.toString();
    return apiFetch<ApiResponse<any>>(`/api/v1/maraude-stats/activity${qs ? `?${qs}` : ''}`);
  },

  getNeeds(params?: { startDate?: string; endDate?: string }) {
    const sp = new URLSearchParams();
    if (params?.startDate) sp.set('startDate', params.startDate);
    if (params?.endDate) sp.set('endDate', params.endDate);
    const qs = sp.toString();
    return apiFetch<ApiResponse<any>>(`/api/v1/maraude-stats/needs${qs ? `?${qs}` : ''}`);
  },

  getTerritory() {
    return apiFetch<ApiResponse<any>>('/api/v1/maraude-stats/territory');
  },

  getExport(params?: { startDate?: string; endDate?: string; format?: string }) {
    const sp = new URLSearchParams();
    if (params?.startDate) sp.set('startDate', params.startDate);
    if (params?.endDate) sp.set('endDate', params.endDate);
    if (params?.format) sp.set('format', params.format);
    const qs = sp.toString();
    return apiFetch<ApiResponse<any>>(`/api/v1/maraude-stats/export${qs ? `?${qs}` : ''}`);
  },

  // Categories
  getNeedCategories() {
    return apiFetch<ApiResponse<any[]>>('/api/v1/need-categories');
  },

  getActionCategories() {
    return apiFetch<ApiResponse<any[]>>('/api/v1/action-categories');
  },

  createNeedCategory(data: { code: string; name: string; description?: string; icon?: string; color?: string; parentId?: string }) {
    return apiFetch<ApiResponse<any>>('/api/v1/need-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createActionCategory(data: { code: string; name: string; description?: string; icon?: string; color?: string }) {
    return apiFetch<ApiResponse<any>>('/api/v1/action-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
