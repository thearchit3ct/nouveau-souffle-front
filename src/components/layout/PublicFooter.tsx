import Link from 'next/link';

const usefulLinks = [
  { name: 'Accueil', href: '/' },
  { name: 'Blog', href: '/blog' },
  { name: 'Projets', href: '/projets' },
  { name: 'Evenements', href: '/events' },
  { name: 'Faire un don', href: '/auth/register' },
];

const legalLinks = [
  { name: 'Mentions legales', href: '/mentions-legales' },
  { name: 'Politique de confidentialite', href: '/politique-confidentialite' },
  { name: 'Contact', href: '/contact' },
];

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-zinc-50">
              Nouveau Souffle en Mission
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
              Association loi 1901 engagee pour la solidarite, le developpement
              communautaire et l&apos;entraide. Ensemble, construisons un avenir
              meilleur.
            </p>
          </div>

          {/* Useful links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Liens utiles
            </h4>
            <ul className="mt-4 space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-emerald-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Legal
            </h4>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-emerald-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-zinc-800 pt-6">
          <p className="text-center text-sm text-zinc-500">
            &copy; {currentYear} Nouveau Souffle en Mission. Tous droits reserves.
          </p>
        </div>
      </div>
    </footer>
  );
}
