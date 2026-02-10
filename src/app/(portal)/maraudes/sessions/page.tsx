'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { maraudesApi } from '@/services/maraudes';
import type { Maraude } from '@/types';

const statusLabels: Record<string, string> = {
  PLANNED: 'Planifiee',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminee',
  CANCELED: 'Annulee',
};
const statusColors: Record<string, string> = {
  PLANNED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELED: 'bg-red-100 text-red-800',
};

export default function MaraudeSessionsPage() {
  const [maraudes, setMaraudes] = useState<Maraude[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    maraudesApi.getAll({ page, limit: 20, status: statusFilter || undefined })
      .then(res => {
        setMaraudes(res.data);
        setTotalPages(res.meta.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sessions de maraude</h1>
        <Link href="/maraudes/sessions/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Planifier une maraude
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        {['', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1 rounded text-sm ${statusFilter === s ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {s ? statusLabels[s] : 'Toutes'}
          </button>
        ))}
      </div>

      {loading ? <p>Chargement...</p> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Titre</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Zone</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Statut</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Equipe</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Rencontres</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {maraudes.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/maraudes/sessions/${m.id}`} className="text-green-600 hover:underline">
                      {new Date(m.plannedStartAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{m.title || '-'}</td>
                  <td className="px-4 py-3">{m.zone?.name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[m.status]}`}>{statusLabels[m.status]}</span>
                  </td>
                  <td className="px-4 py-3">{m._count?.participants ?? 0}</td>
                  <td className="px-4 py-3">{m._count?.encounters ?? 0}</td>
                </tr>
              ))}
              {maraudes.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Aucune maraude trouvee</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">Precedent</button>
          <span className="px-3 py-1">Page {page}/{totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">Suivant</button>
        </div>
      )}
    </div>
  );
}
