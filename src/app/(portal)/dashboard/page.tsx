'use client';

import { useEffect, useState } from 'react';
import Session from 'supertokens-auth-react/recipe/session';
import { Heart, CreditCard, Calendar, Bell } from 'lucide-react';

interface SessionPayload {
  firstName?: string;
}

const stats = [
  { label: 'Mes dons', value: '0', icon: Heart, color: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50' },
  { label: 'Mon adhesion', value: 'Aucune', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50' },
  { label: 'Prochains evenements', value: '0', icon: Calendar, color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50' },
  { label: 'Notifications', value: '0', icon: Bell, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50' },
];

export default function DashboardPage() {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    async function loadUser() {
      try {
        const payload = await Session.getAccessTokenPayloadSecurely() as SessionPayload;
        if (payload?.firstName) {
          setFirstName(payload.firstName);
        }
      } catch {
        // Session payload may not contain firstName yet
      }
    }
    loadUser();
  }, []);

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

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Cette page est en construction. De nouvelles fonctionnalites seront bientot disponibles.
        </p>
      </div>
    </div>
  );
}
