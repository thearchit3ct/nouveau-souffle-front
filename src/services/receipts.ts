import { apiFetch } from './api';
import type { ApiResponse, AnnualReceiptResponse } from '@/types';

export const receiptsApi = {
  getAnnualReceipt(year: number) {
    return apiFetch<ApiResponse<AnnualReceiptResponse>>(`/api/v1/donations/annual/${year}`);
  },

  getAnnualReceiptForUser(year: number, userId: string) {
    return apiFetch<ApiResponse<AnnualReceiptResponse>>(`/api/v1/donations/annual/${year}/user/${userId}`);
  },
};
