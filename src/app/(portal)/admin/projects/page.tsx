'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Loader2, Star } from 'lucide-react';
import { projectsApi } from '@/services/projects';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Project } from '@/types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const statusFilters: { label: string; value: string }[] = [
  { label: 'Tous', value: '' },
  { label: 'Brouillon', value: 'DRAFT' },
  { label: 'Actif', value: 'ACTIVE' },
  { label: 'Termine', value: 'COMPLETED' },
  { label: 'Archive', value: 'ARCHIVED' },
];

function ProgressBar({ current, target }: { current: number; target: number }) {
  const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
  return (
    <div className="w-full min-w-[120px]">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {formatCurrency(current)}
        </span>
        <span className="text-zinc-400">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-0.5 text-right text-xs text-zinc-400">
        / {formatCurrency(target)}
      </p>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async (p: number, _status: string) => {
    setLoading(true);
    try {
      const res = await projectsApi.getAll({ page: p, limit: 10 });
      let filtered = res.data;
      if (_status) {
        filtered = filtered.filter((proj) => proj.status === _status);
      }
      setProjects(filtered);
      setTotalPages(res.meta.totalPages);
    } catch {
      // Show empty state on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page, statusFilter);
  }, [page, statusFilter, load]);

  async function handlePublish(id: string) {
    setActionLoading(id);
    try {
      await projectsApi.update(id, { status: 'ACTIVE' });
      await load(page, statusFilter);
    } catch {
      // Silently fail
    } finally {
      setActionLoading(null);
    }
  }

  async function handleArchive(id: string) {
    if (!confirm('Archiver ce projet ? Il ne sera plus visible publiquement.')) return;
    setActionLoading(id);
    try {
      await projectsApi.archive(id);
      await load(page, statusFilter);
    } catch {
      // Silently fail
    } finally {
      setActionLoading(null);
    }
  }

  async function handleComplete(id: string) {
    setActionLoading(id);
    try {
      await projectsApi.update(id, { status: 'COMPLETED' });
      await load(page, statusFilter);
    } catch {
      // Silently fail
    } finally {
      setActionLoading(null);
    }
  }

  function getCollectedAmount(project: Project): number {
    return project.collectedAmount ?? project.currentAmount ?? 0;
  }

  function getTargetAmount(project: Project): number {
    return project.targetAmount ?? project.goalAmount ?? 0;
  }

  const columns: Column<Project>[] = [
    {
      key: 'name',
      label: 'Nom',
      render: (p) => (
        <div className="flex items-center gap-2">
          <div className="max-w-xs">
            <p className="truncate font-medium">{p.name}</p>
            {p.description && (
              <p className="mt-0.5 truncate text-xs text-zinc-400">
                {p.description.substring(0, 80)}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: 'progress',
      label: 'Progression',
      render: (p) => {
        const target = getTargetAmount(p);
        if (target <= 0) {
          return <span className="text-xs text-zinc-400">Pas d&apos;objectif</span>;
        }
        return <ProgressBar current={getCollectedAmount(p)} target={target} />;
      },
      hideOnMobile: true,
    },
    {
      key: 'dates',
      label: 'Periode',
      render: (p) => (
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {p.startDate ? formatDate(p.startDate) : '-'}
          {p.endDate ? ` - ${formatDate(p.endDate)}` : ''}
        </div>
      ),
      hideOnMobile: true,
    },
    {
      key: 'featured',
      label: 'Vedette',
      render: (p) => (
        <Star
          className={`h-4 w-4 ${
            p.isFeatured
              ? 'fill-amber-400 text-amber-400'
              : 'text-zinc-300 dark:text-zinc-600'
          }`}
        />
      ),
      hideOnMobile: true,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (p) => (
        <div className="flex items-center gap-1">
          {actionLoading === p.id ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <Link
                href={`/admin/projects/${p.id}/edit`}
                className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
              >
                Editer
              </Link>
              {p.status === 'DRAFT' && (
                <button
                  onClick={() => handlePublish(p.id)}
                  className="rounded px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                >
                  Publier
                </button>
              )}
              {p.status === 'ACTIVE' && (
                <button
                  onClick={() => handleComplete(p.id)}
                  className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
                >
                  Terminer
                </button>
              )}
              {p.status !== 'ARCHIVED' && (
                <button
                  onClick={() => handleArchive(p.id)}
                  className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                >
                  Archiver
                </button>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Gestion des Projets
        </h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Nouveau projet
        </Link>
      </div>

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
        data={projects}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        keyExtractor={(p) => p.id}
      />
    </div>
  );
}
