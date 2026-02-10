'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';
import { articlesApi } from '@/services/articles';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Article, ArticleStatus } from '@/types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const statusFilters: { label: string; value: string }[] = [
  { label: 'Tous', value: '' },
  { label: 'Brouillon', value: 'DRAFT' },
  { label: 'Publie', value: 'PUBLISHED' },
  { label: 'Archive', value: 'ARCHIVED' },
];

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async (p: number, status: string) => {
    setLoading(true);
    try {
      const res = await articlesApi.getAllAdmin({
        page: p,
        limit: 10,
        status: status || undefined,
      });
      setArticles(res.data);
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

  async function handlePublish(id: string) {
    setActionLoading(id);
    try {
      await articlesApi.publish(id);
      await load(page, statusFilter);
    } catch {
      // Silently fail
    } finally {
      setActionLoading(null);
    }
  }

  async function handleArchive(id: string) {
    setActionLoading(id);
    try {
      await articlesApi.archive(id);
      await load(page, statusFilter);
    } catch {
      // Silently fail
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet article ? Cette action est irreversible.')) return;
    setActionLoading(id);
    try {
      await articlesApi.remove(id);
      await load(page, statusFilter);
    } catch {
      // Silently fail
    } finally {
      setActionLoading(null);
    }
  }

  const columns: Column<Article>[] = [
    {
      key: 'title',
      label: 'Titre',
      render: (a) => (
        <div className="max-w-xs">
          <p className="truncate font-medium">{a.title}</p>
          {a.excerpt && (
            <p className="mt-0.5 truncate text-xs text-zinc-400">{a.excerpt}</p>
          )}
        </div>
      ),
    },
    {
      key: 'author',
      label: 'Auteur',
      render: (a) => `${a.author.firstName} ${a.author.lastName}`,
      hideOnMobile: true,
    },
    {
      key: 'categories',
      label: 'Categories',
      render: (a) =>
        a.categories.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {a.categories.map((ac) => (
              <span
                key={ac.category.id}
                className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {ac.category.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-zinc-400">-</span>
        ),
      hideOnMobile: true,
    },
    {
      key: 'status',
      label: 'Statut',
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      key: 'publishedAt',
      label: 'Publication',
      render: (a) =>
        a.publishedAt ? formatDate(a.publishedAt) : <span className="text-xs text-zinc-400">-</span>,
      hideOnMobile: true,
    },
    {
      key: 'views',
      label: 'Vues',
      render: (a) => a.viewCount,
      hideOnMobile: true,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (a) => (
        <div className="flex items-center gap-1">
          {actionLoading === a.id ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <Link
                href={`/admin/articles/${a.id}/edit`}
                className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50"
              >
                Editer
              </Link>
              {a.status === 'DRAFT' && (
                <button
                  onClick={() => handlePublish(a.id)}
                  className="rounded px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                >
                  Publier
                </button>
              )}
              {a.status === 'PUBLISHED' && (
                <button
                  onClick={() => handleArchive(a.id)}
                  className="rounded px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/50"
                >
                  Archiver
                </button>
              )}
              <button
                onClick={() => handleDelete(a.id)}
                className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
              >
                Supprimer
              </button>
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
          Gestion des Articles
        </h1>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Nouvel article
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
        data={articles}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        keyExtractor={(a) => a.id}
      />
    </div>
  );
}
