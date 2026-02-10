'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import { Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await EmailPassword.sendPasswordResetEmail({
        formFields: [{ id: 'email', value: email }],
      });

      if (response.status === 'FIELD_ERROR') {
        const fieldError = response.formFields.find((f) => f.error)?.error;
        setError(fieldError || 'Adresse email invalide.');
      } else if (response.status === 'OK') {
        setSuccess(true);
      }
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Email envoye
        </h2>
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          Si un compte existe avec cette adresse, vous recevrez un lien de reinitialisation.
        </p>
        <Link
          href="/auth/login"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Retour a la connexion
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2 text-center text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Mot de passe oublie
      </h2>
      <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Entrez votre adresse email pour recevoir un lien de reinitialisation.
      </p>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Envoyer le lien
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/auth/login" className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
          Retour a la connexion
        </Link>
      </p>
    </div>
  );
}
