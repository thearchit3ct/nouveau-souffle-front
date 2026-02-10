'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Target, Loader2 } from 'lucide-react';
import { projectsApi } from '@/services/projects';
import type { Project } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await projectsApi.getBySlug(slug);
        setProject(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Projet non trouve</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Ce projet n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <Link
          href="/projets"
          className="mt-6 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux projets
        </Link>
      </div>
    );
  }

  const target = project.targetAmount || project.goalAmount || 0;
  const collected = project.collectedAmount || project.currentAmount || 0;
  const progress = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;

  const statusLabels: Record<string, string> = {
    ACTIVE: 'En cours',
    COMPLETED: 'Termine',
    DRAFT: 'Brouillon',
    ARCHIVED: 'Archive',
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Back link */}
      <Link
        href="/projets"
        className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux projets
      </Link>

      {/* Status badge */}
      <div className="mb-4">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          {statusLabels[project.status] || project.status}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        {project.name}
      </h1>

      {/* Dates */}
      {(project.startDate || project.endDate) && (
        <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Calendar className="h-4 w-4" />
          {project.startDate && (
            <span>
              Du {new Date(project.startDate).toLocaleDateString('fr-FR')}
            </span>
          )}
          {project.endDate && (
            <span>
              au {new Date(project.endDate).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      )}

      {/* Progress section */}
      {target > 0 && (
        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-2 flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Objectif de collecte
            </h2>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-end justify-between">
              <span className="text-3xl font-bold text-emerald-600">
                {collected.toLocaleString('fr-FR')}&euro;
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                sur {target.toLocaleString('fr-FR')}&euro;
              </span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {progress}% de l&apos;objectif atteint
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/donations/new"
            className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Soutenir ce projet
          </Link>
        </div>
      )}

      {/* Description */}
      <div className="prose prose-zinc mt-8 max-w-none dark:prose-invert">
        {project.description?.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
