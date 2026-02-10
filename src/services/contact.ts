import { apiFetch } from './api';
import type { ApiResponse } from '@/types';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactApi = {
  submit(data: ContactFormData) {
    return apiFetch<ApiResponse<{ message: string }>>('/api/v1/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
