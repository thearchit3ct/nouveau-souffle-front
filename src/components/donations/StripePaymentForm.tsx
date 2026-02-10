'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';

interface StripePaymentFormProps {
  donationId: string;
  amount: number;
}

export function StripePaymentForm({ donationId, amount }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/don/confirmation?donation=${donationId}`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? 'Une erreur est survenue');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/20">
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          Votre don de <strong>{amount.toFixed(2)} &euro;</strong> vous ouvre droit a une
          reduction d&apos;impot de <strong>{(amount * 0.66).toFixed(2)} &euro;</strong> (66%).
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Traitement en cours...
          </span>
        ) : (
          `Confirmer le don de ${amount.toFixed(2)} \u20ac`
        )}
      </button>
    </form>
  );
}
