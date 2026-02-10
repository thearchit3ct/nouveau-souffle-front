import { apiFetch } from './api';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Document,
  CreateDocumentData,
} from '@/types';

export const documentsApi = {
  // Public / Members
  getAll(params?: PaginationParams & { category?: string; search?: string }) {
    const sp = new URLSearchParams();
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.category) sp.set('category', params.category);
    if (params?.search) sp.set('search', params.search);
    const qs = sp.toString();
    return apiFetch<PaginatedResponse<Document>>(`/api/v1/documents${qs ? `?${qs}` : ''}`);
  },

  getOne(id: string) {
    return apiFetch<ApiResponse<Document>>(`/api/v1/documents/${id}`);
  },

  getDownloadUrl(id: string) {
    return apiFetch<ApiResponse<{ url: string; expiresIn: number }>>(`/api/v1/documents/${id}/download`);
  },

  // Admin
  create(data: CreateDocumentData, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.visibility) formData.append('visibility', data.visibility);
    if (data.category) formData.append('category', data.category);
    if (data.tags) data.tags.forEach(t => formData.append('tags', t));

    return apiFetch<ApiResponse<Document>>('/api/v1/documents', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set multipart boundary
    });
  },

  update(id: string, data: Partial<CreateDocumentData>) {
    return apiFetch<ApiResponse<Document>>(`/api/v1/documents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  remove(id: string) {
    return apiFetch<ApiResponse<{ deleted: boolean }>>(`/api/v1/documents/${id}`, {
      method: 'DELETE',
    });
  },
};
