'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { maraudesApi } from '@/services/maraudes';
import type { MaraudeZone } from '@/types';

export default function NewMaraudePage() {
  const router = useRouter();
  const [zones, setZones] = useState<MaraudeZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    zoneId: '',
    plannedStartAt: '',
    plannedEndAt: '',
    startLocationName: '',
    vehicleInfo: '',
  });

  useEffect(() => {
    maraudesApi.getZones().then(res => setZones(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await maraudesApi.create({
        ...form,
        zoneId: form.zoneId || undefined,
        plannedEndAt: form.plannedEndAt || undefined,
      });
      router.push('/maraudes/sessions');
    } catch (err) {
      alert('Erreur lors de la creation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Planifier une maraude</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full border rounded px-3 py-2" placeholder="Ex: Maraude centre-ville" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zone</label>
          <select value={form.zoneId} onChange={e => setForm({ ...form, zoneId: e.target.value })}
            className="w-full border rounded px-3 py-2">
            <option value="">-- Aucune zone --</option>
            {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Debut prevu *</label>
            <input type="datetime-local" required value={form.plannedStartAt}
              onChange={e => setForm({ ...form, plannedStartAt: e.target.value })}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fin prevue</label>
            <input type="datetime-local" value={form.plannedEndAt}
              onChange={e => setForm({ ...form, plannedEndAt: e.target.value })}
              className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lieu de depart</label>
          <input type="text" value={form.startLocationName}
            onChange={e => setForm({ ...form, startLocationName: e.target.value })}
            className="w-full border rounded px-3 py-2" placeholder="Ex: Local associatif, 12 rue..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vehicule</label>
          <input type="text" value={form.vehicleInfo}
            onChange={e => setForm({ ...form, vehicleInfo: e.target.value })}
            className="w-full border rounded px-3 py-2" placeholder="Ex: Fourgon AB-123-CD" />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50">
            {loading ? 'Creation...' : 'Planifier la maraude'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 rounded border hover:bg-gray-50">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
