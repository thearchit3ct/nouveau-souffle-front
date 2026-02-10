'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { eventsApi } from '@/services/events';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Event as EventType } from '@/types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await eventsApi.getOne(id);
        setEvent(res.data);
      } catch {
        setError('Impossible de charger l\'evenement.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleRegister() {
    setRegistering(true);
    setError('');
    try {
      await eventsApi.register(id);
      setRegistered(true);
      if (event) {
        setEvent({ ...event, registrationsCount: event.registrationsCount + 1 });
      }
    } catch {
      setError('Erreur lors de l\'inscription.');
    } finally {
      setRegistering(false);
    }
  }

  async function handleUnregister() {
    setRegistering(true);
    setError('');
    try {
      await eventsApi.cancelRegistration(id);
      setRegistered(false);
      if (event) {
        setEvent({ ...event, registrationsCount: Math.max(0, event.registrationsCount - 1) });
      }
    } catch {
      setError('Erreur lors de la desinscription.');
    } finally {
      setRegistering(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {error || 'Evenement introuvable.'}
        </p>
        <button
          onClick={() => router.push('/events')}
          className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          Retour aux evenements
        </button>
      </div>
    );
  }

  const placesLeft = event.capacity - event.registrationsCount;
  const isFull = placesLeft <= 0;

  return (
    <div>
      <button
        onClick={() => router.push('/events')}
        className="mb-6 flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux evenements
      </button>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{event.title}</h1>
          <StatusBadge status={event.status} />
        </div>

        <p className="mt-4 text-zinc-600 dark:text-zinc-400">{event.description}</p>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-5 w-5 text-zinc-400" />
            <div>
              <p>{formatDate(event.startDatetime)}</p>
              {event.endDatetime && (
                <p className="text-zinc-500">Fin : {formatDate(event.endDatetime)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <MapPin className="h-5 w-5 text-zinc-400" />
            {event.locationName || event.locationAddress || 'En ligne'}
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <Users className="h-5 w-5 text-zinc-400" />
            {event.registrationsCount} / {event.capacity} inscrits
            {isFull && <span className="text-red-600 dark:text-red-400">(Complet)</span>}
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        {event.status === 'PUBLISHED' && (
          <div className="mt-6">
            {registered ? (
              <button
                onClick={handleUnregister}
                disabled={registering}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
              >
                {registering ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Traitement...
                  </span>
                ) : (
                  'Se desinscrire'
                )}
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering || isFull}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {registering ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Traitement...
                  </span>
                ) : isFull ? (
                  'Complet'
                ) : (
                  'S\'inscrire'
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
