'use client';

import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function EventCard({ event }: EventCardProps) {
  const placesLeft = event.capacity - event.registrationsCount;
  const isFull = event.capacity > 0 && placesLeft <= 0;

  return (
    <Link
      href={`/events/${event.id}`}
      className="flex flex-col rounded-xl border border-zinc-200 bg-white transition-all hover:border-emerald-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{event.title}</h3>
          <StatusBadge status={event.status} />
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
          {event.description}
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-4 w-4" />
            {formatDate(event.startDatetime)}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <MapPin className="h-4 w-4" />
            {event.locationName || event.locationAddress || 'En ligne'}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Users className="h-4 w-4" />
            {isFull ? (
              <span className="text-red-600 dark:text-red-400">Complet</span>
            ) : (
              <span>{placesLeft} place{placesLeft > 1 ? 's' : ''} restante{placesLeft > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
