'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { membershipsApi } from '@/services/memberships';
import { MembershipCard } from '@/components/ui/MembershipCard';
import type { MembershipType } from '@/types';

export default function JoinPage() {
  const router = useRouter();
  const [types, setTypes] = useState<MembershipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MembershipType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await membershipsApi.getTypes();
        setTypes(res.data.filter((t) => t.active));
      } catch {
        setError('Impossible de charger les types d\'adhesion.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleConfirm() {
    if (!selected) return;
    setSubmitting(true);
    setError('');
    try {
      await membershipsApi.create({ membershipTypeId: selected.id });
      router.push('/membership');
    } catch {
      setError('Erreur lors de la creation de l\'adhesion.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Adherer</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Choisissez votre type d&apos;adhesion pour rejoindre l&apos;association.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((type) => (
          <MembershipCard
            key={type.id}
            type={type}
            selected={selected?.id === type.id}
            onSelect={setSelected}
          />
        ))}
      </div>

      {selected && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Confirmation</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Vous avez choisi <span className="font-medium">{selected.name}</span> pour{' '}
            <span className="font-medium">{selected.price}&euro;</span> ({selected.durationMonths} mois).
          </p>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="mt-4 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Traitement...
              </span>
            ) : (
              'Confirmer l\'adhesion'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
