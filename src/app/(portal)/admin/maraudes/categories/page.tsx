'use client';
import { useState, useEffect } from 'react';
import { maraudeStatsApi } from '@/services/maraude-stats';
import type { NeedCategory, ActionCategory } from '@/types';

export default function AdminCategoriesPage() {
  const [needs, setNeeds] = useState<NeedCategory[]>([]);
  const [actions, setActions] = useState<ActionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'needs' | 'actions'>('needs');
  const [form, setForm] = useState({ code: '', name: '', description: '', icon: '', color: '' });
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    Promise.all([
      maraudeStatsApi.getNeedCategories().then(r => setNeeds(r.data)),
      maraudeStatsApi.getActionCategories().then(r => setActions(r.data)),
    ]).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tab === 'needs') await maraudeStatsApi.createNeedCategory(form);
      else await maraudeStatsApi.createActionCategory(form);
      setShowForm(false);
      setForm({ code: '', name: '', description: '', icon: '', color: '' });
      load();
    } catch { alert('Erreur'); }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Referentiels maraude</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('needs')} className={`px-4 py-2 rounded ${tab === 'needs' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Besoins</button>
        <button onClick={() => setTab('actions')} className={`px-4 py-2 rounded ${tab === 'actions' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Actions</button>
        <button onClick={() => setShowForm(!showForm)} className="ml-auto bg-gray-800 text-white px-4 py-2 rounded text-sm">
          {showForm ? 'Annuler' : 'Ajouter'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-2 gap-3">
          <input type="text" required placeholder="Code (FOOD, HEALTH...)" value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })} className="border rounded px-3 py-2" />
          <input type="text" required placeholder="Nom affiche" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} className="border rounded px-3 py-2" />
          <input type="text" placeholder="Description" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} className="border rounded px-3 py-2" />
          <input type="text" placeholder="Icone (emoji)" value={form.icon}
            onChange={e => setForm({ ...form, icon: e.target.value })} className="border rounded px-3 py-2" />
          <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded">Creer</button>
        </form>
      )}

      {loading ? <p>Chargement...</p> : (
        <div className="space-y-2">
          {(tab === 'needs' ? needs : actions).map((c: any) => (
            <div key={c.id} className="bg-white p-3 rounded-lg shadow flex items-center gap-3">
              {c.icon && <span className="text-xl">{c.icon}</span>}
              <div>
                <p className="font-medium">{c.name} <span className="text-xs text-gray-400 ml-1">{c.code}</span></p>
                {c.description && <p className="text-sm text-gray-500">{c.description}</p>}
              </div>
              {c.children?.length > 0 && (
                <span className="text-xs text-gray-400 ml-auto">{c.children.length} sous-categories</span>
              )}
            </div>
          ))}
          {(tab === 'needs' ? needs : actions).length === 0 && <p className="text-gray-500">Aucune categorie</p>}
        </div>
      )}
    </div>
  );
}
