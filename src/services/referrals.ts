import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Referral,
  ReferralStructure,
  CreateReferralData,
  CreateReferralStructureData,
} from '@/types';

export const referralsApi = {
  create(data: CreateReferralData) {
    return apiFetch<ApiResponse<Referral>>('/api/v1/referrals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll(params?: PaginationParams & { status?: string; beneficiaryId?: string }) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.status) sp.set('status', params.status);
    if (params?.beneficiaryId) sp.set('beneficiaryId', params.beneficiaryId);
    const qs = sp.toString();
    return apiFetch<PaginatedResponse<Referral>>(`/api/v1/referrals${qs ? `?${qs}` : ''}`);
  },

  getPending(params?: PaginationParams) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    const qs = sp.toString();
    return apiFetch<PaginatedResponse<Referral>>(`/api/v1/referrals/pending${qs ? `?${qs}` : ''}`);
  },

  getFollowUp(params?: PaginationParams) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    const qs = sp.toString();
    return apiFetch<PaginatedResponse<Referral>>(`/api/v1/referrals/follow-up${qs ? `?${qs}` : ''}`);
  },

  update(id: string, data: { status?: string; notes?: string; appointmentDate?: string; followUpNotes?: string; followUpDate?: string }) {
    return apiFetch<ApiResponse<Referral>>(`/api/v1/referrals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Structures
  getStructures(params?: PaginationParams & { type?: string; search?: string }) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.type) sp.set('type', params.type);
    if (params?.search) sp.set('search', params.search);
    const qs = sp.toString();
    return apiFetch<PaginatedResponse<ReferralStructure>>(`/api/v1/referral-structures${qs ? `?${qs}` : ''}`);
  },

  getStructuresNearby(lat: number, lng: number, radiusKm?: number) {
    const sp = new URLSearchParams({ lat: String(lat), lng: String(lng) });
    if (radiusKm) sp.set('radiusKm', String(radiusKm));
    return apiFetch<ApiResponse<ReferralStructure[]>>(`/api/v1/referral-structures/nearby?${sp.toString()}`);
  },

  createStructure(data: CreateReferralStructureData) {
    return apiFetch<ApiResponse<ReferralStructure>>('/api/v1/referral-structures', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateStructure(id: string, data: Partial<CreateReferralStructureData>) {
    return apiFetch<ApiResponse<ReferralStructure>>(`/api/v1/referral-structures/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
