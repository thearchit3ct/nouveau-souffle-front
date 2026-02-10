'use client';

import { useEffect, useState } from 'react';
import { Loader2, FolderOpen } from 'lucide-react';
import { projectsApi } from '@/services/projects';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Project } from '@/types';

export default function ProjetsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await projectsApi.getAll({ limit: 50 });
        setProjects(res.data);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Nos Projets
        </h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          Decouvrez les projets que nous menons et soutenez ceux qui vous tiennent a coeur.
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Aucun projet pour le moment"
          description="Revenez bientot pour decouvrir nos projets en cours."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
