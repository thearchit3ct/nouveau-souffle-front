import type { Metadata } from 'next';
import { ProjectContent } from '@/components/projects/ProjectContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ns.thearchit3ct.xyz';

async function fetchProject(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/projects/${slug}`, {
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
  const project = await fetchProject(slug);

  if (!project) {
    return { title: 'Projet non trouve - Nouveau Souffle en Mission' };
  }

  const description = project.description?.substring(0, 160) || '';

  return {
    title: `${project.name} - Nouveau Souffle en Mission`,
    description,
    openGraph: {
      title: project.name,
      description,
      type: 'website',
      url: `${SITE_URL}/projets/${slug}`,
      ...(project.imageUrl && {
        images: [{ url: project.imageUrl, alt: project.name }],
      }),
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProjectContent slug={slug} />;
}
