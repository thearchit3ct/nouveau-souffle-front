'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { articlesApi } from '@/services/articles';
import type { Article, UpdateArticleData } from '@/types';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadArticle() {
      try {
        // The admin endpoint returns the article in paginated list,
        // but we can use the slug endpoint or search.
        // Since we have the ID, use getAllAdmin with limit 1 and find it.
        // Actually, the slug endpoint works for published articles only.
        // Let's fetch admin list and find by ID.
        const res = await articlesApi.getAllAdmin({ limit: 100 });
        const found = res.data.find((a) => a.id === id);
        if (found) {
          setArticle(found);
        } else {
          setError('Article non trouve.');
        }
      } catch {
        setError('Erreur lors du chargement de l\'article.');
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [id]);

  async function handleUpdate(data: UpdateArticleData) {
    await articlesApi.update(id, data);
    router.push('/admin/articles');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-800 dark:bg-red-950/50">
        <p className="text-sm text-red-700 dark:text-red-400">
          {error || 'Article non trouve.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Editer l&apos;article
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <ArticleForm
          initialData={{
            title: article.title,
            content: article.content,
            excerpt: article.excerpt || '',
            featuredImageUrl: article.featuredImageUrl || '',
            categoryIds: article.categories.map((ac) => ac.category.id),
            commentsEnabled: article.commentsEnabled,
          }}
          onSubmit={handleUpdate}
          submitLabel="Enregistrer les modifications"
        />
      </div>
    </div>
  );
}
