import { Heart, Globe, Users } from 'lucide-react';

const missions = [
  {
    icon: Heart,
    title: 'Solidarite',
    description:
      'Nous agissons au quotidien pour venir en aide aux personnes en difficulte, en proposant des actions concretes d\'entraide et de soutien.',
  },
  {
    icon: Globe,
    title: 'Developpement',
    description:
      'Nous portons des projets de developpement local et international pour ameliorer durablement les conditions de vie des communautes.',
  },
  {
    icon: Users,
    title: 'Communaute',
    description:
      'Nous creons du lien social en rassemblant des personnes de tous horizons autour de valeurs communes de partage et de respect.',
  },
];

const values = [
  {
    title: 'Transparence',
    description:
      'Nous rendons compte de chaque euro collecte et de chaque action menee. Nos rapports financiers et d\'activite sont accessibles a tous.',
  },
  {
    title: 'Engagement',
    description:
      'Chaque membre, benevole ou donateur est un maillon essentiel de notre chaine de solidarite. Nous valorisons l\'implication de chacun.',
  },
  {
    title: 'Respect',
    description:
      'Nous accueillons chacun sans distinction d\'origine, de religion ou de condition sociale. La dignite humaine est au coeur de notre action.',
  },
  {
    title: 'Innovation',
    description:
      'Nous explorons de nouvelles approches pour maximiser l\'impact de nos actions et repondre aux besoins emergents de notre societe.',
  },
];

const teamMembers = [
  { name: 'Marie Dupont', role: 'Presidente' },
  { name: 'Ahmed Benali', role: 'Tresorier' },
  { name: 'Sophie Martin', role: 'Secretaire generale' },
];

export default function AProposPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-zinc-50">
              A propos de Nouveau Souffle en Mission
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
              Decouvrez notre histoire, notre mission et les valeurs qui nous
              animent au quotidien.
            </p>
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Notre histoire
            </h2>
            <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>
                Nouveau Souffle en Mission est nee de la volonte d&apos;un groupe de
                citoyens engages de creer une structure associative capable de
                repondre aux enjeux sociaux de notre epoque.
              </p>
              <p>
                Fondee sur les principes de la loi 1901, notre association reunit
                aujourd&apos;hui plus de 50 membres actifs et de nombreux benevoles qui
                oeuvrent au quotidien pour porter des projets concrets de solidarite
                et de developpement communautaire.
              </p>
              <p>
                Depuis notre creation, nous avons mene de nombreuses actions :
                distribution alimentaire, soutien scolaire, ateliers d&apos;insertion
                professionnelle, et bien d&apos;autres initiatives au service de notre
                communaute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre mission */}
      <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Notre mission
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-500 dark:text-zinc-400">
            Trois piliers fondamentaux guident chacune de nos actions.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {missions.map((mission) => (
              <div
                key={mission.title}
                className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                  <mission.icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {mission.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {mission.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Nos valeurs
          </h2>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* L'equipe */}
      <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            L&apos;equipe dirigeante
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-500 dark:text-zinc-400">
            Des benevoles passionnes au service de notre mission.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <Users className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
