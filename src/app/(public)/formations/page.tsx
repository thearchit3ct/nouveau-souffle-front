'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, Clock, Users, BookOpen, Loader2 } from 'lucide-react';
import { apiFetch } from '@/services/api';

interface TrainingItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  duration?: number;
  difficulty: string;
  tags: string[];
  _count?: { enrollments: number };
}

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Debutant', color: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400' },
  intermediate: { label: 'Intermediaire', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400' },
  advanced: { label: 'Avance', color: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' },
};

export default function FormationsPage() {
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ data: TrainingItem[] }>('/api/v1/trainings?limit=50')
      .then(res => setTrainings(res.data))
      .catch(() => setTrainings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 text-center">
        <GraduationCap className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Formations</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Developpez vos competences avec nos modules de formation en ligne.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : trainings.length === 0 ? (
        <div className="py-12 text-center text-zinc-500">Aucune formation disponible pour le moment.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainings.map((t) => {
            const diff = DIFFICULTY_LABELS[t.difficulty] || DIFFICULTY_LABELS.beginner;
            return (
              <Link
                key={t.id}
                href={`/formations/${t.slug}`}
                className="group rounded-lg border border-zinc-200 bg-white p-5 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
              >
                {t.imageUrl && (
                  <div className="mb-4 h-40 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <img src={t.imageUrl} alt={t.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="mb-2 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${diff.color}`}>
                    {diff.label}
                  </span>
                  {t.duration && (
                    <span className="flex items-center gap-1 text-xs text-zinc-400">
                      <Clock className="h-3 w-3" />
                      {t.duration} min
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100">
                  {t.title}
                </h3>
                {t.description && (
                  <p className="mb-3 text-sm text-zinc-500 line-clamp-3 dark:text-zinc-400">{t.description}</p>
                )}
                {t.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {t.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <Users className="h-3 w-3" />
                  {t._count?.enrollments ?? 0} inscrits
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
