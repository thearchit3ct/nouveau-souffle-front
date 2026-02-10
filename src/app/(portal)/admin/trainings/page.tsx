'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { apiFetch } from '@/services/api';

interface TrainingItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  difficulty: string;
  duration?: number;
  tags: string[];
  _count?: { enrollments: number; modules: number };
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Brouillon', color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400' },
  PUBLISHED: { label: 'Publie', color: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400' },
  ARCHIVED: { label: 'Archive', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400' },
};

export default function AdminTrainingsPage() {
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  // Create form
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDifficulty, setFormDifficulty] = useState('beginner');
  const [formDuration, setFormDuration] = useState('');
  const [formTags, setFormTags] = useState('');

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      sp.set('page', String(page));
      sp.set('limit', '20');
      if (statusFilter) sp.set('status', statusFilter);
      const res = await apiFetch<{ data: TrainingItem[]; meta: { totalPages: number } }>(`/api/v1/trainings/admin?${sp.toString()}`);
      setTrainings(res.data);
      setTotalPages(res.meta.totalPages);
    } catch { setTrainings([]); }
    setLoading(false);
  };

  useEffect(() => { fetchTrainings(); }, [page, statusFilter]);

  const handleCreate = async () => {
    if (!formTitle.trim()) return;
    setCreating(true);
    try {
      const tags = formTags.split(',').map(t => t.trim()).filter(Boolean);
      await apiFetch('/api/v1/trainings', {
        method: 'POST',
        body: JSON.stringify({
          title: formTitle,
          description: formDesc || undefined,
          difficulty: formDifficulty,
          duration: formDuration ? parseInt(formDuration) : undefined,
          tags,
        }),
      });
      setShowCreate(false);
      setFormTitle(''); setFormDesc(''); setFormDifficulty('beginner'); setFormDuration(''); setFormTags('');
      fetchTrainings();
    } catch { alert('Erreur lors de la creation'); }
    setCreating(false);
  };

  const handlePublish = async (id: string) => {
    try {
      await apiFetch(`/api/v1/trainings/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'PUBLISHED' }) });
      fetchTrainings();
    } catch { /* ignore */ }
  };

  const handleArchive = async (id: string) => {
    try {
      await apiFetch(`/api/v1/trainings/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'ARCHIVED' }) });
      fetchTrainings();
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette formation ?')) return;
    try {
      await apiFetch(`/api/v1/trainings/${id}`, { method: 'DELETE' });
      fetchTrainings();
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Formations</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Nouvelle formation
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nouvelle formation</h2>
              <button onClick={() => setShowCreate(false)}>
                <X className="h-5 w-5 text-zinc-400 hover:text-zinc-600" />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Titre *" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
              <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Description" rows={3} className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
              <div className="grid grid-cols-2 gap-3">
                <select value={formDifficulty} onChange={e => setFormDifficulty(e.target.value)} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
                  <option value="beginner">Debutant</option>
                  <option value="intermediate">Intermediaire</option>
                  <option value="advanced">Avance</option>
                </select>
                <input type="number" value={formDuration} onChange={e => setFormDuration(e.target.value)} placeholder="Duree (min)" className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
              </div>
              <input type="text" value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="Tags (virgules)" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800" />
              <button onClick={handleCreate} disabled={creating || !formTitle.trim()} className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Creer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
        <option value="">Tous les statuts</option>
        <option value="DRAFT">Brouillon</option>
        <option value="PUBLISHED">Publie</option>
        <option value="ARCHIVED">Archive</option>
      </select>

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
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Statut</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Difficulte</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Inscrits</th>
                <th className="px-4 py-3 text-right font-medium text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {trainings.map(t => {
                const st = STATUS_LABELS[t.status] || STATUS_LABELS.DRAFT;
                return (
                  <tr key={t.id} className="bg-white dark:bg-zinc-900">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{t.title}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.color}`}>{st.label}</span></td>
                    <td className="px-4 py-3 text-zinc-500">{t.difficulty}</td>
                    <td className="px-4 py-3 text-zinc-500">{t._count?.enrollments ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {t.status === 'DRAFT' && (
                          <button onClick={() => handlePublish(t.id)} title="Publier" className="text-green-600 hover:text-green-700">
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {t.status === 'PUBLISHED' && (
                          <button onClick={() => handleArchive(t.id)} title="Archiver" className="text-yellow-600 hover:text-yellow-700">
                            <EyeOff className="h-4 w-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
