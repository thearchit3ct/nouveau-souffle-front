import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ns.thearchit3ct.xyz';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/a-propos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/projets`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/faire-un-don`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/politique-confidentialite`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Fetch published articles
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/v1/articles?limit=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      articlePages = (data.data || []).map((article: any) => ({
        url: `${BASE_URL}/blog/${article.slug}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch {}

  // Fetch active projects
  let projectPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/v1/projects?limit=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      projectPages = (data.data || []).map((project: any) => ({
        url: `${BASE_URL}/projets/${project.slug}`,
        lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch {}

  return [...staticPages, ...articlePages, ...projectPages];
}
