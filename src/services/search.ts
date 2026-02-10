import { apiFetch } from './api';
import type { ApiResponse, SearchResponse } from '@/types';

export const searchApi = {
  search(query: string, options?: { type?: string; limit?: number }) {
    const params = new URLSearchParams();
    params.set('q', query);
    if (options?.type) params.set('type', options.type);
    if (options?.limit) params.set('limit', String(options.limit));
    return apiFetch<ApiResponse<SearchResponse>>(`/api/v1/search?${params.toString()}`);
  },
};
