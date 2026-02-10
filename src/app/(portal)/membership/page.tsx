'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { membershipsApi } from '@/services/memberships';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Membership } from '@/types';
import { ApiError } from '@/services/api';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function MembershipPage() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [renewing, setRenewing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await membershipsApi.getMyMembership();
        setMembership(res.data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setMembership(null);
        } else {
          setError('Impossible de charger votre adhesion.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleRenew() {
    if (!membership) return;
    setRenewing(true);
    setError('');
    try {
      const res = await membershipsApi.renew(membership.id);
      setMembership(res.data);
    } catch {
      setError('Erreur lors du renouvellement.');
    } finally {
      setRenewing(false);
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
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Mon Adhesion</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Gerez votre adhesion a l&apos;association.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      {!membership ? (
        <EmptyState
          icon={CreditCard}
          title="Aucune adhesion"
          description="Vous n'avez pas encore d'adhesion. Rejoignez l'association pour beneficier de tous les avantages."
          actionLabel="Adherer maintenant"
          actionHref="/membership/join"
        />
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {membership.membershipType?.name || 'Adhesion'}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                N&deg; membre : {membership.memberNumber}
              </p>
            </div>
            <StatusBadge status={membership.status} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                Date de debut
              </p>
              <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                {formatDate(membership.startDate)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                Date de fin
              </p>
              <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                {formatDate(membership.endDate)}
              </p>
            </div>
          </div>

          {(membership.status === 'ACTIVE' || membership.status === 'EXPIRED') && (
            <div className="mt-6">
              <button
                onClick={handleRenew}
                disabled={renewing}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {renewing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Renouvellement...
                  </span>
                ) : (
                  'Renouveler'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
