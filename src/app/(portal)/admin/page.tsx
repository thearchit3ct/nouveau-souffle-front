'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, CreditCard, Heart, Calendar, Loader2 } from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { membershipsApi } from '@/services/memberships';
import { donationsApi } from '@/services/donations';
import { eventsApi } from '@/services/events';
import type { Membership, Donation } from '@/types';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);
  const [pendingMemberships, setPendingMemberships] = useState<Membership[]>([]);
  const [monthlyDonations, setMonthlyDonations] = useState(0);
  const [pendingDonations, setPendingDonations] = useState<Donation[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState(0);

  useEffect(() => {
    async function load() {
      const results = await Promise.allSettled([
        membershipsApi.getAll({ limit: 1, status: 'ACTIVE' }),
        membershipsApi.getAll({ limit: 5, status: 'PENDING' }),
        donationsApi.getStats(),
        donationsApi.getAll({ limit: 5, status: 'PENDING' }),
        eventsApi.getAll({ limit: 1 }),
      ]);

      if (results[0].status === 'fulfilled') {
        setTotalMembers(results[0].value.meta.total);
      }
      if (results[1].status === 'fulfilled') {
        setPendingMemberships(results[1].value.data);
      }
      if (results[2].status === 'fulfilled') {
        setMonthlyDonations(results[2].value.data.monthlyAmount);
      }
      if (results[3].status === 'fulfilled') {
        setPendingDonations(results[3].value.data);
      }
      if (results[4].status === 'fulfilled') {
        setUpcomingEvents(results[4].value.meta.total);
      }

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard Admin</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Users}
          label="Membres actifs"
          value={totalMembers}
          color="text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50"
        />
        <StatsCard
          icon={CreditCard}
          label="Adhesions en attente"
          value={pendingMemberships.length}
          color="text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50"
        />
        <StatsCard
          icon={Heart}
          label="Dons ce mois"
          value={`${monthlyDonations}\u20AC`}
          color="text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50"
        />
        <StatsCard
          icon={Calendar}
          label="Evenements"
          value={upcomingEvents}
          color="text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Pending memberships */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Adhesions en attente
            </h2>
            <Link
              href="/admin/memberships"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Tout voir
            </Link>
          </div>
          {pendingMemberships.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Aucune adhesion en attente.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pendingMemberships.map((m) => (
                <li key={m.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {m.user?.firstName} {m.user?.lastName}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      {m.membershipType?.name}
                    </p>
                  </div>
                  <StatusBadge status={m.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pending donations */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Dons en attente
            </h2>
            <Link
              href="/admin/donations"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Tout voir
            </Link>
          </div>
          {pendingDonations.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Aucun don en attente.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pendingDonations.map((d) => (
                <li key={d.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {d.anonymous ? 'Anonyme' : `${d.user?.firstName} ${d.user?.lastName}`}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400">{d.amount}&euro;</p>
                  </div>
                  <StatusBadge status={d.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
