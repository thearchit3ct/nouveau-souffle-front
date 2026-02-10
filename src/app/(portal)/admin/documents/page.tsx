'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Plus, Trash2, Download, Search, Loader2, Upload, X } from 'lucide-react';
import { documentsApi } from '@/services/documents';
import type { Document } from '@/types';

const CATEGORY_LABELS: Record<string, string> = {
  GUIDE: 'Guide',
  REPORT: 'Rapport',
  FORM: 'Formulaire',
  MEETING_MINUTES: 'Compte-rendu',
  STATUTES: 'Statuts',
  TRAINING: 'Formation',
  OTHER: 'Autre',
};

const VISIBILITY_LABELS: Record<string, string> = {
  PUBLIC: 'Public',
  MEMBERS: 'Membres',
  ADMIN: 'Admin',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadVisibility, setUploadVisibility] = useState('MEMBERS');
  const [uploadCategory, setUploadCategory] = useState('OTHER');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentsApi.getAll({ page, limit: 20, category: category || undefined, search: search || undefined });
      setDocuments(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, [page, category]);

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) return;
    setUploading(true);
    try {
      const tags = uploadTags.split(',').map(t => t.trim()).filter(Boolean);
      await documentsApi.create(
        { title: uploadTitle, description: uploadDesc || undefined, visibility: uploadVisibility as any, category: uploadCategory as any, tags },
        uploadFile,
      );
      setShowUpload(false);
      resetUploadForm();
      fetchDocuments();
    } catch (err) {
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce document ?')) return;
    try {
      await documentsApi.remove(id);
      fetchDocuments();
    } catch { /* ignore */ }
  };

  const handleDownload = async (id: string) => {
    try {
      const res = await documentsApi.getDownloadUrl(id);
      window.open(res.data.url, '_blank');
    } catch { /* ignore */ }
  };

  const resetUploadForm = () => {
    setUploadTitle('');
    setUploadDesc('');
    setUploadVisibility('MEMBERS');
    setUploadCategory('OTHER');
    setUploadTags('');
    setUploadFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Documents</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter un document
        </button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nouveau document</h2>
              <button onClick={() => { setShowUpload(false); resetUploadForm(); }}>
                <X className="h-5 w-5 text-zinc-400 hover:text-zinc-600" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="Titre *"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              />
              <textarea
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                placeholder="Description (optionnel)"
                rows={2}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={uploadVisibility}
                  onChange={(e) => setUploadVisibility(e.target.value)}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                >
                  {Object.entries(VISIBILITY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                >
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={uploadTags}
                onChange={(e) => setUploadTags(e.target.value)}
                placeholder="Tags (separes par virgules)"
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              />
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
              </div>
              <button
                onClick={handleUpload}
                disabled={uploading || !uploadFile || !uploadTitle.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Uploader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchDocuments(); } }}
            placeholder="Rechercher..."
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">Toutes</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Titre</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Categorie</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Visibilite</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Taille</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">DL</th>
                <th className="px-4 py-3 text-right font-medium text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {documents.map((doc) => (
                <tr key={doc.id} className="bg-white dark:bg-zinc-900">
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{doc.title}</td>
                  <td className="px-4 py-3 text-zinc-500">{CATEGORY_LABELS[doc.category] || doc.category}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      doc.visibility === 'PUBLIC' ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400' :
                      doc.visibility === 'MEMBERS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' :
                      'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {VISIBILITY_LABELS[doc.visibility] || doc.visibility}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{formatFileSize(doc.fileSize)}</td>
                  <td className="px-4 py-3 text-zinc-500">{doc.downloadCount}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleDownload(doc.id)} className="text-emerald-600 hover:text-emerald-700">
                        <Download className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50 dark:border-zinc-700">Precedent</button>
          <span className="text-sm text-zinc-500">Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50 dark:border-zinc-700">Suivant</button>
        </div>
      )}
    </div>
  );
}
