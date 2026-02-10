'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Session from 'supertokens-auth-react/recipe/session';
import { Heart, CreditCard, Calendar, Bell, ArrowRight, Loader2 } from 'lucide-react';
import { membershipsApi } from '@/services/memberships';
import { donationsApi } from '@/services/donations';
import { eventsApi } from '@/services/events';
import { notificationsApi } from '@/services/notifications';
import type { Membership } from '@/types';
import { ApiError } from '@/services/api';

interface SessionPayload {
  firstName?: string;
  role?: string;
}

export default function DashboardPage() {
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [donationsCount, setDonationsCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const payload = (await Session.getAccessTokenPayloadSecurely()) as SessionPayload;
        if (payload?.firstName) setFirstName(payload.firstName);

        const results = await Promise.allSettled([
          membershipsApi.getMyMembership(),
          donationsApi.getMyDonations({ limit: 1 }),
          eventsApi.getAll({ limit: 1 }),
          notificationsApi.getUnreadCount(),
        ]);

        if (results[0].status === 'fulfilled') {
          setMembership(results[0].value.data);
        }
        if (results[1].status === 'fulfilled') {
          setDonationsCount(results[1].value.meta.total);
        }
        if (results[2].status === 'fulfilled') {
          setEventsCount(results[2].value.meta.total);
        }
        if (results[3].status === 'fulfilled') {
          setNotifCount(results[3].value.data.count);
        }
      } catch {
        // Silently handle errors - dashboard shows defaults
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    {
      label: 'Mes dons',
      value: loading ? '...' : String(donationsCount),
      icon: Heart,
      color: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50',
    },
    {
      label: 'Mon adhesion',
      value: loading ? '...' : membership ? membership.membershipType?.name || 'Active' : 'Aucune',
      icon: CreditCard,
      color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50',
    },
    {
      label: 'Evenements',
      value: loading ? '...' : String(eventsCount),
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50',
    },
    {
      label: 'Notifications',
      value: loading ? '...' : String(notifCount),
      icon: Bell,
      color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50',
    },
  ];

  const quickActions = [
    { label: 'Adherer', href: '/membership/join', show: !membership },
    { label: 'Faire un don', href: '/donations/new', show: true },
    { label: 'Voir les evenements', href: '/events', show: true },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Bienvenue{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Voici un apercu de votre espace membre.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Actions rapides</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {quickActions
            .filter((a) => a.show)
            .map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
              >
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {action.label}
                </span>
                <ArrowRight className="h-4 w-4 text-zinc-400" />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
