'use client';

import { useState } from 'react';
import { FileText, Download, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/services/api';

export default function AnnualReceiptsPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 - i);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleDownload = async (year: number) => {
    setDownloading(year);
    setError('');
    try {
      const res = await apiFetch<{ data: { receiptUrl: string } }>(`/api/v1/donations/annual/${year}`);
      window.open(res.data.receiptUrl, '_blank');
    } catch {
      setError(`Aucun don enregistre pour l'annee ${year}.`);
    }
    setDownloading(null);
  };

  return (
    <div className="space-y-6">
      <Link href="/donations" className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700">
        <ArrowLeft className="h-4 w-4" />
        Retour aux dons
      </Link>

      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Recus fiscaux annuels</h1>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Telechargez vos recus fiscaux consolides pour chaque annee. Ce document regroupe l&apos;ensemble de vos dons effectues au cours de l&apos;annee.
      </p>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {years.map(year => (
          <div
            key={year}
            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{year}</p>
              <p className="text-xs text-zinc-400">Recu fiscal annuel</p>
            </div>
            <button
              onClick={() => handleDownload(year)}
              disabled={downloading === year}
              className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50 disabled:opacity-50"
            >
              {downloading === year ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Telecharger
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
