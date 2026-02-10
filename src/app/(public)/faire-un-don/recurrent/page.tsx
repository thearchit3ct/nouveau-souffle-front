'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  RefreshCw,
  Calendar,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { recurrencesApi } from '@/services/recurrences';
import type { Project, RecurrenceFrequency } from '@/types';

// ── Stripe setup ──

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

// ── Constants ──

const AMOUNT_PRESETS = [10, 20, 50, 100];

const FREQUENCIES: { value: RecurrenceFrequency; label: string; multiplier: number }[] = [
  { value: 'MONTHLY', label: 'Mensuel', multiplier: 12 },
  { value: 'QUARTERLY', label: 'Trimestriel', multiplier: 4 },
  { value: 'YEARLY', label: 'Annuel', multiplier: 1 },
];

// ── Card element styles ──

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#18181b',
      fontFamily: 'system-ui, sans-serif',
      '::placeholder': {
        color: '#a1a1aa',
      },
    },
    invalid: {
      color: '#e11d48',
      iconColor: '#e11d48',
    },
  },
  hidePostalCode: true,
};

// ── Helpers ──

function getFrequencyLabel(frequency: RecurrenceFrequency): string {
  return FREQUENCIES.find((f) => f.value === frequency)?.label ?? frequency;
}

function getAnnualTotal(amount: number, frequency: RecurrenceFrequency): number {
  const freq = FREQUENCIES.find((f) => f.value === frequency);
  return amount * (freq?.multiplier ?? 1);
}

// ── Inner payment form (uses Stripe hooks) ──

interface RecurringPaymentFormProps {
  amount: number;
  frequency: RecurrenceFrequency;
  projectId: string;
}

