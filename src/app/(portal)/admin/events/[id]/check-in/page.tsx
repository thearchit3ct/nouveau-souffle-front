'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/services/api';
import { QrCode, CheckCircle, XCircle, Search, Loader2, UserCheck } from 'lucide-react';

// Minimal type for the response
interface RegistrationInfo {
  id: string;
  status: string;
  checkedInAt?: string;
  confirmationToken?: string;
  event?: { title: string; startDatetime: string; locationName?: string };
  user?: { firstName: string; lastName: string; email: string };
}

export default function CheckInPage() {
  const params = useParams();
  const eventId = params.id as string;
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [registration, setRegistration] = useState<RegistrationInfo | null>(null);
  const [error, setError] = useState('');
  const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [checkInMessage, setCheckInMessage] = useState('');

  const searchByToken = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setError('');
    setRegistration(null);
    setCheckInStatus('idle');
    try {
      const res = await apiFetch<{ data: RegistrationInfo }>(`/api/v1/events/registrations/by-token/${token.trim()}`);
      setRegistration(res.data);
    } catch (err: any) {
      setError(err?.body?.message || 'Inscription non trouvee');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!token.trim()) return;
    setLoading(true);
    setCheckInStatus('idle');
    try {
      await apiFetch(`/api/v1/events/registrations/by-token/${token.trim()}/check-in`, { method: 'PATCH' });
      setCheckInStatus('success');
      setCheckInMessage('Participant pointe avec succes !');
      // Update local state
      if (registration) {
        setRegistration({ ...registration, checkedInAt: new Date().toISOString() });
      }
    } catch (err: any) {
      setCheckInStatus('error');
      setCheckInMessage(err?.body?.message || 'Erreur lors du pointage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <QrCode className="h-6 w-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Pointage QR Code</h1>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          Scannez le QR code du participant ou entrez manuellement son token de confirmation.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchByToken()}
            placeholder="Token de confirmation (UUID)..."
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            onClick={searchByToken}
            disabled={loading || !token.trim()}
            className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Rechercher
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
            <XCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>

      {registration && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Inscription trouvee</h2>

          <div className="space-y-3 text-sm">
            {registration.user && (
              <div>
                <span className="font-medium text-zinc-500 dark:text-zinc-400">Participant : </span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {registration.user.firstName} {registration.user.lastName}
                </span>
              </div>
            )}
            {registration.user?.email && (
              <div>
                <span className="font-medium text-zinc-500 dark:text-zinc-400">Email : </span>
                <span className="text-zinc-900 dark:text-zinc-100">{registration.user.email}</span>
              </div>
            )}
            {registration.event && (
              <div>
                <span className="font-medium text-zinc-500 dark:text-zinc-400">Evenement : </span>
                <span className="text-zinc-900 dark:text-zinc-100">{registration.event.title}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-zinc-500 dark:text-zinc-400">Statut : </span>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                registration.status === 'CONFIRMED'
                  ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
                  : registration.status === 'WAITLISTED'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
              }`}>
                {registration.status}
              </span>
            </div>
            {registration.checkedInAt && (
              <div>
                <span className="font-medium text-zinc-500 dark:text-zinc-400">Deja pointe : </span>
                <span className="text-emerald-600">{new Date(registration.checkedInAt).toLocaleString('fr-FR')}</span>
              </div>
            )}
          </div>

          {!registration.checkedInAt && registration.status === 'CONFIRMED' && (
            <button
              onClick={handleCheckIn}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
              Confirmer le pointage
            </button>
          )}

          {checkInStatus === 'success' && (
            <div className="mt-4 flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/50 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              {checkInMessage}
            </div>
          )}

          {checkInStatus === 'error' && (
            <div className="mt-4 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
              <XCircle className="h-4 w-4" />
              {checkInMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
