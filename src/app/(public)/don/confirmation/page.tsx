'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Download, ArrowRight, Home } from 'lucide-react';
import { useState } from 'react';
import { donationsApi } from '@/services/donations';

export default function DonConfirmationPage() {
  const searchParams = useSearchParams();
  const donationId = searchParams.get('donation');
  const [downloading, setDownloading] = useState(false);
  const [receiptError, setReceiptError] = useState('');

  async function handleDownloadReceipt() {
    if (!donationId) return;
    setDownloading(true);
    setReceiptError('');

    try {
      const res = await donationsApi.getReceipt(donationId);
      window.open(res.data.receiptUrl, '_blank');
    } catch {
      setReceiptError('Le recu n\'est pas encore disponible. Il sera genere sous quelques minutes.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
          <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Merci pour votre don !
        </h1>

        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Votre generosite fait la difference. Votre paiement a ete traite avec succes.
        </p>

        <div className="mt-6 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/20">
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            Votre don ouvre droit a une reduction d&apos;impot de 66% du montant verse.
            Un recu fiscal vous sera envoye par email.
          </p>
        </div>

        {donationId && (
          <div className="mt-6">
            <button
              onClick={handleDownloadReceipt}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
            >
              <Download className="h-4 w-4" />
              {downloading ? 'Chargement...' : 'Telecharger le recu fiscal'}
            </button>
            {receiptError && (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                {receiptError}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/projets"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Voir nos projets
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Home className="h-4 w-4" />
            Retour accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
