'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Search, Filter, Loader2 } from 'lucide-react';
import { apiFetch } from '@/services/api';

interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  visibility: string;
  category: string;
  tags: string[];
  downloadCount: number;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  GUIDE: 'Guide',
  REPORT: 'Rapport',
  FORM: 'Formulaire',
  MEETING_MINUTES: 'Compte-rendu',
  STATUTES: 'Statuts',
  TRAINING: 'Formation',
  OTHER: 'Autre',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '12');
      if (category) params.set('category', category);
      if (search) params.set('search', search);

      const res = await apiFetch<{ data: DocumentItem[]; meta: { totalPages: number } }>(
        `/api/v1/documents?${params.toString()}`
      );
      setDocuments(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, [page, category]);

  const handleSearch = () => {
    setPage(1);
    fetchDocuments();
  };

  const handleDownload = async (id: string) => {
    try {
      const res = await apiFetch<{ data: { url: string } }>(`/api/v1/documents/${id}/download`);
      window.open(res.data.url, '_blank');
    } catch { /* silently fail */ }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Ressources & Documents</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Retrouvez les documents, guides et ressources de l&apos;association.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Rechercher un document..."
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="">Toutes categories</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Documents grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : documents.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 dark:text-zinc-400">
          Aucun document disponible.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-3 flex items-start justify-between">
                <FileText className="h-8 w-8 text-emerald-600" />
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {CATEGORY_LABELS[doc.category] || doc.category}
                </span>
              </div>
              <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">{doc.title}</h3>
              {doc.description && (
                <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{doc.description}</p>
              )}
              <div className="mb-3 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                <span>{formatFileSize(doc.fileSize)}</span>
                <span>{doc.downloadCount} telechargements</span>
              </div>
              {doc.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {doc.tags.map((tag) => (
                    <span key={tag} className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={() => handleDownload(doc.id)}
                className="flex w-full items-center justify-center gap-1.5 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
              >
                <Download className="h-4 w-4" />
                Telecharger
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-zinc-700"
          >
            Precedent
          </button>
          <span className="text-sm text-zinc-500">Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-zinc-700"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
