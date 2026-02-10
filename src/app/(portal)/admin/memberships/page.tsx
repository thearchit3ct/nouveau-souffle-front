'use client';

import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { membershipsApi } from '@/services/memberships';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Membership, MembershipStatus } from '@/types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const statusFilters: { label: string; value: string }[] = [
  { label: 'Tous', value: '' },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Actifs', value: 'ACTIVE' },
  { label: 'Expires', value: 'EXPIRED' },
];

export default function AdminMembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async (p: number, status: string) => {
    setLoading(true);
    try {
      const res = await membershipsApi.getAll({
        page: p,
        limit: 10,
        status: status || undefined,
      });
      setMemberships(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      // Show empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page, statusFilter);
  }, [page, statusFilter, load]);

  async function handleAction(id: string, action: 'validate' | 'reject') {
    setActionLoading(id);
    try {
      if (action === 'validate') {
        await membershipsApi.validate(id);
      } else {
        await membershipsApi.reject(id);
      }
      await load(page, statusFilter);
    } catch {
      // Silently fail
    } finally {
      setActionLoading(null);
    }
  }

  const columns: Column<Membership>[] = [
    {
      key: 'member',
      label: 'Membre',
      render: (m) => (
        <span>
          {m.user?.firstName} {m.user?.lastName}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (m) => m.membershipType?.name || '-',
      hideOnMobile: true,
    },
    {
      key: 'startDate',
      label: 'Debut',
      render: (m) => formatDate(m.startDate),
      hideOnMobile: true,
    },
    {
      key: 'endDate',
      label: 'Fin',
      render: (m) => formatDate(m.endDate),
      hideOnMobile: true,
    },
    {
      key: 'status',
      label: 'Statut',
      render: (m) => <StatusBadge status={m.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (m) =>
        m.status === 'PENDING' ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleAction(m.id, 'validate')}
              disabled={actionLoading === m.id}
              className="rounded px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
            >
              {actionLoading === m.id ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                'Valider'
              )}
            </button>
            <button
              onClick={() => handleAction(m.id, 'reject')}
              disabled={actionLoading === m.id}
              className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              Rejeter
            </button>
          </div>
        ) : (
          <span className="text-xs text-zinc-400">-</span>
        ),
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Gestion des Adhesions
      </h1>

      {/* Status filter */}
      <div className="mb-4 flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={memberships}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        keyExtractor={(m) => m.id}
      />
    </div>
  );
}
