'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { beneficiariesApi } from '@/services/beneficiaries';
import type { Beneficiary, Encounter } from '@/types';

export default function BeneficiaryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [history, setHistory] = useState<Encounter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      beneficiariesApi.getOne(id).then(r => setBeneficiary(r.data)),
      beneficiariesApi.getHistory(id, { limit: 10 }).then(r => setHistory(r.data)),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Chargement...</div>;
  if (!beneficiary) return <div className="p-6">Beneficiaire non trouve</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">{beneficiary.nickname}</h1>
      <p className="text-gray-500 mb-6">Fiche beneficiaire</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Informations</h2>
          <dl className="space-y-2 text-sm">
            {beneficiary.estimatedAge && <div><dt className="text-gray-500 inline">Age estime:</dt> <dd className="inline">{beneficiary.estimatedAge} ans</dd></div>}
            <div><dt className="text-gray-500 inline">Genre:</dt> <dd className="inline">{beneficiary.gender}</dd></div>
            <div><dt className="text-gray-500 inline">Hebergement:</dt> <dd className="inline">{beneficiary.housingStatus}</dd></div>
            <div><dt className="text-gray-500 inline">Situation admin:</dt> <dd className="inline">{beneficiary.administrativeStatus}</dd></div>
            {beneficiary.usualLocation && <div><dt className="text-gray-500 inline">Lieu habituel:</dt> <dd className="inline">{beneficiary.usualLocation}</dd></div>}
            {beneficiary.nationality && <div><dt className="text-gray-500 inline">Nationalite:</dt> <dd className="inline">{beneficiary.nationality}</dd></div>}
            {beneficiary.spokenLanguages.length > 0 && <div><dt className="text-gray-500 inline">Langues:</dt> <dd className="inline">{beneficiary.spokenLanguages.join(', ')}</dd></div>}
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">RGPD & Consentement</h2>
          <dl className="space-y-2 text-sm">
            <div><dt className="text-gray-500 inline">Consentement:</dt> <dd className="inline font-medium">{beneficiary.gdprConsentStatus}</dd></div>
            {beneficiary.gdprConsentDate && <div><dt className="text-gray-500 inline">Date:</dt> <dd className="inline">{new Date(beneficiary.gdprConsentDate).toLocaleDateString('fr-FR')}</dd></div>}
            <div><dt className="text-gray-500 inline">Photo autorisee:</dt> <dd className="inline">{beneficiary.photoConsentGiven ? 'Oui' : 'Non'}</dd></div>
          </dl>
          {beneficiary.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {beneficiary.tags.map(t => <span key={t} className="bg-gray-100 text-xs px-2 py-1 rounded">{t}</span>)}
            </div>
          )}
        </div>
      </div>

      {beneficiary.notes && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="font-semibold mb-2">Notes</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{beneficiary.notes}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-3">Historique des rencontres ({history.length})</h2>
        {history.length > 0 ? (
          <ul className="space-y-3">
            {history.map(e => (
              <li key={e.id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{e.type}</span>
                    {e.maraude && <span className="text-sm text-gray-500 ml-2">{e.maraude.title || 'Maraude'}</span>}
                  </div>
                  <span className="text-sm text-gray-400">{new Date(e.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                {e.notes && <p className="text-sm text-gray-600 mt-1">{e.notes}</p>}
                {e.needs && e.needs.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {e.needs.map(n => <span key={n.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{n.needCategory?.name}</span>)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500 text-sm">Aucune rencontre enregistree</p>}
      </div>
    </div>
  );
}
