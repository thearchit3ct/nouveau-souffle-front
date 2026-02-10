'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { encountersApi } from '@/services/encounters';
import { maraudeStatsApi } from '@/services/maraude-stats';
import { beneficiariesApi } from '@/services/beneficiaries';
import type { Beneficiary, NeedCategory, ActionCategory } from '@/types';

export default function QuickEncounterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const maraudeId = searchParams.get('maraudeId') || '';

  const [loading, setLoading] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [needCats, setNeedCats] = useState<NeedCategory[]>([]);
  const [actionCats, setActionCats] = useState<ActionCategory[]>([]);

  const [form, setForm] = useState({
    beneficiaryId: '',
    newBeneficiaryNickname: '',
    needCodes: [] as string[],
    actionCodes: [] as string[],
    notes: '',
  });

  useEffect(() => {
    beneficiariesApi.getAll({ limit: 100 }).then(r => setBeneficiaries(r.data)).catch(() => {});
    maraudeStatsApi.getNeedCategories().then(r => setNeedCats(r.data)).catch(() => {});
    maraudeStatsApi.getActionCategories().then(r => setActionCats(r.data)).catch(() => {});
  }, []);

  const toggleCode = (arr: string[], code: string) =>
    arr.includes(code) ? arr.filter(c => c !== code) : [...arr, code];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maraudeId) { alert('Pas de maraude selectionnee'); return; }
    setLoading(true);
    try {
      await encountersApi.quickCreate({
        maraudeId,
        beneficiaryId: form.beneficiaryId || undefined,
        newBeneficiaryNickname: form.newBeneficiaryNickname || undefined,
        needCodes: form.needCodes.length ? form.needCodes : undefined,
        actionCodes: form.actionCodes.length ? form.actionCodes : undefined,
        notes: form.notes || undefined,
      });
      router.push(`/maraudes/sessions/${maraudeId}`);
    } catch { alert('Erreur'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Quick Log</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Beneficiaire</label>
          <select value={form.beneficiaryId} onChange={e => setForm({ ...form, beneficiaryId: e.target.value })}
            className="w-full border rounded px-3 py-2">
            <option value="">-- Nouveau / Anonyme --</option>
            {beneficiaries.map(b => <option key={b.id} value={b.id}>{b.nickname}</option>)}
          </select>
        </div>
        {!form.beneficiaryId && (
          <div>
            <label className="block text-sm font-medium mb-1">Surnom (nouveau)</label>
            <input type="text" value={form.newBeneficiaryNickname}
              onChange={e => setForm({ ...form, newBeneficiaryNickname: e.target.value })}
              className="w-full border rounded px-3 py-2" placeholder="Laisser vide = anonyme" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Besoins</label>
          <div className="flex flex-wrap gap-2">
            {needCats.map(c => (
              <button key={c.code} type="button"
                onClick={() => setForm({ ...form, needCodes: toggleCode(form.needCodes, c.code) })}
                className={`px-3 py-1.5 rounded text-sm ${form.needCodes.includes(c.code) ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {c.icon && <span className="mr-1">{c.icon}</span>}{c.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Actions realisees</label>
          <div className="flex flex-wrap gap-2">
            {actionCats.map(c => (
              <button key={c.code} type="button"
                onClick={() => setForm({ ...form, actionCodes: toggleCode(form.actionCodes, c.code) })}
                className={`px-3 py-1.5 rounded text-sm ${form.actionCodes.includes(c.code) ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                {c.icon && <span className="mr-1">{c.icon}</span>}{c.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
            className="w-full border rounded px-3 py-2" rows={2} />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded text-lg font-semibold hover:bg-green-700 disabled:opacity-50">
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
}
