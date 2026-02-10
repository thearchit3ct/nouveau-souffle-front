import Link from 'next/link';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const target = project.targetAmount || project.goalAmount || 0;
  const collected = project.collectedAmount || project.currentAmount || 0;
  const progress = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;

  const statusLabels: Record<string, string> = {
    ACTIVE: 'En cours',
    COMPLETED: 'Termine',
    DRAFT: 'Brouillon',
    ARCHIVED: 'Archive',
  };

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    DRAFT: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    ARCHIVED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };

  return (
    <Link href={`/projets/${project.slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-50 dark:group-hover:text-emerald-400">
            {project.name}
          </h3>
          <span
            className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status] || statusColors.DRAFT}`}
          >
            {statusLabels[project.status] || project.status}
          </span>
        </div>

        {/* Description */}
        {project.description && (
          <p className="mb-4 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {project.description}
          </p>
        )}

        {/* Progress bar */}
        {target > 0 && (
          <div className="mb-3">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {collected.toLocaleString('fr-FR')}&euro;
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {progress}% de {target.toLocaleString('fr-FR')}&euro;
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Dates */}
        {(project.startDate || project.endDate) && (
          <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-500">
            {project.startDate && (
              <span>
                Debut : {new Date(project.startDate).toLocaleDateString('fr-FR')}
              </span>
            )}
            {project.startDate && project.endDate && <span> &mdash; </span>}
            {project.endDate && (
              <span>
                Fin : {new Date(project.endDate).toLocaleDateString('fr-FR')}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
