'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleResend() {
    setResending(true);
    try {
      // SuperTokens handles email verification resend via the session
      // The backend sends the email automatically on sign-up
      // This is a UX placeholder; in production the backend endpoint handles resend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResent(true);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
        <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      </div>

      <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Verifiez votre email
      </h2>

      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Nous avons envoye un lien de verification a votre adresse email.
        Cliquez sur le lien pour activer votre compte.
      </p>

      <div className="space-y-3">
        {resent ? (
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Email renvoye
          </div>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {resending && <Loader2 className="h-4 w-4 animate-spin" />}
            Renvoyer l&apos;email
          </button>
        )}

        <Link
          href="/auth/login"
          className="block text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Retour a la connexion
        </Link>
      </div>
    </div>
  );
}
