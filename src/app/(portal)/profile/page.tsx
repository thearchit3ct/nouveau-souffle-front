'use client';

import { useEffect, useState, useRef } from 'react';
import { Loader2, Save, Upload, Camera, Lock } from 'lucide-react';
import { usersApi } from '@/services/users';
import type { User } from '@/types';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields - personal info
  const [civility, setCivility] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Form fields - address
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await usersApi.getMe();
        const u = res.data;
        setUser(u);
        setCivility(u.civility || '');
        setFirstName(u.firstName || '');
        setLastName(u.lastName || '');
        setPhone(u.phone || '');
        setBirthDate(u.birthDate ? u.birthDate.substring(0, 10) : '');
        setAddressLine1(u.addressLine1 || '');
        setAddressLine2(u.addressLine2 || '');
        setPostalCode(u.postalCode || '');
        setCity(u.city || '');
        setCountry(u.country || 'FR');
      } catch {
        setError('Impossible de charger votre profil.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await usersApi.updateMe({
        civility: civility || undefined,
        firstName,
        lastName,
        phone: phone || undefined,
        birthDate: birthDate || undefined,
        addressLine1: addressLine1 || undefined,
        addressLine2: addressLine2 || undefined,
        postalCode: postalCode || undefined,
        city: city || undefined,
        country: country || undefined,
      });
      setUser(res.data);
      setSuccess('Profil mis a jour avec succes.');
    } catch {
      setError('Erreur lors de la mise a jour du profil.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client-side
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Format accepte : JPEG, PNG ou WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Le fichier ne doit pas depasser 2 Mo.');
      return;
    }

    setUploadingAvatar(true);
    setError('');
    setSuccess('');
    try {
      const res = await usersApi.uploadAvatar(file);
      setUser(res.data);
      setSuccess('Avatar mis a jour.');
    } catch {
      setError('Erreur lors du telechargement de l\'avatar.');
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function getInitials() {
    if (!user) return '?';
    const f = (user.firstName || '').charAt(0).toUpperCase();
    const l = (user.lastName || '').charAt(0).toUpperCase();
    return f + l || '?';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Mon Profil</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Gerez vos informations personnelles.
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* ── Avatar section ── */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Photo de profil</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700 ring-2 ring-zinc-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:ring-zinc-700">
                  {getInitials()}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50 dark:border-zinc-900"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              <p>Formats acceptes : JPEG, PNG, WebP</p>
              <p>Taille maximale : 2 Mo</p>
            </div>
          </div>
        </div>

        {/* ── Account info (read-only) ── */}
        {user && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Compte</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Email</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{user.email}</p>
              </div>
              {user.memberNumber && (
                <div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">N. membre</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{user.memberNumber}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Role</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{user.role}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Inscription</p>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Editable form ── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal info */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Informations personnelles
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="civility" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Civilite
                </label>
                <select
                  id="civility"
                  value={civility}
                  onChange={(e) => setCivility(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                >
                  <option value="">Non renseigne</option>
                  <option value="M">M.</option>
                  <option value="MME">Mme</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Prenom
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Telephone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                />
              </div>
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Date de naissance
                </label>
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Adresse</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="addressLine1" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Adresse
                </label>
                <input
                  id="addressLine1"
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="10 rue de la Paix"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="addressLine2" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Complement d'adresse
                </label>
                <input
                  id="addressLine2"
                  type="text"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  placeholder="Batiment A, Apt 12"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                />
              </div>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Code postal
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="75001"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ville
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Paris"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Pays
                </label>
                <input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="FR"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Feedback messages */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Enregistrer les modifications
          </button>
        </form>

        {/* ── Security section ── */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Securite</h2>
          <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
            Gerez votre mot de passe et la securite de votre compte.
          </p>
          <button
            type="button"
            onClick={() => {
              // Placeholder: In a real implementation this would trigger
              // SuperTokens password reset flow or navigate to a reset page
              window.alert('Fonctionnalite de changement de mot de passe a venir.');
            }}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Lock className="h-4 w-4" />
            Changer le mot de passe
          </button>
        </div>
      </div>
    </div>
  );
}
