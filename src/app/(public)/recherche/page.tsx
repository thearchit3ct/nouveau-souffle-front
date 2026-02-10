'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Loader2,
  FileText,
  FolderOpen,
  Calendar,
  ArrowRight,
  SearchX,
} from 'lucide-react';
import { searchApi } from '@/services/search';
import type { SearchIndexResult, SearchHit } from '@/types';

const INDEX_CONFIG: Record<
  string,
  { label: string; icon: typeof FileText; color: string }
> = {
  articles: {
    label: 'Articles',
    icon: FileText,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  projects: {
    label: 'Projets',
    icon: FolderOpen,
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  events: {
    label: 'Evenements',
    icon: Calendar,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
};

function getHitUrl(index: string, hit: SearchHit): string {
  switch (index) {
    case 'articles':
      return `/blog/${hit.slug}`;
    case 'projects':
      return `/projets/${hit.slug}`;
    case 'events':
      return `/events/${hit.id}`;
    default:
      return '#';
  }
}

function getHitTitle(hit: SearchHit): string {
  return hit.title || hit.name || 'Sans titre';
}

function getHitDescription(hit: SearchHit): string {
  const text = hit.excerpt || hit.description || '';
  if (text.length > 200) return text.substring(0, 200) + '...';
  return text;
}

export default function RecherchePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchIndexResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchApi.search(q.trim());
      setResults(res.data?.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search on initial load if query param exists
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    // Update URL without full page reload
    router.push(`/recherche?q=${encodeURIComponent(trimmed)}`, { scroll: false });
    performSearch(trimmed);
  }

  const totalHits = results.reduce((sum, r) => sum + r.estimatedTotalHits, 0);
  const hasResults = results.some((r) => r.hits.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Recherche
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Recherchez dans les articles, projets et evenements de l&apos;association.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Tapez votre recherche..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full rounded-xl border border-zinc-200 bg-white py-3.5 pl-12 pr-28 text-base text-zinc-900 placeholder:text-zinc-400 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Rechercher'
            )}
          </button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Recherche en cours...</p>
        </div>
      ) : searched && !hasResults ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <SearchX className="h-7 w-7 text-zinc-400" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Aucun resultat
          </h3>
          <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            Aucun resultat ne correspond a votre recherche
            &laquo;{initialQuery}&raquo;. Essayez avec d&apos;autres termes.
          </p>
        </div>
      ) : searched && hasResults ? (
        <div>
          {/* Total count */}
          <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            {totalHits} resultat{totalHits > 1 ? 's' : ''} trouves pour
            &laquo;{initialQuery}&raquo;
          </p>

          {/* Grouped results */}
          <div className="space-y-8">
            {results
              .filter((group) => group.hits.length > 0)
              .map((group) => {
                const config = INDEX_CONFIG[group.index] || {
                  label: group.index,
                  icon: FileText,
                  color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
                };
                const Icon = config.icon;

                return (
                  <section key={group.index}>
                    {/* Category header */}
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {config.label}
                      </h2>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {group.estimatedTotalHits}
                      </span>
                    </div>

                    {/* Result cards */}
                    <div className="space-y-3">
                      {group.hits.map((hit) => (
                        <Link
                          key={`${group.index}-${hit.id}`}
                          href={getHitUrl(group.index, hit)}
                          className="group block rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base font-medium text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                                {getHitTitle(hit)}
                              </h3>
                              {getHitDescription(hit) && (
                                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                  {getHitDescription(hit)}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-zinc-600" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
