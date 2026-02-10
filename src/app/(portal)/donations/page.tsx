'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Heart, Plus } from 'lucide-react';
import { donationsApi } from '@/services/donations';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Donation } from '@/types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const columns: Column<Donation>[] = [
  {
    key: 'date',
    label: 'Date',
    render: (d) => formatDate(d.createdAt),
  },
  {
    key: 'amount',
    label: 'Montant',
    render: (d) => `${d.amount}\u20AC`,
  },
  {
    key: 'project',
    label: 'Projet',
    render: (d) => d.project?.name || '-',
    hideOnMobile: true,
  },
  {
    key: 'status',
    label: 'Statut',
    render: (d) => <StatusBadge status={d.status} />,
  },
];

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await donationsApi.getMyDonations({ page: p, limit: 10 });
      setDonations(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      // Show empty state on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Mes Dons</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Historique de vos dons a l&apos;association.
          </p>
        </div>
        <Link
          href="/donations/new"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Nouveau don
        </Link>
      </div>

      {!loading && donations.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Aucun don"
          description="Vous n'avez pas encore fait de don. Soutenez l'association en faisant votre premier don."
          actionLabel="Faire un don"
          actionHref="/donations/new"
        />
      ) : (
        <DataTable
          columns={columns}
          data={donations}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          keyExtractor={(d) => d.id}
        />
      )}
    </div>
  );
}
