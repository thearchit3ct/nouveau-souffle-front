'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, X, ImageIcon } from 'lucide-react';
import { categoriesApi } from '@/services/categories';
import { uploadApi } from '@/services/upload';
import type { Category, CreateArticleData } from '@/types';

interface ArticleFormProps {
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    featuredImageUrl: string;
    categoryIds: string[];
    commentsEnabled: boolean;
  };
  onSubmit: (data: CreateArticleData) => Promise<void>;
  submitLabel: string;
}

export function ArticleForm({ initialData, onSubmit, submitLabel }: ArticleFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '');
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialData?.featuredImageUrl ?? '');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialData?.categoryIds ?? [],
  );
  const [commentsEnabled, setCommentsEnabled] = useState(initialData?.commentsEnabled ?? false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await categoriesApi.getAll();
        setCategories(res.data);
      } catch {
        // Categories not loaded
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const res = await uploadApi.upload(file, 'articles');
      setFeaturedImageUrl(res.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du telechargement');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }
    if (!content.trim()) {
      setError('Le contenu est requis.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit({
        title: title.trim(),
        content,
        excerpt: excerpt.trim() || undefined,
        featuredImageUrl: featuredImageUrl || undefined,
        categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
        commentsEnabled,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Titre *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          placeholder="Titre de l'article"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Extrait
        </label>
        <input
          type="text"
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          maxLength={500}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          placeholder="Resume court de l'article (max 500 caracteres)"
        />
        <p className="mt-1 text-xs text-zinc-400">{excerpt.length}/500</p>
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Contenu *
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          placeholder="Contenu de l'article (HTML ou Markdown)"
        />
      </div>

      {/* Featured image */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Image mise en avant
        </label>
        {featuredImageUrl ? (
          <div className="mt-2 flex items-start gap-3">
            <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
              <img
                src={featuredImageUrl}
                alt="Image mise en avant"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setFeaturedImageUrl('')}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              aria-label="Retirer l'image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="mt-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 px-4 py-8 text-sm text-zinc-500 transition-colors hover:border-emerald-400 hover:text-emerald-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-emerald-600 dark:hover:text-emerald-400 ${
                uploading ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Telechargement en cours...
                </>
              ) : (
                <>
                  <ImageIcon className="h-5 w-5" />
                  Cliquez pour telecharger une image (max 5 Mo)
                </>
              )}
            </label>
          </div>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Categories
        </label>
        {categoriesLoading ? (
          <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement des categories...
          </div>
        ) : categories.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-400">Aucune categorie disponible.</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const selected = selectedCategoryIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    selected
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Comments enabled */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="commentsEnabled"
          checked={commentsEnabled}
          onChange={(e) => setCommentsEnabled(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800"
        />
        <label htmlFor="commentsEnabled" className="text-sm text-zinc-700 dark:text-zinc-300">
          Activer les commentaires
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
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/articles')}
          className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