function RecurringPaymentForm({ amount, frequency, projectId }: RecurringPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const annualTotal = getAnnualTotal(amount, frequency);
  const taxReduction = annualTotal * 0.66;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);
    setError('');

    try {
      // Create a PaymentMethod from the card
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (pmError) {
        setError(pmError.message ?? 'Erreur lors de la creation du moyen de paiement');
        setLoading(false);
        return;
      }

      // Create the recurrence on our backend
      const res = await recurrencesApi.create({
        amount,
        frequency,
        projectId: projectId || undefined,
        paymentMethodId: paymentMethod.id,
      });

      const { clientSecret } = res.data;

      // Confirm the first payment if a clientSecret is returned
      if (clientSecret) {
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (confirmError) {
          setError(confirmError.message ?? 'Erreur lors de la confirmation du paiement');
          setLoading(false);
          return;
        }
      }

      // Redirect to confirmation page
      const params = new URLSearchParams({
        type: 'recurrent',
        amount: String(amount),
        frequency,
      });
      router.push(`/don/confirmation?${params.toString()}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Summary */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            Don {getFrequencyLabel(frequency).toLowerCase()}
          </span>
          <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
            {amount.toFixed(2)} &euro;
          </span>
        </div>
        <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
          Soit {annualTotal.toFixed(2)} &euro; par an, dont{' '}
          {taxReduction.toFixed(2)} &euro; de reduction d&apos;impot (66%).
        </p>
      </div>

      {/* Card input */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Informations de carte bancaire
        </label>
        <div className="mt-2 rounded-lg border border-zinc-300 p-3 dark:border-zinc-700 dark:bg-zinc-800">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400"
        >
          {error}
        </div>
      )}

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Votre carte sera debitee automatiquement chaque{' '}
        {frequency === 'MONTHLY'
          ? 'mois'
          : frequency === 'QUARTERLY'
            ? 'trimestre'
            : 'annee'}
        . Vous pouvez mettre en pause ou annuler a tout moment depuis votre
        espace donateur.
      </p>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-lg bg-rose-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Mise en place du don recurrent...
          </span>
        ) : (
          `Confirmer le don recurrent de ${amount.toFixed(2)} \u20ac / ${
            frequency === 'MONTHLY'
              ? 'mois'
              : frequency === 'QUARTERLY'
                ? 'trimestre'
                : 'an'
          }`
        )}
      </button>
    </form>
  );
}

// ── Main page component ──

export default function DonRecurrentPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState(20);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('MONTHLY');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/projects?status=ACTIVE`
    )
      .then((r) => r.json())
      .then((res) => setProjects(res.data || []))
      .catch(() => {});
  }, []);

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;
  const annualTotal = getAnnualTotal(finalAmount, frequency);
  const taxReduction = annualTotal * 0.66;

  const handleStep1Submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!finalAmount || finalAmount < 5 || finalAmount > 50000) {
        setError('Le montant doit etre entre 5 et 50 000 EUR');
        return;
      }
      setError('');
      setStep(2);
    },
    [finalAmount]
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-rose-50 to-white py-16 dark:from-rose-950/20 dark:to-zinc-950">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/50">
            <RefreshCw className="h-7 w-7 text-rose-600 dark:text-rose-400" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Don recurrent
          </h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
            Soutenez nos actions de facon reguliere. Un don recurrent nous
            permet de planifier et perenniser nos projets.
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Modifiable a tout moment
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              Reduction fiscale 66%
            </span>
          </div>
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
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                          ? 'border-rose-600 bg-rose-50 text-rose-700 dark:border-rose-500 dark:bg-rose-950/30 dark:text-rose-400'
                          : 'border-zinc-300 text-zinc-700 hover:border-rose-300 dark:border-zinc-700 dark:text-zinc-300'
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
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    aria-label="Montant personnalise en euros"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Frequence
                </h2>
                <fieldset className="mt-4">
                  <legend className="sr-only">
                    Choisissez la frequence de votre don
                  </legend>
                  <div className="grid grid-cols-3 gap-3">
                    {FREQUENCIES.map((freq) => (
                      <label
                        key={freq.value}
                        className={`cursor-pointer rounded-lg border px-4 py-3 text-center text-sm font-medium transition-colors ${
                          frequency === freq.value
                            ? 'border-rose-600 bg-rose-50 text-rose-700 dark:border-rose-500 dark:bg-rose-950/30 dark:text-rose-400'
                            : 'border-zinc-300 text-zinc-700 hover:border-rose-300 dark:border-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="frequency"
                          value={freq.value}
                          checked={frequency === freq.value}
                          onChange={() => setFrequency(freq.value)}
                          className="sr-only"
                        />
                        {freq.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Project selection */}
              {projects.length > 0 && (
                <div>
                  <label
                    htmlFor="project-select"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Soutenir un projet (optionnel)
                  </label>
                  <select
                    id="project-select"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
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

              {/* Annual projection */}
              {finalAmount > 0 && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
                  <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Projection annuelle
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Total annuel
                      </p>
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                        {annualTotal.toFixed(2)} &euro;
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Reduction fiscale (66%)
                      </p>
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                        -{taxReduction.toFixed(2)} &euro;
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                    Cout reel apres reduction : {(annualTotal - taxReduction).toFixed(2)} &euro; / an
                  </p>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-rose-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-700"
              >
                Passer au paiement -{' '}
                {finalAmount.toFixed(2)} &euro; /{' '}
                {frequency === 'MONTHLY'
                  ? 'mois'
                  : frequency === 'QUARTERLY'
                    ? 'trimestre'
                    : 'an'}
              </button>

              {/* Link to one-time donation */}
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Vous preferez faire un don ponctuel ?{' '}
                <a
                  href="/faire-un-don"
                  className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  Don unique
                </a>
              </p>
            </form>
          )}

          {step === 2 && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-zinc-500 hover:text-rose-600 dark:text-zinc-400"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Modifier les options
                </button>
              </div>
              <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Paiement securise
              </h2>
              {stripePromise ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#e11d48',
                        colorBackground: '#ffffff',
                        colorText: '#18181b',
                        fontFamily: 'system-ui, sans-serif',
                        borderRadius: '8px',
                      },
                    },
                    locale: 'fr',
                  }}
                >
                  <RecurringPaymentForm
                    amount={finalAmount}
                    frequency={frequency}
                    projectId={projectId}
                  />
                </Elements>
              ) : (
                <div
                  role="alert"
                  className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400"
                >
                  Le systeme de paiement n&apos;est pas configure. Veuillez
                  reessayer plus tard.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
