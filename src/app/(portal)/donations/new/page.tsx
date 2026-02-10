'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { donationsApi } from '@/services/donations';
import { projectsApi } from '@/services/projects';
import { DonationForm } from '@/components/ui/DonationForm';
import type { Project, CreateDonationData } from '@/types';

export default function NewDonationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await projectsApi.getAll();
        setProjects(res.data.filter((p) => p.active));
      } catch {
        // No projects available
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(data: CreateDonationData) {
    setSubmitting(true);
    try {
      await donationsApi.create(data);
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle className="h-12 w-12 text-emerald-500" />
        <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Merci pour votre don !
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Votre don a ete enregistre avec succes.
        </p>
        <Link
          href="/donations"
          className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Voir mes dons
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Faire un don</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Soutenez les actions de l&apos;association.
        </p>
      </div>

      <div className="mx-auto max-w-lg rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <DonationForm projects={projects} onSubmit={handleSubmit} loading={submitting} />
      </div>
    </div>
  );
}
