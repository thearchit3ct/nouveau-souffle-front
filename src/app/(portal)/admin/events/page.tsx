'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import { eventsApi } from '@/services/events';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Event as EventType, CreateEventData } from '@/types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await eventsApi.getAll({ page: p, limit: 10 });
      setEvents(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      // Show empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await eventsApi.create({
        title,
        description,
        date: new Date(date).toISOString(),
        location,
        capacity: Number(capacity),
      });
      setShowForm(false);
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setCapacity('');
      await load(page);
    } catch {
      setError('Erreur lors de la creation de l\'evenement.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(id: string) {
    try {
      await eventsApi.cancel(id);
      await load(page);
    } catch {
      // Silently fail
    }
  }

  const columns: Column<EventType>[] = [
    {
      key: 'title',
      label: 'Titre',
      render: (ev) => (
        <span className="font-medium">{ev.title}</span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (ev) => formatDate(ev.date),
    },
    {
      key: 'location',
      label: 'Lieu',
      render: (ev) => ev.location,
      hideOnMobile: true,
    },
    {
      key: 'capacity',
      label: 'Inscrits',
      render: (ev) => `${ev.registrationCount}/${ev.capacity}`,
      hideOnMobile: true,
    },
    {
      key: 'status',
      label: 'Statut',
      render: (ev) => <StatusBadge status={ev.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (ev) =>
        ev.status === 'PUBLISHED' || ev.status === 'DRAFT' ? (
          <button
            onClick={() => handleCancel(ev.id)}
            className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
          >
            Annuler
          </button>
        ) : (
          <span className="text-xs text-zinc-400">-</span>
        ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Gestion des Evenements
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Fermer' : 'Nouvel evenement'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Creer un evenement
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="event-title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Titre
              </label>
              <input
                id="event-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label htmlFor="event-desc" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <textarea
                id="event-desc"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="event-date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Date et heure
                </label>
                <input
                  id="event-date"
                  type="datetime-local"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label htmlFor="event-location" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Lieu
                </label>
                <input
                  id="event-location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <div>
                <label htmlFor="event-capacity" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Capacite
                </label>
                <input
                  id="event-capacity"
                  type="number"
                  min="1"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creation...
                </span>
              ) : (
                'Creer l\'evenement'
              )}
            </button>
          </form>
        </div>
      )}

      <DataTable
        columns={columns}
        data={events}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        keyExtractor={(ev) => ev.id}
      />
    </div>
  );
}
