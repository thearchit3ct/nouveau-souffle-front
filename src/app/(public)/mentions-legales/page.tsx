export default function MentionsLegalesPage() {
  return (
    <div className="bg-white py-16 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Mentions legales
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Editeur du site
            </h2>
            <div className="mt-3 space-y-1">
              <p>
                <strong className="text-zinc-900 dark:text-zinc-200">Nom :</strong>{' '}
                Nouveau Souffle en Mission
              </p>
              <p>
                <strong className="text-zinc-900 dark:text-zinc-200">Forme juridique :</strong>{' '}
                Association loi 1901
              </p>
              <p>
                <strong className="text-zinc-900 dark:text-zinc-200">Email :</strong>{' '}
                contact@ns.thearchit3ct.xyz
              </p>
              <p>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Directeur de la publication :
                </strong>{' '}
                Le ou la president(e) de l&apos;association
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Hebergement
            </h2>
            <div className="mt-3 space-y-1">
              <p>
                <strong className="text-zinc-900 dark:text-zinc-200">Site web :</strong>{' '}
                Vercel Inc. - 440 N Barranca Ave #4133, Covina, CA 91723, USA
              </p>
              <p>
                <strong className="text-zinc-900 dark:text-zinc-200">Services backend :</strong>{' '}
                Hetzner Online GmbH - Industriestr. 25, 91710 Gunzenhausen, Allemagne
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Propriete intellectuelle
            </h2>
            <p className="mt-3">
              L&apos;ensemble du contenu de ce site (textes, images, videos,
              graphismes, logo, icones) est la propriete exclusive de
              l&apos;association Nouveau Souffle en Mission, sauf mention
              contraire. Toute reproduction, representation, modification,
              publication, adaptation de tout ou partie des elements du site,
              quel que soit le moyen ou le procede utilise, est interdite sans
              autorisation ecrite prealable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Responsabilite
            </h2>
            <p className="mt-3">
              L&apos;association Nouveau Souffle en Mission s&apos;efforce de
              fournir des informations aussi precises que possible. Toutefois,
              elle ne pourra etre tenue responsable des omissions, des
              inexactitudes et des carences dans la mise a jour, qu&apos;elles
              soient de son fait ou du fait des tiers partenaires qui lui
              fournissent ces informations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Liens hypertextes
            </h2>
            <p className="mt-3">
              Le site peut contenir des liens vers d&apos;autres sites internet.
              L&apos;association Nouveau Souffle en Mission ne dispose d&apos;aucun
              moyen pour controler le contenu de ces sites tiers et n&apos;assume
              aucune responsabilite quant a leur contenu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Droit applicable
            </h2>
            <p className="mt-3">
              Les presentes mentions legales sont regies par le droit francais.
              En cas de litige, les tribunaux francais seront seuls competents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Contact
            </h2>
            <p className="mt-3">
              Pour toute question relative aux presentes mentions legales, vous
              pouvez nous contacter a l&apos;adresse suivante :{' '}
              <a
                href="mailto:contact@ns.thearchit3ct.xyz"
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                contact@ns.thearchit3ct.xyz
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
