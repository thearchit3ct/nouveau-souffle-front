'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { Project, CreateDonationData } from '@/types';

const PRESET_AMOUNTS = [10, 25, 50, 100];

interface DonationFormProps {
  projects: Project[];
  onSubmit: (data: CreateDonationData) => Promise<void>;
  loading?: boolean;
}

export function DonationForm({ projects, onSubmit, loading = false }: DonationFormProps) {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [projectId, setProjectId] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState('');

  const effectiveAmount = typeof amount === 'number' ? amount : Number(customAmount) || 0;

  function selectPreset(value: number) {
    setAmount(value);
    setCustomAmount('');
  }

  function handleCustomChange(value: string) {
    setCustomAmount(value);
    setAmount('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (effectiveAmount <= 0) {
      setError('Veuillez saisir un montant valide.');
      return;
    }

    try {
      await onSubmit({
        amount: effectiveAmount,
        projectId: projectId || undefined,
        anonymous,
      });
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount presets */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Montant du don
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESET_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => selectPreset(value)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                amount === value
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : 'border-zinc-200 text-zinc-700 hover:border-emerald-300 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-700'
              }`}
            >
              {value}&euro;
            </button>
          ))}
        </div>
        <div className="mt-3">
          <div className="relative">
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Autre montant"
              value={customAmount}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 pr-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">
              &euro;
            </span>
          </div>
        </div>
      </div>

      {/* Project selector */}
      {projects.length > 0 && (
        <div>
          <label
            htmlFor="project"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Projet (optionnel)
          </label>
          <select
            id="project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
          >
            <option value="">Aucun projet specifique</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Anonymous checkbox */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600"
        />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">Don anonyme</span>
      </label>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || effectiveAmount <= 0}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Traitement...
          </span>
        ) : (
          `Faire un don de ${effectiveAmount > 0 ? `${effectiveAmount}\u20AC` : '...'}`
        )}
      </button>
    </form>
  );
}
