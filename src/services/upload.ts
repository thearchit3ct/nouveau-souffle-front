const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  mimeType: string;
}

export const uploadApi = {
  async upload(file: File, folder = 'articles'): Promise<{ data: UploadResult }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${API_BASE_URL}/api/v1/uploads?folder=${encodeURIComponent(folder)}`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      },
    );

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(
        (body as { message?: string })?.message || `Upload failed: ${response.status}`,
      );
    }

    return response.json();
  },
};
