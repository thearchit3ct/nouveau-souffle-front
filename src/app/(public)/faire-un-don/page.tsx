'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { donationsApi } from '@/services/donations';
import { StripeProvider } from '@/components/providers/StripeProvider';
import { StripePaymentForm } from '@/components/donations/StripePaymentForm';
import type { Project } from '@/types';

const AMOUNT_PRESETS = [10, 25, 50, 100];

interface DonorInfo {
  donorFirstName: string;
  donorLastName: string;
  donorEmail: string;
  donorAddress: string;
  donorPostalCode: string;
  donorCity: string;
  projectId: string;
  isAnonymous: boolean;
  receiptRequested: boolean;
}

export default function FaireUnDonPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [donor, setDonor] = useState<DonorInfo>({
    donorFirstName: '',
    donorLastName: '',
    donorEmail: '',
    donorAddress: '',
    donorPostalCode: '',
    donorCity: '',
    projectId: '',
    isAnonymous: false,
    receiptRequested: true,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientSecret, setClientSecret] = useState('');
  const [donationId, setDonationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/projects?status=ACTIVE`)
      .then((r) => r.json())
      .then((res) => setProjects(res.data || []))
      .catch(() => {});
  }, []);

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  function handleDonorChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setDonor((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    if (finalAmount < 5 || finalAmount > 50000) {
      setError('Le montant doit etre entre 5 et 50 000 EUR');
      return;
    }
    if (!donor.donorFirstName || !donor.donorLastName || !donor.donorEmail) {
      setError('Veuillez renseigner vos informations');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await donationsApi.createPaymentIntent({
        amount: finalAmount,
        donorEmail: donor.donorEmail,
        donorFirstName: donor.donorFirstName,
        donorLastName: donor.donorLastName,
        projectId: donor.projectId || undefined,
        isAnonymous: donor.isAnonymous,
        receiptRequested: donor.receiptRequested,
        donorAddress: donor.donorAddress || undefined,
        donorPostalCode: donor.donorPostalCode || undefined,
        donorCity: donor.donorCity || undefined,
      });

      setClientSecret(res.data.clientSecret);
      setDonationId(res.data.donationId);
      setStep(2);
    } catch (err: any) {
      setError(err?.body?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-emerald-50 py-16 dark:bg-emerald-950/20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <Heart className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Faites un don
          </h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
            Soutenez nos actions. Chaque don compte et vous ouvre droit a une
            reduction d&apos;impot de 66%.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-2xl px-4">
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-8">
              {/* Amount selection */}
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Montant du don
                </h2>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {AMOUNT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setAmount(preset);
                        setCustomAmount('');
                      }}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        amount === preset && !customAmount
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-400'
                          : 'border-zinc-300 text-zinc-700 hover:border-emerald-300 dark:border-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {preset} &euro;
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <input
                    type="number"
                    min={5}
                    max={50000}
                    step="0.01"
                    placeholder="Autre montant (EUR)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
                {finalAmount > 0 && (
                  <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                    Cout reel apres reduction fiscale : {(finalAmount * 0.34).toFixed(2)} &euro;
                  </p>
                )}
              </div>

              {/* Donor info */}
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Vos informations
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Prenom *
                    </label>
                    <input
                      type="text"
                      name="donorFirstName"
                      required
                      value={donor.donorFirstName}
                      onChange={handleDonorChange}
                      className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="donorLastName"
                      required
                      value={donor.donorLastName}
                      onChange={handleDonorChange}
                      className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="donorEmail"
                      required
                      value={donor.donorEmail}
                      onChange={handleDonorChange}
                      className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Adresse (pour le recu fiscal)
                    </label>
                    <input
                      type="text"
                      name="donorAddress"
                      value={donor.donorAddress}
                      onChange={handleDonorChange}
                      className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="donorPostalCode"
                      value={donor.donorPostalCode}
                      onChange={handleDonorChange}
                      className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="donorCity"
                      value={donor.donorCity}
                      onChange={handleDonorChange}
                      className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>

              {/* Project selection */}
              {projects.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Soutenir un projet (optionnel)
                  </label>
                  <select
                    name="projectId"
                    value={donor.projectId}
                    onChange={handleDonorChange}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option value="">Don general</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={donor.isAnonymous}
                    onChange={handleDonorChange}
                    className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    Don anonyme
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="receiptRequested"
                    checked={donor.receiptRequested}
                    onChange={handleDonorChange}
                    className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    Je souhaite recevoir un recu fiscal
                  </span>
                </label>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Preparation du paiement...
                  </span>
                ) : (
                  `Passer au paiement - ${finalAmount.toFixed(2)} \u20ac`
                )}
              </button>
            </form>
          )}

          {step === 2 && clientSecret && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-zinc-500 hover:text-emerald-600 dark:text-zinc-400"
                >
                  &larr; Modifier les informations
                </button>
              </div>
              <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Paiement securise
              </h2>
              <StripeProvider clientSecret={clientSecret}>
                <StripePaymentForm donationId={donationId} amount={finalAmount} />
              </StripeProvider>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
