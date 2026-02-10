'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Pause,
  Play,
  XCircle,
  Calendar,
  CreditCard,
  Hash,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { recurrencesApi } from '@/services/recurrences';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import type { DonationRecurrence, RecurrenceFrequency, RecurrenceStatus } from '@/types';

// ── Helpers ──

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)}\u20AC`;
}

function getFrequencyLabel(frequency: RecurrenceFrequency): string {
  const labels: Record<RecurrenceFrequency, string> = {
    MONTHLY: 'Mensuel',
    QUARTERLY: 'Trimestriel',
    YEARLY: 'Annuel',
  };
  return labels[frequency] ?? frequency;
}

function getFrequencyUnit(frequency: RecurrenceFrequency): string {
  const units: Record<RecurrenceFrequency, string> = {
    MONTHLY: '/ mois',
    QUARTERLY: '/ trimestre',
    YEARLY: '/ an',
  };
  return units[frequency] ?? '';
}

// ── Confirm dialog ──

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h3
          id="confirm-title"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          {title}
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Recurrence card ──

interface RecurrenceCardProps {
  recurrence: DonationRecurrence;
  onAction: (id: string, action: 'pause' | 'resume' | 'cancel') => void;
  actionLoading: string | null;
}

function RecurrenceCard({ recurrence, onAction, actionLoading }: RecurrenceCardProps) {
  const isLoading = actionLoading === recurrence.id;
  const isActive = recurrence.status === 'ACTIVE';
  const isPaused = recurrence.status === 'PAUSED';

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30">
            <RefreshCw className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {formatCurrency(recurrence.amount)}{' '}
              <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
                {getFrequencyUnit(recurrence.frequency)}
              </span>
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {getFrequencyLabel(recurrence.frequency)}
            </p>
          </div>
        </div>
        <StatusBadge status={recurrence.status} />
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {recurrence.nextPaymentDate && (
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>
              Prochain : {formatDate(recurrence.nextPaymentDate)}
            </span>
          </div>
        )}
        {recurrence.lastPaymentDate && (
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <CreditCard className="h-4 w-4 shrink-0" />
            <span>
              Dernier : {formatDate(recurrence.lastPaymentDate)}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <Hash className="h-4 w-4 shrink-0" />
          <span>
            {recurrence.paymentCount} paiement{recurrence.paymentCount !== 1 ? 's' : ''} effectue{recurrence.paymentCount !== 1 ? 's' : ''}
          </span>
        </div>
        {recurrence.project && (
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <FolderOpen className="h-4 w-4 shrink-0" />
            <span className="truncate">{recurrence.project.name}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {(isActive || isPaused) && (
        <div className="mt-4 flex gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          {isActive && (
            <button
              type="button"
              onClick={() => onAction(recurrence.id, 'pause')}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/20"
            >
              <Pause className="h-3.5 w-3.5" />
              Mettre en pause
            </button>
          )}
          {isPaused && (
            <button
              type="button"
              onClick={() => onAction(recurrence.id, 'resume')}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
            >
              <Play className="h-3.5 w-3.5" />
              Reprendre
            </button>
          )}
          <button
            type="button"
            onClick={() => onAction(recurrence.id, 'cancel')}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/20"
          >
            <XCircle className="h-3.5 w-3.5" />
            Annuler
          </button>
        </div>
      )}

      {/* Canceled info */}
      {recurrence.canceledAt && (
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Annule le {formatDate(recurrence.canceledAt)}
        </p>
      )}
    </div>
  );
}

// ── Main page ──

export default function MesDonsRecurrentsPage() {
  const [recurrences, setRecurrences] = useState<DonationRecurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    id: string;
    action: 'cancel';
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await recurrencesApi.getMyRecurrences();
      setRecurrences(res.data);
    } catch {
      setError('Impossible de charger vos dons recurrents.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAction(id: string, action: 'pause' | 'resume' | 'cancel') {
    if (action === 'cancel') {
      setConfirmDialog({ id, action });
      return;
    }

    setActionLoading(id);
    setError('');
    try {
      const res =
        action === 'pause'
          ? await recurrencesApi.pause(id)
          : await recurrencesApi.resume(id);

      setRecurrences((prev) =>
        prev.map((r) => (r.id === id ? res.data : r))
      );
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer.');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleConfirmCancel() {
    if (!confirmDialog) return;
    const { id } = confirmDialog;

    setActionLoading(id);
    setError('');
    try {
      const res = await recurrencesApi.cancel(id);
      setRecurrences((prev) =>
        prev.map((r) => (r.id === id ? res.data : r))
      );
      setConfirmDialog(null);
    } catch {
      setError('Impossible d\'annuler ce don recurrent. Veuillez reessayer.');
    } finally {
      setActionLoading(null);
    }
  }

  // Separate active/paused from ended
  const activeRecurrences = recurrences.filter(
    (r) => r.status === 'ACTIVE' || r.status === 'PAUSED'
  );
  const endedRecurrences = recurrences.filter(
    (r) => r.status === 'CANCELED' || r.status === 'EXPIRED'
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Mes dons recurrents
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Gerez vos dons automatiques a l&apos;association.
          </p>
        </div>
        <Link
          href="/faire-un-don/recurrent"
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
        >
          <RefreshCw className="h-4 w-4" />
          Nouveau don recurrent
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400"
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      )}

      {/* Empty state */}
      {!loading && recurrences.length === 0 && (
        <EmptyState
          icon={RefreshCw}
          title="Aucun don recurrent"
          description="Vous n'avez pas encore mis en place de don recurrent. Soutenez l'association de facon reguliere."
          actionLabel="Mettre en place un don recurrent"
          actionHref="/faire-un-don/recurrent"
        />
      )}

      {/* Active recurrences */}
      {!loading && activeRecurrences.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            En cours ({activeRecurrences.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {activeRecurrences.map((rec) => (
              <RecurrenceCard
                key={rec.id}
                recurrence={rec}
                onAction={handleAction}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ended recurrences */}
      {!loading && endedRecurrences.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Termines ({endedRecurrences.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {endedRecurrences.map((rec) => (
              <RecurrenceCard
                key={rec.id}
                recurrence={rec}
                onAction={handleAction}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Confirm cancel dialog */}
      <ConfirmDialog
        open={confirmDialog !== null}
        title="Annuler le don recurrent"
        message="Etes-vous sur de vouloir annuler ce don recurrent ? Cette action est irreversible. Aucun prelevement supplementaire ne sera effectue."
        confirmLabel="Confirmer l'annulation"
        loading={actionLoading !== null}
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  );
}
