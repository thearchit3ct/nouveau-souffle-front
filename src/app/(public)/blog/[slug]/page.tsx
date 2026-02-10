import type { Metadata } from 'next';
import { ArticleContent } from '@/components/blog/ArticleContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ns.thearchit3ct.xyz';

async function fetchArticle(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/articles/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    return { title: 'Article non trouve - Nouveau Souffle en Mission' };
  }

  const description = article.excerpt || article.content?.substring(0, 160) || '';

  return {
    title: `${article.title} - Nouveau Souffle en Mission`,
    description,
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      publishedTime: article.publishedAt,
      url: `${SITE_URL}/blog/${slug}`,
      ...(article.featuredImageUrl && {
        images: [{ url: article.featuredImageUrl, alt: article.title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleContent slug={slug} />;
}
