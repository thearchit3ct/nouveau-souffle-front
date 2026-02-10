'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { eventsApi } from '@/services/events';
import type { Event as EventType, UpdateEventData, EventStatus } from '@/types';

const EVENT_TYPES = [
  { value: 'MEETING', label: 'Reunion' },
  { value: 'WORKSHOP', label: 'Atelier' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'CULTURAL', label: 'Culturel' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'FUNDRAISING', label: 'Collecte de fonds' },
  { value: 'OTHER', label: 'Autre' },
];

const VISIBILITY_OPTIONS = [
  { value: 'PUBLIC', label: 'Public' },
  { value: 'MEMBERS', label: 'Membres uniquement' },
];

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'PUBLISHED', label: 'Publie' },
];

function toLocalDatetime(isoString: string): string {
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('MEETING');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [status, setStatus] = useState<EventStatus>('DRAFT');
  const [startDatetime, setStartDatetime] = useState('');
  const [endDatetime, setEndDatetime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [program, setProgram] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await eventsApi.getOne(id);
        const ev = res.data;
        setEvent(ev);
        setTitle(ev.title);
        setDescription(ev.description || '');
        setType(ev.type || 'MEETING');
        setVisibility(ev.visibility || 'PUBLIC');
        setStatus(ev.status);
        setStartDatetime(toLocalDatetime(ev.startDatetime));
        setEndDatetime(ev.endDatetime ? toLocalDatetime(ev.endDatetime) : '');
        setLocationName(ev.locationName || '');
        setLocationAddress(ev.locationAddress || '');
        setCapacity(ev.capacity ? String(ev.capacity) : '');
        setPrice(ev.price ? String(ev.price) : '');
        setIsFree(ev.isFree);
        setImageUrl(ev.imageUrl || '');
        setProgram(ev.program || '');
      } catch {
        setLoadError('Erreur lors du chargement de l\'evenement.');
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Le titre est requis.');
      return;
    }
    if (!startDatetime) {
      setError('La date de debut est requise.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const data: UpdateEventData = {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        visibility,
        status,
        startDatetime: new Date(startDatetime).toISOString(),
        endDatetime: endDatetime ? new Date(endDatetime).toISOString() : undefined,
        locationName: locationName.trim() || undefined,
        locationAddress: locationAddress.trim() || undefined,
        capacity: capacity ? Number(capacity) : undefined,
        price: !isFree && price ? Number(price) : undefined,
        isFree,
        imageUrl: imageUrl.trim() || undefined,
        program: program.trim() || undefined,
      };
      await eventsApi.update(id, data);
      router.push('/admin/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise a jour.');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (loadError || !event) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-800 dark:bg-red-950/50">
        <p className="text-sm text-red-700 dark:text-red-400">
          {loadError || 'Evenement non trouve.'}
        </p>
      </div>
    );
  }

  const inputClass =
    'mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500';
  const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-300';

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Editer l&apos;evenement
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Status */}
          <div>
            <label htmlFor="status" className={labelClass}>
              Statut
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Titre *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="Titre de l'evenement"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="Description de l'evenement"
            />
          </div>

          {/* Type + Visibility */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className={labelClass}>
                Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputClass}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="visibility" className={labelClass}>
                Visibilite
              </label>
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className={inputClass}
              >
                {VISIBILITY_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start + End datetimes */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="startDatetime" className={labelClass}>
                Date et heure de debut *
              </label>
              <input
                type="datetime-local"
                id="startDatetime"
                value={startDatetime}
                onChange={(e) => setStartDatetime(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="endDatetime" className={labelClass}>
                Date et heure de fin
              </label>
              <input
                type="datetime-local"
                id="endDatetime"
                value={endDatetime}
                onChange={(e) => setEndDatetime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="locationName" className={labelClass}>
                Nom du lieu
              </label>
              <input
                type="text"
                id="locationName"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className={inputClass}
                placeholder="ex: Salle des fetes"
              />
            </div>
            <div>
              <label htmlFor="locationAddress" className={labelClass}>
                Adresse
              </label>
              <input
                type="text"
                id="locationAddress"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className={inputClass}
                placeholder="ex: 12 rue de la Paix, 75001 Paris"
              />
            </div>
          </div>

          {/* Capacity + Price + isFree */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="capacity" className={labelClass}>
                Capacite
              </label>
              <input
                type="number"
                id="capacity"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className={inputClass}
                placeholder="Nombre de places"
              />
            </div>
            <div>
              <label htmlFor="price" className={labelClass}>
                Prix (EUR)
              </label>
              <input
                type="number"
                id="price"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isFree}
                className={`${inputClass} ${isFree ? 'opacity-50' : ''}`}
                placeholder="0.00"
              />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={isFree}
                  onChange={(e) => {
                    setIsFree(e.target.checked);
                    if (e.target.checked) setPrice('');
                  }}
                  className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800"
                />
                <label htmlFor="isFree" className="text-sm text-zinc-700 dark:text-zinc-300">
                  Evenement gratuit
                </label>
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className={labelClass}>
              URL de l&apos;image
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          {/* Program */}
          <div>
            <label htmlFor="program" className={labelClass}>
              Programme
            </label>
            <textarea
              id="program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              rows={6}
              className={inputClass}
              placeholder="Deroulement de l'evenement..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Enregistrer les modifications
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/events')}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
