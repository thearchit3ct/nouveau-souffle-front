'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { eventsApi } from '@/services/events';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Event as EventType, EventRegistration } from '@/types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EventRegistrationsPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<EventType | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  const loadRegistrations = useCallback(
    async (p: number) => {
      try {
        const res = await eventsApi.getRegistrations(eventId, { page: p, limit: 10 });
        setRegistrations(res.data);
        setTotalPages(res.meta.totalPages);
      } catch {
        setLoadError('Erreur lors du chargement des inscriptions.');
      }
    },
    [eventId],
  );

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const [eventRes] = await Promise.all([
          eventsApi.getOne(eventId),
          loadRegistrations(1),
        ]);
        setEvent(eventRes.data);
      } catch {
        setLoadError('Erreur lors du chargement.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [eventId, loadRegistrations]);

  useEffect(() => {
    if (!loading) {
      loadRegistrations(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleCheckIn(regId: string) {
    setCheckingIn(regId);
    try {
      await eventsApi.checkIn(eventId, regId);
      await loadRegistrations(page);
    } catch {
      // Silent fail
    } finally {
      setCheckingIn(null);
    }
  }

  const columns: Column<EventRegistration>[] = [
    {
      key: 'email',
      label: 'Email',
      render: (reg) => (
        <span className="font-medium">{reg.user?.email || '-'}</span>
      ),
    },
    {
      key: 'lastName',
      label: 'Nom',
      render: (reg) => reg.user?.lastName || '-',
    },
    {
      key: 'firstName',
      label: 'Prenom',
      render: (reg) => reg.user?.firstName || '-',
    },
    {
      key: 'status',
      label: 'Statut',
      render: (reg) => <StatusBadge status={reg.status} />,
    },
    {
      key: 'createdAt',
      label: 'Date inscription',
      render: (reg) => formatDate(reg.createdAt),
      hideOnMobile: true,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (reg) => {
        if (reg.status === 'CHECKED_IN') {
          return (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5" />
              Present
            </span>
          );
        }
        if (reg.status === 'CANCELED') {
          return <span className="text-xs text-zinc-400">-</span>;
        }
        return (
          <button
            onClick={() => handleCheckIn(reg.id)}
            disabled={checkingIn === reg.id}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
          >
            {checkingIn === reg.id ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCircle className="h-3.5 w-3.5" />
            )}
            Check-in
          </button>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (loadError && !event) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-800 dark:bg-red-950/50">
        <p className="text-sm text-red-700 dark:text-red-400">{loadError}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/events"
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux evenements
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Inscriptions
        </h1>
        {event && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {event.title} - {registrations.length > 0 ? `${registrations.length} inscription(s) sur cette page` : 'Aucune inscription'}
          </p>
        )}
      </div>

      <DataTable
        columns={columns}
        data={registrations}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        keyExtractor={(reg) => reg.id}
      />
    </div>
  );
}
