'use client';

import { useRouter } from 'next/navigation';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { articlesApi } from '@/services/articles';
import type { CreateArticleData } from '@/types';

export default function NewArticlePage() {
  const router = useRouter();

  async function handleCreate(data: CreateArticleData) {
    await articlesApi.create(data);
    router.push('/admin/articles');
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Nouvel article
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <ArticleForm onSubmit={handleCreate} submitLabel="Creer l'article" />
      </div>
    </div>
  );
}
