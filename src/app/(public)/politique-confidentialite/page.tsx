export default function PolitiqueConfidentialitePage() {
  return (
    <div className="bg-white py-16 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Politique de confidentialite
        </h1>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Derniere mise a jour : fevrier 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              1. Collecte des donnees personnelles
            </h2>
            <p className="mt-3">
              Dans le cadre de l&apos;utilisation de notre plateforme, nous
              sommes amenes a collecter les donnees personnelles suivantes :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Nom et prenom</li>
              <li>Adresse email</li>
              <li>Numero de telephone (optionnel)</li>
              <li>Adresse postale (optionnel)</li>
              <li>Informations relatives aux adhesions et aux dons</li>
              <li>
                Donnees de connexion (adresse IP, date et heure de connexion)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              2. Utilisation des donnees
            </h2>
            <p className="mt-3">
              Les donnees collectees sont utilisees pour les finalites suivantes :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Gestion des adhesions et des cotisations</li>
              <li>Traitement des dons et emission des recus fiscaux</li>
              <li>
                Communication avec les membres (newsletters, notifications
                d&apos;evenements)
              </li>
              <li>Gestion des inscriptions aux evenements</li>
              <li>
                Amelioration de nos services et de l&apos;experience utilisateur
              </li>
              <li>Respect de nos obligations legales et reglementaires</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              3. Base legale du traitement
            </h2>
            <p className="mt-3">
              Le traitement de vos donnees personnelles repose sur :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Le consentement :
                </strong>{' '}
                pour les communications marketing et les newsletters
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  L&apos;execution du contrat :
                </strong>{' '}
                pour la gestion de votre adhesion
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  L&apos;obligation legale :
                </strong>{' '}
                pour la tenue de nos registres associatifs et fiscaux
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  L&apos;interet legitime :
                </strong>{' '}
                pour l&apos;amelioration de nos services
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              4. Duree de conservation
            </h2>
            <p className="mt-3">
              Vos donnees personnelles sont conservees pendant la duree
              necessaire a la realisation des finalites pour lesquelles elles ont
              ete collectees :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Donnees des membres :
                </strong>{' '}
                pendant la duree de l&apos;adhesion et 3 ans apres la fin de
                celle-ci
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Donnees des donateurs :
                </strong>{' '}
                pendant 5 ans apres le dernier don (obligations fiscales)
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Donnees de connexion :
                </strong>{' '}
                12 mois
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              5. Vos droits
            </h2>
            <p className="mt-3">
              Conformement au Reglement General sur la Protection des Donnees
              (RGPD), vous disposez des droits suivants :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Droit d&apos;acces :
                </strong>{' '}
                obtenir la confirmation que vos donnees sont traitees et en
                recevoir une copie
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Droit de rectification :
                </strong>{' '}
                demander la correction de donnees inexactes ou incompletes
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Droit a l&apos;effacement :
                </strong>{' '}
                demander la suppression de vos donnees dans les conditions
                prevues par la loi
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Droit a la limitation :
                </strong>{' '}
                demander la limitation du traitement de vos donnees
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Droit a la portabilite :
                </strong>{' '}
                recevoir vos donnees dans un format structure et lisible par
                machine
              </li>
              <li>
                <strong className="text-zinc-900 dark:text-zinc-200">
                  Droit d&apos;opposition :
                </strong>{' '}
                vous opposer au traitement de vos donnees pour des motifs
                legitimes
              </li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous a :{' '}
              <a
                href="mailto:contact@ns.thearchit3ct.xyz"
                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                contact@ns.thearchit3ct.xyz
              </a>
            </p>
            <p className="mt-2">
              Vous disposez egalement du droit d&apos;introduire une reclamation
              aupres de la CNIL (Commission Nationale de l&apos;Informatique et
              des Libertes).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              6. Cookies
            </h2>
            <p className="mt-3">
              Notre site utilise des cookies strictement necessaires au
              fonctionnement de la plateforme, notamment pour la gestion de
              votre session d&apos;authentification. Ces cookies ne necessitent
              pas votre consentement prealable.
            </p>
            <p className="mt-2">
              Aucun cookie de suivi publicitaire ou analytique n&apos;est utilise
              sur notre plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              7. Securite des donnees
            </h2>
            <p className="mt-3">
              Nous mettons en oeuvre les mesures techniques et
              organisationnelles appropriees pour garantir la securite de vos
              donnees personnelles :
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>Chiffrement TLS des communications</li>
              <li>Stockage securise sur des serveurs situes en Europe</li>
              <li>Acces restreint aux donnees selon le principe du moindre privilege</li>
              <li>Journalisation des acces et des modifications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              8. Contact - Delegue a la protection des donnees
            </h2>
            <p className="mt-3">
              Pour toute question relative a la protection de vos donnees
              personnelles, vous pouvez contacter notre responsable de la
              protection des donnees :
            </p>
            <p className="mt-2">
              Email :{' '}
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
