import { apiFetch } from './api';
import type {
  ApiResponse,
  Encounter,
  CreateEncounterData,
  QuickEncounterData,
} from '@/types';

export const encountersApi = {
  create(data: CreateEncounterData) {
    return apiFetch<ApiResponse<Encounter>>('/api/v1/encounters', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  quickCreate(data: QuickEncounterData) {
    return apiFetch<ApiResponse<Encounter>>('/api/v1/encounters/quick', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getOne(id: string) {
    return apiFetch<ApiResponse<Encounter>>(`/api/v1/encounters/${id}`);
  },

  update(id: string, data: Partial<CreateEncounterData>) {
    return apiFetch<ApiResponse<Encounter>>(`/api/v1/encounters/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  addNeeds(id: string, needCategoryIds: string[]) {
    return apiFetch<ApiResponse<Encounter>>(`/api/v1/encounters/${id}/needs`, {
      method: 'POST',
      body: JSON.stringify({ needCategoryIds }),
    });
  },

  addActions(id: string, actionCategoryIds: string[]) {
    return apiFetch<ApiResponse<Encounter>>(`/api/v1/encounters/${id}/actions`, {
      method: 'POST',
      body: JSON.stringify({ actionCategoryIds }),
    });
  },
};
