'use client';
import { useState, useEffect } from 'react';
import { referralsApi } from '@/services/referrals';
import type { Referral } from '@/types';

const statusLabels: Record<string, string> = {
  PROPOSED: 'Proposee', ACCEPTED: 'Acceptee', COMPLETED: 'Terminee',
  REFUSED: 'Refusee', NO_SHOW: 'Absent', EXPIRED: 'Expiree',
};
const statusColors: Record<string, string> = {
  PROPOSED: 'bg-yellow-100 text-yellow-800', ACCEPTED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800', REFUSED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-gray-100 text-gray-800', EXPIRED: 'bg-gray-100 text-gray-600',
};

export default function OrientationsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    referralsApi.getAll({ page, limit: 25, status: statusFilter || undefined })
      .then(r => { setReferrals(r.data); setTotalPages(r.meta.totalPages); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [page, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await referralsApi.update(id, { status: newStatus });
      // Reload
      referralsApi.getAll({ page, limit: 25, status: statusFilter || undefined })
        .then(r => { setReferrals(r.data); setTotalPages(r.meta.totalPages); });
    } catch { alert('Erreur'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Orientations</h1>

      <div className="mb-4 flex gap-2 flex-wrap">
        {['', ...Object.keys(statusLabels)].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-2 rounded text-sm min-h-[44px] ${statusFilter === s ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
            {s ? statusLabels[s] : 'Toutes'}
          </button>
        ))}
      </div>

      {loading ? <p>Chargement...</p> : (
        <div className="space-y-2">
          {referrals.map(r => (
            <div key={r.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{r.beneficiary?.nickname || 'Inconnu'} → {r.structure?.name || r.structureName || 'Structure inconnue'}</p>
                  <p className="text-sm text-gray-500">{r.structure?.type} {r.reason && `- ${r.reason}`}</p>
                  {r.appointmentDate && <p className="text-sm text-gray-400">RDV: {new Date(r.appointmentDate).toLocaleDateString('fr-FR')}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded ${statusColors[r.status]}`}>{statusLabels[r.status]}</span>
                  {r.status === 'PROPOSED' && (
                    <select onChange={e => handleStatusChange(r.id, e.target.value)} defaultValue=""
                      className="text-sm border rounded px-2 py-2 min-h-[44px]">
                      <option value="" disabled>Changer</option>
                      <option value="ACCEPTED">Accepter</option>
                      <option value="REFUSED">Refuser</option>
                    </select>
                  )}
                  {r.status === 'ACCEPTED' && (
                    <select onChange={e => handleStatusChange(r.id, e.target.value)} defaultValue=""
                      className="text-sm border rounded px-2 py-2 min-h-[44px]">
                      <option value="" disabled>Changer</option>
                      <option value="COMPLETED">Terminee</option>
                      <option value="NO_SHOW">Absent</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
          {referrals.length === 0 && <p className="text-gray-500">Aucune orientation trouvee</p>}
        </div>
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
