'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { projectsApi } from '@/services/projects';
import type { CreateProjectData } from '@/types';

export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Le nom du projet est requis.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const data: CreateProjectData = {
        name: name.trim(),
        description: description.trim() || undefined,
        targetAmount: targetAmount ? Number(targetAmount) : undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        imageUrl: imageUrl.trim() || undefined,
        isFeatured,
      };
      await projectsApi.create(data);
      router.push('/admin/projects');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la creation du projet.'
      );
      setSubmitting(false);
    }
  }

  const inputClass =
    'mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500';
  const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-300';

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Nouveau projet
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClass}>
              Nom du projet *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Nom du projet"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="Description du projet, objectifs, impact attendu..."
            />
          </div>

          {/* Target Amount */}
          <div>
            <label htmlFor="targetAmount" className={labelClass}>
              Objectif de financement (EUR)
            </label>
            <input
              type="number"
              id="targetAmount"
              min="0"
              step="1"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className={inputClass}
              placeholder="ex: 5000"
            />
          </div>

          {/* Start + End dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="startDate" className={labelClass}>
                Date de debut
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="endDate" className={labelClass}>
                Date de fin
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className={labelClass}>
              URL de l&apos;image
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800"
            />
            <label htmlFor="isFeatured" className="text-sm text-zinc-700 dark:text-zinc-300">
              Projet en vedette (affiche en priorite sur la page publique)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Creer le projet
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/projects')}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
