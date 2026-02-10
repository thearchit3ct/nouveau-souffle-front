'use client';

import { Check } from 'lucide-react';
import type { MembershipType } from '@/types';

interface MembershipCardProps {
  type: MembershipType;
  onSelect: (type: MembershipType) => void;
  selected?: boolean;
}

export function MembershipCard({ type, onSelect, selected }: MembershipCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-xl border p-6 transition-all ${
        selected
          ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500 dark:border-emerald-400 dark:bg-emerald-950/30 dark:ring-emerald-400'
          : 'border-zinc-200 bg-white hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700'
      }`}
    >
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{type.name}</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{type.description}</p>

      <div className="mt-4">
        <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{type.price}&euro;</span>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          /{type.durationMonths} mois
        </span>
      </div>

      {type.benefits.length > 0 && (
        <ul className="mt-4 space-y-2">
          {type.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              {benefit}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => onSelect(type)}
        className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
          selected
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950/50'
        }`}
      >
        {selected ? 'Selectionne' : 'Choisir'}
      </button>
    </div>
  );
}
