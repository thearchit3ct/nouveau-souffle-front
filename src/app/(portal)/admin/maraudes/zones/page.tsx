'use client';
import { useState, useEffect } from 'react';
import { maraudesApi } from '@/services/maraudes';
import type { MaraudeZone } from '@/types';

export default function AdminZonesPage() {
  const [zones, setZones] = useState<MaraudeZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#22c55e' });

  const load = () => {
    maraudesApi.getZones().then(r => setZones(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await maraudesApi.updateZone(editId, form);
      } else {
        await maraudesApi.createZone(form);
      }
      setShowForm(false);
      setEditId(null);
      setForm({ name: '', description: '', color: '#22c55e' });
      load();
    } catch { alert('Erreur'); }
  };

  const handleEdit = (zone: MaraudeZone) => {
    setForm({ name: zone.name, description: zone.description || '', color: zone.color || '#22c55e' });
    setEditId(zone.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette zone ?')) return;
    try { await maraudesApi.deleteZone(id); load(); } catch { alert('Erreur'); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Zones de maraude</h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', description: '', color: '#22c55e' }); }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {showForm ? 'Annuler' : 'Nouvelle zone'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 space-y-3">
          <div className="flex gap-3">
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Nom de la zone" className="flex-1 border rounded px-3 py-2" />
            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
              className="w-12 h-10 border rounded cursor-pointer" />
          </div>
          <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Description" className="w-full border rounded px-3 py-2" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded text-sm">
            {editId ? 'Modifier' : 'Creer'}
          </button>
        </form>
      )}

      {loading ? <p>Chargement...</p> : (
        <div className="space-y-2">
          {zones.map(z => (
            <div key={z.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: z.color || '#ccc' }} />
                <div>
                  <p className="font-medium">{z.name}</p>
                  {z.description && <p className="text-sm text-gray-500">{z.description}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(z)} className="text-sm text-blue-600 hover:underline">Modifier</button>
                <button onClick={() => handleDelete(z.id)} className="text-sm text-red-600 hover:underline">Supprimer</button>
              </div>
            </div>
          ))}
          {zones.length === 0 && <p className="text-gray-500">Aucune zone definie</p>}
        </div>
      )}
    </div>
  );
}
