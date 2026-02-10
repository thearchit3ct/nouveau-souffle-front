'use client';

import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  trend?: { value: string; positive: boolean };
}

export function StatsCard({ icon: Icon, label, value, color, trend }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
          {trend && (
            <p
              className={`text-xs font-medium ${
                trend.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend.positive ? '+' : ''}
              {trend.value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
