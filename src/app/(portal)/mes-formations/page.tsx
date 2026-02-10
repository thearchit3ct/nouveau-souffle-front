'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, BookOpen, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { apiFetch } from '@/services/api';

interface EnrollmentItem {
  id: string;
  status: string;
  progress: number;
  startedAt: string;
  completedAt?: string;
  training?: {
    id: string;
    title: string;
    slug: string;
    duration?: number;
    difficulty: string;
  };
}

export default function MyTrainingsPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ data: EnrollmentItem[] }>('/api/v1/trainings/me')
      .then(res => setEnrollments(res.data))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const inProgress = enrollments.filter(e => e.status === 'IN_PROGRESS');
  const completed = enrollments.filter(e => e.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-6 w-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Mes formations</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : enrollments.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
          <p className="text-zinc-500">Vous n&apos;etes inscrit a aucune formation.</p>
          <Link href="/formations" className="mt-3 inline-block text-sm text-emerald-600 hover:text-emerald-700">
            Decouvrir les formations
          </Link>
        </div>
      ) : (
        <>
          {inProgress.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">En cours</h2>
              <div className="space-y-3">
                {inProgress.map(e => (
                  <Link
                    key={e.id}
                    href={`/formations/${e.training?.slug}`}
                    className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{e.training?.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
                        <span>{e.training?.difficulty}</span>
                        {e.training?.duration && <span><Clock className="inline h-3 w-3" /> {e.training.duration} min</span>}
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="mb-1 text-right text-xs text-emerald-600">{e.progress}%</div>
                      <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${e.progress}%` }} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Terminees</h2>
              <div className="space-y-3">
                {completed.map(e => (
                  <Link
                    key={e.id}
                    href={`/formations/${e.training?.slug}`}
                    className="flex items-center gap-4 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20"
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <div className="flex-1">
                      <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{e.training?.title}</h3>
                      {e.completedAt && (
                        <p className="text-xs text-zinc-400">Terminee le {new Date(e.completedAt).toLocaleDateString('fr-FR')}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
