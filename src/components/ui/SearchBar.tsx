'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Loader2, FileText, FolderOpen, Calendar, X, ArrowRight } from 'lucide-react';
import { searchApi } from '@/services/search';
import type { SearchIndexResult, SearchHit } from '@/types';

const INDEX_LABELS: Record<string, { label: string; icon: typeof FileText }> = {
  articles: { label: 'Articles', icon: FileText },
  projects: { label: 'Projets', icon: FolderOpen },
  events: { label: 'Evenements', icon: Calendar },
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
  if (text.length > 120) return text.substring(0, 120) + '...';
  return text;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchIndexResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounce query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    searchApi
      .search(debouncedQuery, { limit: 5 })
      .then((res) => {
        if (!cancelled) {
          setResults(res.data?.results || []);
          setIsOpen(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResults([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      if (e.key === 'Enter' && query.trim()) {
        e.preventDefault();
        setIsOpen(false);
        router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  const handleFocus = () => {
    if (debouncedQuery.length >= 2) {
      setIsOpen(true);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const totalHits = results.reduce((sum, r) => sum + r.estimatedTotalHits, 0);
  const hasResults = results.some((r) => r.hits.length > 0);

  return (
    <div ref={containerRef} className="relative">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="w-44 rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-8 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:w-64 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-900"
        />
        {query && (
          <button
            onClick={clearQuery}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            aria-label="Effacer la recherche"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && debouncedQuery.length >= 2 && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Recherche...
            </div>
          ) : !hasResults ? (
            <div className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Aucun resultat pour &laquo;{debouncedQuery}&raquo;
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              {results
                .filter((group) => group.hits.length > 0)
                .map((group) => {
                  const config = INDEX_LABELS[group.index] || {
                    label: group.index,
                    icon: FileText,
                  };
                  const Icon = config.icon;

                  return (
                    <div key={group.index}>
                      {/* Category header */}
                      <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-800/50">
                        <Icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                          {config.label}
                        </span>
                        <span className="ml-auto text-xs text-zinc-400">
                          {group.estimatedTotalHits} resultat
                          {group.estimatedTotalHits > 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Hits */}
                      {group.hits.slice(0, 5).map((hit) => (
                        <Link
                          key={`${group.index}-${hit.id}`}
                          href={getHitUrl(group.index, hit)}
                          onClick={() => setIsOpen(false)}
                          className="block border-b border-zinc-50 px-4 py-3 transition-colors hover:bg-emerald-50/50 dark:border-zinc-800/50 dark:hover:bg-emerald-950/20"
                        >
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {getHitTitle(hit)}
                          </p>
                          {getHitDescription(hit) && (
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                              {getHitDescription(hit)}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  );
                })}
            </div>
          )}

          {/* Footer link */}
          {(hasResults || !loading) && debouncedQuery && (
            <Link
              href={`/recherche?q=${encodeURIComponent(debouncedQuery)}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 border-t border-zinc-200 px-4 py-2.5 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:border-zinc-700 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
            >
              Voir tous les resultats
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
