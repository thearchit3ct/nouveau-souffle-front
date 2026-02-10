'use client';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-400/30',
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-400/30',
  EXPIRED: 'bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-400/30',
  CANCELED: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/50 dark:text-red-400 dark:ring-red-400/30',
  COMPLETED: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-400/30',
  REJECTED: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/50 dark:text-red-400 dark:ring-red-400/30',
  REFUNDED: 'bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-950/50 dark:text-violet-400 dark:ring-violet-400/30',
  PUBLISHED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-400/30',
  DRAFT: 'bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-400/30',
  REGISTERED: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-400/30',
  CHECKED_IN: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-400/30',
  ARCHIVED: 'bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-400/30',
  SUSPENDED: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/50 dark:text-red-400 dark:ring-red-400/30',
  INACTIVE: 'bg-zinc-100 text-zinc-600 ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-400/30',
};

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  ACTIVE: 'Actif',
  EXPIRED: 'Expire',
  CANCELED: 'Annule',
  COMPLETED: 'Termine',
  REJECTED: 'Rejete',
  REFUNDED: 'Rembourse',
  PUBLISHED: 'Publie',
  DRAFT: 'Brouillon',
  REGISTERED: 'Inscrit',
  CHECKED_IN: 'Present',
  ARCHIVED: 'Archive',
  SUSPENDED: 'Suspendu',
  INACTIVE: 'Inactif',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.PENDING;
  const label = statusLabels[status] || status;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${style} ${className}`}
    >
      {label}
    </span>
  );
}
