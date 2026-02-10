'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { beneficiariesApi } from '@/services/beneficiaries';
import type { Beneficiary } from '@/types';

const housingLabels: Record<string, string> = {
  STREET: 'Rue', SHELTER: 'Hebergement', SQUAT: 'Squat',
  TEMPORARY: 'Temporaire', HOSTED: 'Heberge', HOUSED: 'Loge', UNKNOWN: 'Inconnu',
};

export default function BeneficiairesPage() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [housingFilter, setHousingFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    beneficiariesApi.getAll({
      page, limit: 25,
      search: search || undefined,
      housingStatus: housingFilter || undefined,
    })
      .then(res => { setBeneficiaries(res.data); setTotalPages(res.meta.totalPages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, housingFilter]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Beneficiaires</h1>
        <Link href="/maraudes/beneficiaires/new" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Nouvelle fiche
        </Link>
      </div>

      <div className="mb-4 flex gap-3 flex-wrap">
        <input type="text" placeholder="Rechercher (surnom, lieu...)" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border rounded px-3 py-2 w-64" />
        <select value={housingFilter} onChange={e => { setHousingFilter(e.target.value); setPage(1); }}
          className="border rounded px-3 py-2">
          <option value="">Tous les statuts</option>
          {Object.entries(housingLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? <p>Chargement...</p> : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Surnom</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Hebergement</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Lieu habituel</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Rencontres</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Consentement</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {beneficiaries.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/maraudes/beneficiaires/${b.id}`} className="text-green-600 hover:underline font-medium">
                      {b.nickname}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{housingLabels[b.housingStatus] || b.housingStatus}</td>
                  <td className="px-4 py-3">{b.usualLocation || '-'}</td>
                  <td className="px-4 py-3">{b._count?.encounters ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${b.gdprConsentStatus === 'GIVEN' || b.gdprConsentStatus === 'ORAL' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {b.gdprConsentStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {beneficiaries.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Aucun beneficiaire trouve</td></tr>
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
