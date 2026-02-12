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
    <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Sessions de maraude</h1>
        <Link href="/maraudes/sessions/new" className="bg-green-600 text-white px-4 py-2.5 rounded hover:bg-green-700 text-center text-sm sm:text-base">
          Planifier une maraude
        </Link>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        {['', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-2 rounded text-sm min-h-[44px] ${statusFilter === s ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {s ? statusLabels[s] : 'Toutes'}
          </button>
        ))}
      </div>

      {loading ? <p>Chargement...</p> : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
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

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {maraudes.map(m => (
              <Link key={m.id} href={`/maraudes/sessions/${m.id}`} className="block bg-white rounded-lg shadow p-4 active:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-green-700">{m.title || 'Maraude'}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[m.status]}`}>{statusLabels[m.status]}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {new Date(m.plannedStartAt).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex gap-4 text-xs text-gray-500">
                  {m.zone && <span>Zone: {m.zone.name}</span>}
                  <span>{m._count?.participants ?? 0} pers.</span>
                  <span>{m._count?.encounters ?? 0} renc.</span>
                </div>
              </Link>
            ))}
            {maraudes.length === 0 && (
              <p className="text-center text-gray-500 py-8">Aucune maraude trouvee</p>
            )}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2.5 rounded bg-gray-100 disabled:opacity-50 min-h-[44px]">Precedent</button>
          <span className="px-3 py-2.5">Page {page}/{totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2.5 rounded bg-gray-100 disabled:opacity-50 min-h-[44px]">Suivant</button>
        </div>
      )}
    </div>
  );
}
