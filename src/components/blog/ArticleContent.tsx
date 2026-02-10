'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Eye, Loader2 } from 'lucide-react';
import { articlesApi } from '@/services/articles';
import type { Article } from '@/types';

function formatContent(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hulo])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '');
}

export function ArticleContent({ slug }: { slug: string }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await articlesApi.getBySlug(slug);
        setArticle(res.data);
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

  if (error || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Article non trouve</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Cet article n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au blog
        </Link>
      </div>
    );
  }

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au blog
      </Link>

      {article.categories?.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {article.categories.map((ac) => (
            <span
              key={ac.category.id}
              className="inline-block rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: ac.category.color ? `${ac.category.color}20` : '#10B98120',
                color: ac.category.color || '#10B981',
              }}
            >
              {ac.category.name}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl">
        {article.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        {publishedDate && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {publishedDate}
          </span>
        )}
        {article.author && (
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {article.author.firstName} {article.author.lastName}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          {article.viewCount} vue{article.viewCount !== 1 ? 's' : ''}
        </span>
      </div>

      {article.featuredImageUrl && (
        <div className="mt-8 overflow-hidden rounded-xl">
          <img
            src={article.featuredImageUrl}
            alt={article.title}
            className="w-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-zinc mt-8 max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-emerald-600 dark:prose-a:text-emerald-400">
        <div dangerouslySetInnerHTML={{ __html: formatContent(article.content) }} />
      </div>
    </article>
  );
}
