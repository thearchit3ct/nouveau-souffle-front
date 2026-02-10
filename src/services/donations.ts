import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Donation,
  DonationStats,
  CreateDonationData,
  CreateDonationIntentData,
  PaymentIntentResponse,
  ReceiptResponse,
} from '@/types';

export const donationsApi = {
  create(data: CreateDonationData) {
    return apiFetch<ApiResponse<Donation>>('/api/v1/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getMyDonations(params?: PaginationParams) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return apiFetch<PaginatedResponse<Donation>>(`/api/v1/donations/me${qs ? `?${qs}` : ''}`);
  },

  // Admin
  getAll(params?: PaginationParams & { status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    const qs = searchParams.toString();
    return apiFetch<PaginatedResponse<Donation>>(`/api/v1/donations${qs ? `?${qs}` : ''}`);
  },

  getStats() {
    return apiFetch<ApiResponse<DonationStats>>('/api/v1/donations/stats');
  },

  validate(id: string) {
    return apiFetch<ApiResponse<Donation>>(`/api/v1/donations/${id}/validate`, {
      method: 'PATCH',
    });
  },

  reject(id: string) {
    return apiFetch<ApiResponse<Donation>>(`/api/v1/donations/${id}/reject`, {
      method: 'PATCH',
    });
  },

  createPaymentIntent(data: CreateDonationIntentData) {
    return apiFetch<ApiResponse<PaymentIntentResponse>>('/api/v1/donations/intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getReceipt(donationId: string) {
    return apiFetch<ApiResponse<ReceiptResponse>>(`/api/v1/donations/${donationId}/receipt`);
  },
};
