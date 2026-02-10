'use client';
import { useState, useEffect } from 'react';
import { referralsApi } from '@/services/referrals';
import type { ReferralStructure } from '@/types';

const structureTypes = ['CHU', 'CHRS', 'LHSS', 'CADA', 'ACCUEIL_JOUR', 'SANTE', 'SOCIAL', 'JURIDIQUE'];

export default function AdminStructuresPage() {
  const [structures, setStructures] = useState<ReferralStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'SANTE', address: '', phone: '', email: '' });

  const load = () => {
    setLoading(true);
    referralsApi.getStructures({ page, limit: 20, type: typeFilter || undefined, search: search || undefined })
      .then(r => { setStructures(r.data); setTotalPages(r.meta.totalPages); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [page, typeFilter, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await referralsApi.createStructure(form);
      setShowForm(false);
      setForm({ name: '', type: 'SANTE', address: '', phone: '', email: '' });
      load();
    } catch { alert('Erreur'); }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Structures partenaires</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {showForm ? 'Annuler' : 'Ajouter'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-2 gap-3">
          <input type="text" required placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded px-3 py-2" />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="border rounded px-3 py-2">
            {structureTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="text" placeholder="Adresse" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="border rounded px-3 py-2" />
          <input type="text" placeholder="Telephone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="border rounded px-3 py-2" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border rounded px-3 py-2" />
          <button type="submit" className="bg-green-600 text-white py-2 rounded">Ajouter</button>
        </form>
      )}

      <div className="mb-4 flex gap-3 flex-wrap">
        <input type="text" placeholder="Rechercher..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} className="border rounded px-3 py-2 w-64" />
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="border rounded px-3 py-2">
          <option value="">Tous types</option>
          {structureTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? <p>Chargement...</p> : (
        <div className="space-y-2">
          {structures.map(s => (
            <div key={s.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.type} {s.address && `- ${s.address}`}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {s.phone && <p>{s.phone}</p>}
                  {s.email && <p>{s.email}</p>}
                </div>
              </div>
            </div>
          ))}
          {structures.length === 0 && <p className="text-gray-500">Aucune structure trouvee</p>}
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
