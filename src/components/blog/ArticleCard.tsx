import Link from 'next/link';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <Link href={`/blog/${article.slug}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        {/* Image */}
        <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-800">
          {article.featuredImageUrl ? (
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-600">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Categories */}
          {article.categories?.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {article.categories.map((ac) => (
                <span
                  key={ac.category.id}
                  className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
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

          {/* Title */}
          <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-50 dark:group-hover:text-emerald-400">
            {article.title}
          </h3>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {article.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="mt-4 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-500">
            {date && <span>{date}</span>}
            {article.author && (
              <>
                <span>&middot;</span>
                <span>
                  {article.author.firstName} {article.author.lastName}
                </span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
