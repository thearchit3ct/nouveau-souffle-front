'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, Search, ChevronLeft, ChevronRight, MoreHorizontal, ShieldCheck, Ban, UserCheck } from 'lucide-react';
import { usersApi } from '@/services/users';
import type { User, UserRole, UserStatus } from '@/types';

const ALL_ROLES: { value: string; label: string }[] = [
  { value: '', label: 'Tous les roles' },
  { value: 'ANONYMOUS', label: 'Anonyme' },
  { value: 'DONOR', label: 'Donateur' },
  { value: 'MEMBER', label: 'Membre' },
  { value: 'VOLUNTEER', label: 'Benevole' },
  { value: 'COORDINATOR', label: 'Coordinateur' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
];

const ALL_STATUSES: { value: string; label: string }[] = [
  { value: '', label: 'Tous les statuts' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'SUSPENDED', label: 'Suspendu' },
  { value: 'INACTIVE', label: 'Inactif' },
];

const roleColors: Record<string, string> = {
  ANONYMOUS: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  DONOR: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  MEMBER: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  VOLUNTEER: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400',
  COORDINATOR: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',
  ADMIN: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  SUPER_ADMIN: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  ACTIVE: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  SUSPENDED: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  INACTIVE: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  DELETED: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

const roleLabels: Record<string, string> = {
  ANONYMOUS: 'Anonyme',
  DONOR: 'Donateur',
  MEMBER: 'Membre',
  VOLUNTEER: 'Benevole',
  COORDINATOR: 'Coordinateur',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
};

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  ACTIVE: 'Actif',
  SUSPENDED: 'Suspendu',
  INACTIVE: 'Inactif',
  DELETED: 'Supprime',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const limit = 25;

  const fetchUsers = useCallback(
    async (p: number, s: string, r: string, st: string) => {
      setLoading(true);
      try {
        const res = await usersApi.getAll({
          page: p,
          limit,
          search: s || undefined,
          role: r || undefined,
          status: st || undefined,
        });
        setUsers(res.data);
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
    fetchUsers(page, search, roleFilter, statusFilter);
  }, [page, roleFilter, statusFilter, fetchUsers]);

  // Debounced search
  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchUsers(1, value, roleFilter, statusFilter);
    }, 300);
  }

  // Close menu on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActionMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleRoleChange(userId: string, newRole: string) {
    setActionLoading(true);
    try {
      await usersApi.updateRole(userId, newRole);
      await fetchUsers(page, search, roleFilter, statusFilter);
    } catch {
      // silently handle
    } finally {
      setActionLoading(false);
      setActionMenuId(null);
    }
  }

  async function handleStatusToggle(userId: string, currentStatus?: string) {
    setActionLoading(true);
    const newStatus = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    try {
      await usersApi.updateStatus(userId, newStatus);
      await fetchUsers(page, search, roleFilter, statusFilter);
    } catch {
      // silently handle
    } finally {
      setActionLoading(false);
      setActionMenuId(null);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Gestion des utilisateurs
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {total} utilisateur{total !== 1 ? 's' : ''} au total
        </p>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Rechercher par email, prenom ou nom..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
        >
          {ALL_ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
        >
          {ALL_STATUSES.map((s) => (
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
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Aucun utilisateur trouve.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Email
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Nom complet
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Role
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Statut
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Inscription
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-900 dark:text-zinc-100">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-900 dark:text-zinc-100">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${roleColors[user.role] || roleColors.ANONYMOUS}`}
                    >
                      {roleLabels[user.role] || user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${statusColors[user.status || 'PENDING'] || statusColors.PENDING}`}
                    >
                      {statusLabels[user.status || 'PENDING'] || user.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="relative whitespace-nowrap px-4 py-3">
                    <button
                      onClick={() =>
                        setActionMenuId(actionMenuId === user.id ? null : user.id)
                      }
                      className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {actionMenuId === user.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-4 top-full z-20 mt-1 w-56 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
                      >
                        {/* Role change */}
                        <div className="px-3 py-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                          Changer le role
                        </div>
                        {ALL_ROLES.filter((r) => r.value && r.value !== user.role).map(
                          (r) => (
                            <button
                              key={r.value}
                              disabled={actionLoading}
                              onClick={() => handleRoleChange(user.id, r.value)}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              {r.label}
                            </button>
                          ),
                        )}

                        <div className="my-1 border-t border-zinc-200 dark:border-zinc-700" />

                        {/* Status toggle */}
                        <button
                          disabled={actionLoading}
                          onClick={() => handleStatusToggle(user.id, user.status)}
                          className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm disabled:opacity-50 ${
                            user.status === 'SUSPENDED'
                              ? 'text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                              : 'text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30'
                          }`}
                        >
                          {user.status === 'SUSPENDED' ? (
                            <>
                              <UserCheck className="h-3.5 w-3.5" />
                              Reactiver
                            </>
                          ) : (
                            <>
                              <Ban className="h-3.5 w-3.5" />
                              Suspendre
                            </>
                          )}
                        </button>
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
    </div>
  );
}
