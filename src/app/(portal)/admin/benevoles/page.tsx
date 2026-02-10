'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  UserCheck,
  UserX,
  Pause,
  X,
} from 'lucide-react';
import { volunteersApi } from '@/services/volunteers';
import type { Volunteer, VolunteerStatus } from '@/types';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Tous les statuts' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'APPROVED', label: 'Approuve' },
  { value: 'REJECTED', label: 'Refuse' },
  { value: 'PAUSED', label: 'En pause' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-400/30',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-400/30',
  REJECTED: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-950/50 dark:text-red-400 dark:ring-red-400/30',
  PAUSED: 'bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-400/30',
};

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  APPROVED: 'Approuve',
  REJECTED: 'Refuse',
  PAUSED: 'En pause',
};

const dayLabels: Record<string, string> = {
  lundi: 'Lun',
  mardi: 'Mar',
  mercredi: 'Mer',
  jeudi: 'Jeu',
  vendredi: 'Ven',
  samedi: 'Sam',
  dimanche: 'Dim',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function AdminBenevolesPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const limit = 25;

  const fetchVolunteers = useCallback(
    async (p: number, s: string, st: string) => {
      setLoading(true);
      try {
        const res = await volunteersApi.getAll({
          page: p,
          limit,
          search: s || undefined,
          status: st || undefined,
        });
        setVolunteers(res.data);
        setTotalPages(res.meta.totalPages);
        setTotal(res.meta.total);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchVolunteers(page, search, statusFilter);
  }, [page, statusFilter, fetchVolunteers]);

  // Debounced search
  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchVolunteers(1, value, statusFilter);
    }, 300);
  }

  // Close action menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActionMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleAction(volunteerId: string, action: 'approve' | 'reject' | 'pause') {
    setActionLoading(true);
    try {
      if (action === 'approve') await volunteersApi.approve(volunteerId);
      else if (action === 'reject') await volunteersApi.reject(volunteerId);
      else if (action === 'pause') await volunteersApi.pause(volunteerId);
      await fetchVolunteers(page, search, statusFilter);
    } catch {
      // silently handle
    } finally {
      setActionLoading(false);
      setActionMenuId(null);
    }
  }

  async function openDetail(volunteer: Volunteer) {
    try {
      const res = await volunteersApi.getOne(volunteer.id);
      setSelectedVolunteer(res.data);
    } catch {
      setSelectedVolunteer(volunteer);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Gestion des benevoles
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {total} benevole{total !== 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        ) : volunteers.length === 0 ? (
          <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Aucun benevole trouve.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Nom
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Email
                </th>
                <th className="hidden whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 md:table-cell">
                  Competences
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Statut
                </th>
                <th className="hidden whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 sm:table-cell">
                  Date candidature
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr
                  key={v.id}
                  className="cursor-pointer border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                  onClick={() => openDetail(v)}
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                    {v.firstName} {v.lastName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {v.email}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {v.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {skill}
                        </span>
                      ))}
                      {v.skills.length > 3 && (
                        <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500">
                          +{v.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusColors[v.status] || statusColors.PENDING}`}
                    >
                      {statusLabels[v.status] || v.status}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-zinc-500 dark:text-zinc-400 sm:table-cell">
                    {formatDate(v.createdAt)}
                  </td>
                  <td
                    className="relative whitespace-nowrap px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setActionMenuId(actionMenuId === v.id ? null : v.id)
                      }
                      className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                      aria-label={`Actions pour ${v.firstName} ${v.lastName}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {actionMenuId === v.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-4 top-full z-20 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
                      >
                        {v.status === 'PENDING' && (
                          <>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleAction(v.id, 'approve')}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              Approuver
                            </button>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleAction(v.id, 'reject')}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
                            >
                              <UserX className="h-3.5 w-3.5" />
                              Refuser
                            </button>
                          </>
                        )}
                        {v.status === 'APPROVED' && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleAction(v.id, 'pause')}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
                          >
                            <Pause className="h-3.5 w-3.5" />
                            Mettre en pause
                          </button>
                        )}
                        {v.status === 'PAUSED' && (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleAction(v.id, 'approve')}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            Reactiver
                          </button>
                        )}
                        {v.status === 'REJECTED' && (
                          <div className="px-3 py-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                            Aucune action disponible
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Page {page} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Precedent
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail slide-over */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedVolunteer(null)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="relative w-full max-w-lg bg-white shadow-xl dark:bg-zinc-900">
            <div className="flex h-full flex-col overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Fiche benevole
                </h2>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6 px-6 py-6">
                {/* Identity */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Identite
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      <span className="font-medium">Nom :</span>{' '}
                      {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                    </p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      <span className="font-medium">Email :</span>{' '}
                      {selectedVolunteer.email}
                    </p>
                    {selectedVolunteer.phone && (
                      <p className="text-sm text-zinc-900 dark:text-zinc-100">
                        <span className="font-medium">Telephone :</span>{' '}
                        {selectedVolunteer.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Statut
                  </h3>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusColors[selectedVolunteer.status] || statusColors.PENDING}`}
                    >
                      {statusLabels[selectedVolunteer.status] || selectedVolunteer.status}
                    </span>
                    {selectedVolunteer.approvedAt && (
                      <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                        Approuve le {formatDate(selectedVolunteer.approvedAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Competences
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedVolunteer.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-400/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availabilities */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Disponibilites
                  </h3>
                  <div className="mt-2 space-y-1">
                    {Object.entries(selectedVolunteer.availabilities).length === 0 ? (
                      <p className="text-sm text-zinc-400 dark:text-zinc-500">
                        Aucune disponibilite renseignee.
                      </p>
                    ) : (
                      Object.entries(selectedVolunteer.availabilities).map(([day, slots]) => (
                        <div key={day} className="flex items-center gap-2 text-sm">
                          <span className="w-10 font-medium text-zinc-700 dark:text-zinc-300">
                            {dayLabels[day] || day}
                          </span>
                          <div className="flex gap-1">
                            {(slots as string[]).map((slot) => (
                              <span
                                key={slot}
                                className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Motivation */}
                {selectedVolunteer.motivation && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Motivation
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {selectedVolunteer.motivation}
                    </p>
                  </div>
                )}

                {/* Coordinator notes */}
                {selectedVolunteer.coordinatorNotes && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Notes du coordinateur
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {selectedVolunteer.coordinatorNotes}
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Dates
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <p>Candidature : {formatDate(selectedVolunteer.createdAt)}</p>
                    <p>Derniere mise a jour : {formatDate(selectedVolunteer.updatedAt)}</p>
                  </div>
                </div>

                {/* Assignments */}
                {selectedVolunteer.assignments && selectedVolunteer.assignments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      Missions ({selectedVolunteer.assignments.length})
                    </h3>
                    <div className="mt-2 space-y-2">
                      {selectedVolunteer.assignments.map((a) => (
                        <div
                          key={a.id}
                          className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                        >
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {a.event?.title || a.project?.name || 'Mission'}
                          </p>
                          {a.role && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              Role : {a.role}
                            </p>
                          )}
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Statut : {a.status}
                            {a.completedAt && ` - Termine le ${formatDate(a.completedAt)}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
                <div className="flex gap-2">
                  {selectedVolunteer.status === 'PENDING' && (
                    <>
                      <button
                        disabled={actionLoading}
                        onClick={async () => {
                          await handleAction(selectedVolunteer.id, 'approve');
                          setSelectedVolunteer(null);
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <UserCheck className="h-4 w-4" />
                        Approuver
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={async () => {
                          await handleAction(selectedVolunteer.id, 'reject');
                          setSelectedVolunteer(null);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        <UserX className="h-4 w-4" />
                        Refuser
                      </button>
                    </>
                  )}
                  {selectedVolunteer.status === 'APPROVED' && (
                    <button
                      disabled={actionLoading}
                      onClick={async () => {
                        await handleAction(selectedVolunteer.id, 'pause');
                        setSelectedVolunteer(null);
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <Pause className="h-4 w-4" />
                      Mettre en pause
                    </button>
                  )}
                  {selectedVolunteer.status === 'PAUSED' && (
                    <button
                      disabled={actionLoading}
                      onClick={async () => {
                        await handleAction(selectedVolunteer.id, 'approve');
                        setSelectedVolunteer(null);
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <UserCheck className="h-4 w-4" />
                      Reactiver
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedVolunteer(null)}
                    className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
