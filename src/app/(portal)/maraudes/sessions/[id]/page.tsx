'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { maraudesApi } from '@/services/maraudes';
import type { Maraude } from '@/types';

export default function MaraudeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [maraude, setMaraude] = useState<Maraude | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    maraudesApi.getOne(id).then(res => setMaraude(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleAction = async (action: 'start' | 'end' | 'join' | 'leave') => {
    try {
      if (action === 'start') await maraudesApi.start(id);
      else if (action === 'end') await maraudesApi.end(id);
      else if (action === 'join') await maraudesApi.join(id);
      else if (action === 'leave') await maraudesApi.leave(id);
      load();
    } catch { alert('Erreur'); }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (!maraude) return <div className="p-6">Maraude non trouvee</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{maraude.title || 'Maraude'}</h1>
          <p className="text-gray-600">{new Date(maraude.plannedStartAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          {maraude.zone && <p className="text-sm text-gray-500">Zone: {maraude.zone.name}</p>}
        </div>
        <div className="flex gap-2">
          {maraude.status === 'PLANNED' && (
            <>
              <button onClick={() => handleAction('start')} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">Demarrer</button>
              <button onClick={() => handleAction('join')} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Rejoindre</button>
            </>
          )}
          {maraude.status === 'IN_PROGRESS' && (
            <>
              <Link href={`/maraudes/encounter/quick?maraudeId=${id}`} className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600">Quick Log</Link>
              <button onClick={() => handleAction('end')} className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">Terminer</button>
            </>
          )}
        </div>
      </div>

      {maraude.description && <p className="mb-4 text-gray-700">{maraude.description}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Statut</p>
          <p className="text-lg font-semibold">{maraude.status}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Equipe</p>
          <p className="text-lg font-semibold">{maraude.participants?.length || 0} participants</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Rencontres</p>
          <p className="text-lg font-semibold">{maraude.encounters?.length || 0}</p>
        </div>
      </div>

      {/* Participants */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Equipe</h2>
        {maraude.participants && maraude.participants.length > 0 ? (
          <ul className="space-y-2">
            {maraude.participants.map(p => (
              <li key={p.id} className="flex justify-between items-center">
                <span>{p.user ? `${p.user.firstName} ${p.user.lastName}` : p.volunteer ? `${p.volunteer.firstName} ${p.volunteer.lastName}` : 'Inconnu'}</span>
                <span className="text-sm text-gray-500">{p.role}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500">Aucun participant</p>}
      </div>

      {/* Encounters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Rencontres</h2>
          {maraude.status === 'IN_PROGRESS' && (
            <Link href={`/maraudes/encounter/new?maraudeId=${id}`} className="text-sm text-green-600 hover:underline">+ Ajouter</Link>
          )}
        </div>
        {maraude.encounters && maraude.encounters.length > 0 ? (
          <ul className="space-y-2">
            {maraude.encounters.map(e => (
              <li key={e.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <span className="font-medium">{e.beneficiary?.nickname || 'Anonyme'}</span>
                  <span className="text-sm text-gray-500 ml-2">{e.type}</span>
                </div>
                <span className="text-sm text-gray-400">{new Date(e.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-500">Aucune rencontre enregistree</p>}
      </div>

      {/* Report */}
      {maraude.report && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Compte-rendu</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">Rencontres:</span> {maraude.report.totalEncounters}</div>
            <div><span className="text-gray-500">Nouveaux:</span> {maraude.report.newBeneficiaries}</div>
            <div><span className="text-gray-500">Repas:</span> {maraude.report.mealsDistributed}</div>
            <div><span className="text-gray-500">Couvertures:</span> {maraude.report.blanketsDistributed}</div>
          </div>
          {maraude.report.summary && <p className="mt-3 text-gray-700">{maraude.report.summary}</p>}
        </div>
      )}
    </div>
  );
}
