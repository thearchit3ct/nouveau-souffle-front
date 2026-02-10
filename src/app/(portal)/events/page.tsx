'use client';

import { useEffect, useState } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { eventsApi } from '@/services/events';
import { EventCard } from '@/components/ui/EventCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Event } from '@/types';

type Filter = 'upcoming' | 'past';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('upcoming');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await eventsApi.getAll({ limit: 50 });
        setEvents(res.data);
      } catch {
        // Show empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const now = new Date();
  const filtered = events.filter((e) => {
    const eventDate = new Date(e.date);
    return filter === 'upcoming' ? eventDate >= now : eventDate < now;
  });

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
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Evenements</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Decouvrez et inscrivez-vous aux evenements de l&apos;association.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
        <button
          onClick={() => setFilter('upcoming')}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            filter === 'upcoming'
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          A venir
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            filter === 'past'
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          Passes
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={filter === 'upcoming' ? 'Aucun evenement a venir' : 'Aucun evenement passe'}
          description={
            filter === 'upcoming'
              ? "Il n'y a pas d'evenement prevu pour le moment."
              : "Aucun evenement passe n'est disponible."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
