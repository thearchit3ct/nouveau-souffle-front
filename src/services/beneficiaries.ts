import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Beneficiary,
  CreateBeneficiaryData,
  Encounter,
} from '@/types';

export const beneficiariesApi = {
  create(data: CreateBeneficiaryData) {
    return apiFetch<ApiResponse<Beneficiary>>('/api/v1/beneficiaries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll(params?: PaginationParams & { search?: string; housingStatus?: string; tags?: string }) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.search) sp.set('search', params.search);
    if (params?.housingStatus) sp.set('housingStatus', params.housingStatus);
    if (params?.tags) sp.set('tags', params.tags);
    const qs = sp.toString();
    return apiFetch<PaginatedResponse<Beneficiary>>(`/api/v1/beneficiaries${qs ? `?${qs}` : ''}`);
  },

  getOne(id: string) {
    return apiFetch<ApiResponse<Beneficiary>>(`/api/v1/beneficiaries/${id}`);
  },

  update(id: string, data: Partial<CreateBeneficiaryData>) {
    return apiFetch<ApiResponse<Beneficiary>>(`/api/v1/beneficiaries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  getHistory(id: string, params?: PaginationParams) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    const qs = sp.toString();
    return apiFetch<PaginatedResponse<Encounter>>(`/api/v1/beneficiaries/${id}/history${qs ? `?${qs}` : ''}`);
  },

  findNearby(lat: number, lng: number, radiusKm?: number) {
    const sp = new URLSearchParams({ lat: String(lat), lng: String(lng) });
    if (radiusKm) sp.set('radiusKm', String(radiusKm));
    return apiFetch<ApiResponse<Beneficiary[]>>(`/api/v1/beneficiaries/nearby?${sp.toString()}`);
  },

  anonymize(id: string) {
    return apiFetch<ApiResponse<Beneficiary>>(`/api/v1/beneficiaries/${id}/anonymize`, { method: 'POST' });
  },

  exportData(id: string) {
    return apiFetch<ApiResponse<Beneficiary>>(`/api/v1/beneficiaries/${id}/export`);
  },
};
