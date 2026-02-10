'use client';

import Link from 'next/link';
import { Users, Heart, FolderOpen, ArrowRight } from 'lucide-react';

const keyFigures = [
  { label: 'Membres actifs', value: '50+', icon: Users },
  { label: 'Collectes', value: '25 000 EUR', icon: Heart },
  { label: 'Projets en cours', value: '5', icon: FolderOpen },
];

const featuredProjects = [
  {
    title: 'Aide alimentaire locale',
    description:
      'Distribution de paniers repas aux familles en difficulte dans notre communaute. Un projet au coeur de notre mission solidaire.',
    progress: 75,
  },
  {
    title: 'Soutien scolaire',
    description:
      'Accompagnement des enfants et adolescents dans leur parcours educatif avec des benevoles qualifies.',
    progress: 60,
  },
  {
    title: 'Jardin partage',
    description:
      'Creation et entretien d\'un jardin communautaire pour favoriser le lien social et l\'acces a une alimentation saine.',
    progress: 40,
  },
];

const latestArticles = [
  {
    title: 'Bilan de notre collecte annuelle',
    excerpt:
      'Retour sur une edition record qui a permis de reunir plus de 8 000 euros pour nos projets solidaires.',
    date: '5 fevrier 2026',
    category: 'Evenements',
  },
  {
    title: 'Nouveau partenariat avec la mairie',
    excerpt:
      'Une convention signee pour renforcer nos actions sur le terrain et toucher davantage de beneficiaires.',
    date: '28 janvier 2026',
    category: 'Partenariats',
  },
  {
    title: 'Appel aux benevoles pour le printemps',
    excerpt:
      'Rejoignez-nous pour notre grande campagne de printemps. Toutes les bonnes volontes sont les bienvenues !',
    date: '20 janvier 2026',
    category: 'Benevoles',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-zinc-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Nouveau Souffle en Mission
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-emerald-100 sm:text-xl">
              Ensemble, construisons un monde meilleur. Rejoignez une communaute
              engagee pour la solidarite et le developpement.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl"
              >
                Nous soutenir
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/projets"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Decouvrir nos projets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key figures */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            {keyFigures.map((fig) => (
              <div
                key={fig.label}
                className="flex flex-col items-center rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                  <fig.icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {fig.value}
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {fig.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Nos projets en vedette
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
              Decouvrez les initiatives que nous portons pour notre communaute.
            </p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-700"
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {project.description}
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Progression</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all dark:bg-emerald-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                <Link
                  href="/projets"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  En savoir plus
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest articles */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Actualites recentes
            </h2>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
              Restez informes de nos dernieres nouvelles et evenements.
            </p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <div
                key={article.title}
                className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-emerald-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700"
              >
                {/* Image placeholder */}
                <div className="h-44 bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      {article.category}
                    </span>
                    <span className="text-xs text-zinc-400">{article.date}</span>
                  </div>
                  <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50">
                    {article.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {article.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 py-16 dark:bg-emerald-700">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Rejoignez l&apos;aventure
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-emerald-100">
            Que vous souhaitiez devenir membre, faire un don ou simplement
            en savoir plus, nous serons ravis de vous accueillir dans notre
            communaute.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl"
          >
            Devenir membre
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
