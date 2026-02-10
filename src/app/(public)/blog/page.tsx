'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2, FileText } from 'lucide-react';
import { articlesApi } from '@/services/articles';
import { categoriesApi } from '@/services/categories';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Article, Category } from '@/types';

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    categoriesApi.getAll().then((res) => {
      setCategories(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await articlesApi.getAll({
          page,
          limit: 9,
          category: selectedCategory || undefined,
          search: search || undefined,
        });
        setArticles(res.data);
        setTotalPages(res.meta?.totalPages || 1);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, selectedCategory, search]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  function selectCategory(slug: string) {
    setSelectedCategory(slug === selectedCategory ? '' : slug);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Blog &amp; Actualites
        </h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          Suivez nos projets, temoignages et actualites de l&apos;association.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Sidebar */}
        <aside className="mb-8 lg:col-span-1 lg:mb-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </form>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.slug)}
                  className={`rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-emerald-100 font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  {cat.name}
                  {cat._count?.articles !== undefined && (
                    <span className="ml-1 text-xs text-zinc-400">({cat._count.articles})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Articles grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : articles.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Aucun article"
              description="Aucun article ne correspond a vos criteres de recherche."
            />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Precedent
                  </button>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Page {page} sur {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
