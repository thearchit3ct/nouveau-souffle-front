'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Users } from 'lucide-react';
import { eventsApi } from '@/services/events';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Event as EventType } from '@/types';

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
      render: (ev) => formatDate(ev.startDatetime),
    },
    {
      key: 'location',
      label: 'Lieu',
      render: (ev) => ev.locationName || ev.locationAddress || 'En ligne',
      hideOnMobile: true,
    },
    {
      key: 'capacity',
      label: 'Inscrits',
      render: (ev) => `${ev.registrationsCount}/${ev.capacity || '-'}`,
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
      render: (ev) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/events/${ev.id}/edit`}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editer
          </Link>
          <Link
            href={`/admin/events/${ev.id}/registrations`}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
          >
            <Users className="h-3.5 w-3.5" />
            Inscrits
          </Link>
          {(ev.status === 'PUBLISHED' || ev.status === 'DRAFT') && (
            <button
              onClick={() => handleCancel(ev.id)}
              className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              Annuler
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Gestion des Evenements
        </h1>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Nouvel evenement
        </Link>
      </div>

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
