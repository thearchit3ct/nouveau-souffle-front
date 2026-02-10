'use client';

import { useState, type FormEvent } from 'react';
import { Heart, Users, Lightbulb, CheckCircle, Loader2 } from 'lucide-react';
import { volunteersApi } from '@/services/volunteers';
import type { CreateVolunteerData } from '@/types';

const SKILLS_OPTIONS = [
  'Communication',
  'Logistique',
  'Informatique',
  'Evenementiel',
  'Administratif',
  'Cuisine',
  'Autre',
];

const DAYS = [
  { key: 'lundi', label: 'Lundi' },
  { key: 'mardi', label: 'Mardi' },
  { key: 'mercredi', label: 'Mercredi' },
  { key: 'jeudi', label: 'Jeudi' },
  { key: 'vendredi', label: 'Vendredi' },
  { key: 'samedi', label: 'Samedi' },
  { key: 'dimanche', label: 'Dimanche' },
];

const TIME_SLOTS = ['Matin', 'Apres-midi', 'Soir'];

const whyCards = [
  {
    icon: Heart,
    title: 'Impact concret',
    description:
      'Chaque heure de benevolat contribue directement a ameliorer la vie des personnes que nous accompagnons. Votre engagement fait une vraie difference.',
  },
  {
    icon: Users,
    title: 'Communaute soudee',
    description:
      'Rejoignez une equipe de benevoles passionnes et bienveillants. Partagez des moments forts et tissez des liens durables.',
  },
  {
    icon: Lightbulb,
    title: 'Developpez vos competences',
    description:
      'Le benevolat est une opportunite unique d\'apprendre, de developper de nouvelles competences et d\'enrichir votre parcours.',
  },
];

export default function BenevolesPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [availabilities, setAvailabilities] = useState<Record<string, string[]>>({});
  const [motivation, setMotivation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function toggleSkill(skill: string) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  function toggleSlot(day: string, slot: string) {
    setAvailabilities((prev) => {
      const daySlots = prev[day] || [];
      const updated = daySlots.includes(slot)
        ? daySlots.filter((s) => s !== slot)
        : [...daySlots, slot];
      if (updated.length === 0) {
        const next = { ...prev };
        delete next[day];
        return next;
      }
      return { ...prev, [day]: updated };
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Veuillez remplir les champs obligatoires (prenom, nom, email).');
      return;
    }

    if (skills.length === 0) {
      setError('Veuillez selectionner au moins une competence.');
      return;
    }

    if (Object.keys(availabilities).length === 0) {
      setError('Veuillez indiquer au moins une disponibilite.');
      return;
    }

    setSubmitting(true);
    try {
      const data: CreateVolunteerData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        skills,
        availabilities,
        motivation: motivation.trim() || undefined,
      };
      await volunteersApi.apply(data);
      setSubmitted(true);
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer plus tard.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div>
        {/* Hero maintained for visual consistency */}
        <section className="bg-emerald-600 py-16 dark:bg-emerald-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Rejoignez nos benevoles
              </h1>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 dark:bg-zinc-950">
          <div className="mx-auto max-w-xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
              <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Votre candidature a ete envoyee !
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Merci pour votre interet pour le benevolat. Notre equipe va examiner
              votre candidature et vous recontactera dans les meilleurs delais. En
              attendant, n&apos;hesitez pas a consulter nos projets et evenements en
              cours.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="/projets"
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                Voir les projets
              </a>
              <a
                href="/events"
                className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Voir les evenements
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-emerald-600 py-16 dark:bg-emerald-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Rejoignez nos benevoles
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-emerald-100">
              Engagez-vous a nos cotes pour faire vivre la solidarite. Chaque
              contribution compte, quelle que soit votre disponibilite ou vos
              competences.
            </p>
          </div>
        </div>
      </section>

      {/* Why volunteer */}
      <section className="bg-zinc-50 py-16 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Pourquoi devenir benevole ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-zinc-500 dark:text-zinc-400">
            Le benevolat chez Nouveau Souffle en Mission, c&apos;est bien plus
            qu&apos;un engagement : c&apos;est une aventure humaine.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                  <card.icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="bg-white py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Formulaire de candidature
          </h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Remplissez ce formulaire et nous reviendrons vers vous rapidement.
            Les champs marques d&apos;un * sont obligatoires.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {/* Error display */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Personal info */}
            <fieldset>
              <legend className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Informations personnelles
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Prenom *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                    placeholder="Votre prenom"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Nom *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Telephone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
            </fieldset>

            {/* Skills */}
            <fieldset>
              <legend className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Competences *
              </legend>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Selectionnez les domaines dans lesquels vous pouvez contribuer.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SKILLS_OPTIONS.map((skill) => {
                  const selected = skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        selected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-700'
                      }`}
                      aria-pressed={selected}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Availabilities */}
            <fieldset>
              <legend className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Disponibilites *
              </legend>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Indiquez vos disponibilites habituelles.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm" role="grid" aria-label="Grille de disponibilites">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-zinc-500 dark:text-zinc-400">
                        Jour
                      </th>
                      {TIME_SLOTS.map((slot) => (
                        <th
                          key={slot}
                          className="px-3 py-2 text-center font-medium text-zinc-500 dark:text-zinc-400"
                        >
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day) => (
                      <tr
                        key={day.key}
                        className="border-t border-zinc-100 dark:border-zinc-800"
                      >
                        <td className="px-3 py-2 font-medium text-zinc-700 dark:text-zinc-300">
                          {day.label}
                        </td>
                        {TIME_SLOTS.map((slot) => {
                          const isChecked =
                            availabilities[day.key]?.includes(slot) ?? false;
                          return (
                            <td key={slot} className="px-3 py-2 text-center">
                              <label className="inline-flex cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleSlot(day.key, slot)}
                                  className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800"
                                  aria-label={`${day.label} ${slot}`}
                                />
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </fieldset>

            {/* Motivation */}
            <div>
              <label
                htmlFor="motivation"
                className="block text-lg font-semibold text-zinc-900 dark:text-zinc-50"
              >
                Motivation
              </label>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Dites-nous pourquoi vous souhaitez devenir benevole (optionnel).
              </p>
              <textarea
                id="motivation"
                rows={4}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="mt-3 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                placeholder="Parlez-nous de votre motivation..."
              />
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer ma candidature'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
