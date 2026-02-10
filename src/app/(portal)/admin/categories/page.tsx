'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';
import { categoriesApi } from '@/services/categories';
import type { Category, CreateCategoryData } from '@/types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const DEFAULT_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newColor, setNewColor] = useState(DEFAULT_COLORS[0]);
  const [newDisplayOrder, setNewDisplayOrder] = useState('');
  const [createError, setCreateError] = useState('');

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editDisplayOrder, setEditDisplayOrder] = useState('');
  const [editError, setEditError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await categoriesApi.getAll();
      const sorted = [...res.data].sort((a, b) => a.displayOrder - b.displayOrder);
      setCategories(sorted);
    } catch {
      // Show empty state on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Auto-generate slug from name
  useEffect(() => {
    if (newName && !newSlug) {
      // only auto-set if user hasn't manually edited slug
    }
  }, [newName, newSlug]);

  function handleNewNameChange(value: string) {
    setNewName(value);
    setNewSlug(slugify(value));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) {
      setCreateError('Le nom est requis.');
      return;
    }

    setActionLoading('create');
    setCreateError('');
    try {
      const data: CreateCategoryData = {
        name: newName.trim(),
        slug: newSlug.trim() || slugify(newName.trim()),
        description: newDescription.trim() || undefined,
        color: newColor || undefined,
        displayOrder: newDisplayOrder ? Number(newDisplayOrder) : undefined,
      };
      await categoriesApi.create(data);
      setNewName('');
      setNewSlug('');
      setNewDescription('');
      setNewColor(DEFAULT_COLORS[0]);
      setNewDisplayOrder('');
      setShowCreateForm(false);
      await load();
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : 'Erreur lors de la creation.'
      );
    } finally {
      setActionLoading(null);
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDescription(cat.description || '');
    setEditColor(cat.color || DEFAULT_COLORS[0]);
    setEditDisplayOrder(String(cat.displayOrder));
    setEditError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError('');
  }

  async function handleUpdate(id: string) {
    if (!editName.trim()) {
      setEditError('Le nom est requis.');
      return;
    }

    setActionLoading(id);
    setEditError('');
    try {
      await categoriesApi.update(id, {
        name: editName.trim(),
        slug: editSlug.trim() || undefined,
        description: editDescription.trim() || undefined,
        color: editColor || undefined,
        displayOrder: editDisplayOrder ? Number(editDisplayOrder) : undefined,
      });
      setEditingId(null);
      await load();
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : 'Erreur lors de la mise a jour.'
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Supprimer la categorie "${name}" ? Cette action est irreversible.`)) {
      return;
    }

    setActionLoading(id);
    try {
      await categoriesApi.remove(id);
      await load();
    } catch {
      // Silently fail
    } finally {
      setActionLoading(null);
    }
  }

  const inputClass =
    'block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500';
  const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-300';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Gestion des Categories
        </h1>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Nouvelle categorie
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-800 dark:bg-emerald-950/20">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Nouvelle categorie
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            {createError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
                {createError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="newName" className={labelClass}>
                  Nom *
                </label>
                <input
                  type="text"
                  id="newName"
                  value={newName}
                  onChange={(e) => handleNewNameChange(e.target.value)}
                  className={`mt-1 ${inputClass}`}
                  placeholder="ex: Actualites"
                />
              </div>
              <div>
                <label htmlFor="newSlug" className={labelClass}>
                  Slug
                </label>
                <input
                  type="text"
                  id="newSlug"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className={`mt-1 ${inputClass}`}
                  placeholder="auto-genere"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newDescription" className={labelClass}>
                Description
              </label>
              <input
                type="text"
                id="newDescription"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className={`mt-1 ${inputClass}`}
                placeholder="Description optionnelle"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Couleur</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewColor(color)}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        newColor === color
                          ? 'border-zinc-900 scale-110 dark:border-zinc-100'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Couleur ${color}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="newDisplayOrder" className={labelClass}>
                  Ordre d&apos;affichage
                </label>
                <input
                  type="number"
                  id="newDisplayOrder"
                  min="0"
                  value={newDisplayOrder}
                  onChange={(e) => setNewDisplayOrder(e.target.value)}
                  className={`mt-1 ${inputClass}`}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-emerald-200 pt-4 dark:border-emerald-800">
              <button
                type="submit"
                disabled={actionLoading === 'create'}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {actionLoading === 'create' && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Creer
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setCreateError('');
                }}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories table */}
      {loading ? (
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-zinc-200 px-6 py-4 last:border-b-0 dark:border-zinc-800"
            >
              <div className="h-4 w-4 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Aucune categorie. Creez-en une pour commencer.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {/* Header */}
          <div className="hidden border-b border-zinc-200 dark:border-zinc-800 md:block">
            <div className="grid grid-cols-[auto_1fr_120px_80px_80px_100px] items-center gap-4 px-6 py-3">
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Couleur
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Nom / Slug
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Articles
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Ordre
              </span>
              <span />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Actions
              </span>
            </div>
          </div>

          {/* Rows */}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-800"
            >
              {editingId === cat.id ? (
                /* Edit mode */
                <div className="space-y-3 px-6 py-4">
                  {editError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
                      {editError}
                    </div>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={`mt-1 ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Slug
                      </label>
                      <input
                        type="text"
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className={`mt-1 ${inputClass}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className={`mt-1 ${inputClass}`}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Couleur
                      </label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {DEFAULT_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setEditColor(color)}
                            className={`h-7 w-7 rounded-full border-2 transition-all ${
                              editColor === color
                                ? 'border-zinc-900 scale-110 dark:border-zinc-100'
                                : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={`Couleur ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Ordre
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editDisplayOrder}
                        onChange={(e) => setEditDisplayOrder(e.target.value)}
                        className={`mt-1 ${inputClass}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      disabled={actionLoading === cat.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {actionLoading === cat.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                      Enregistrer
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      <X className="h-3 w-3" />
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                /* Display mode */
                <div className="grid grid-cols-1 items-center gap-4 px-6 py-4 md:grid-cols-[auto_1fr_120px_80px_80px_100px]">
                  {/* Color dot */}
                  <div className="flex items-center gap-3 md:contents">
                    <div
                      className="h-4 w-4 shrink-0 rounded-full"
                      style={{ backgroundColor: cat.color || '#6b7280' }}
                    />
                    {/* Name & slug */}
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {cat.name}
                      </p>
                      <p className="text-xs text-zinc-400">/{cat.slug}</p>
                      {cat.description && (
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Articles count */}
                  <div className="flex items-center gap-2 md:block">
                    <span className="text-xs text-zinc-500 md:hidden">Articles:</span>
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {cat._count?.articles ?? 0}
                    </span>
                  </div>
                  {/* Display order */}
                  <div className="flex items-center gap-2 md:block">
                    <span className="text-xs text-zinc-500 md:hidden">Ordre:</span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {cat.displayOrder}
                    </span>
                  </div>
                  <div />
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {actionLoading === cat.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(cat)}
                          className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                          aria-label={`Editer ${cat.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                          aria-label={`Supprimer ${cat.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
