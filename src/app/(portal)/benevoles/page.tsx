'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  User,
  Calendar,
  FolderOpen,
  CheckCircle,
  Clock,
  Inbox,
} from 'lucide-react';
import { volunteersApi } from '@/services/volunteers';
import type { Volunteer, VolunteerAssignment } from '@/types';

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-400/30',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-400/30',
  REJECTED: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-950/50 dark:text-red-400 dark:ring-red-400/30',
  PAUSED: 'bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-400/30',
};

const statusLabels: Record<string, string> = {
  PENDING: 'En attente de validation',
  APPROVED: 'Benevole actif',
  REJECTED: 'Candidature refusee',
  PAUSED: 'Benevolat en pause',
};

const dayLabels: Record<string, string> = {
  lundi: 'Lundi',
  mardi: 'Mardi',
  mercredi: 'Mercredi',
  jeudi: 'Jeudi',
  vendredi: 'Vendredi',
  samedi: 'Samedi',
  dimanche: 'Dimanche',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function VolunteerPortalPage() {
  const [profile, setProfile] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await volunteersApi.getMyProfile();
        setProfile(res.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <User className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Espace benevole
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          Vous n&apos;avez pas encore de profil benevole. Soumettez votre candidature
          pour rejoindre notre equipe.
        </p>
        <a
          href="/benevoles"
          className="mt-6 inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Devenir benevole
        </a>
      </div>
    );
  }

  const activeAssignments = (profile.assignments || []).filter(
    (a) => !a.completedAt && a.status !== 'COMPLETED'
  );
  const completedAssignments = (profile.assignments || []).filter(
    (a) => a.completedAt || a.status === 'COMPLETED'
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Mon espace benevole
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Consultez votre profil et suivez vos missions.
        </p>
      </div>

      {/* Profile summary */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {profile.email}
                </p>
              </div>
            </div>
            {profile.phone && (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                Telephone : {profile.phone}
              </p>
            )}
          </div>
          <div>
            <span
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${statusColors[profile.status] || statusColors.PENDING}`}
            >
              {statusLabels[profile.status] || profile.status}
            </span>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Membre depuis le {formatDate(profile.createdAt)}
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Competences
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => (
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
        <div className="mt-6">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Disponibilites
          </h3>
          <div className="mt-2 space-y-1">
            {Object.entries(profile.availabilities).length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                Aucune disponibilite renseignee.
              </p>
            ) : (
              Object.entries(profile.availabilities).map(([day, slots]) => (
                <div key={day} className="flex items-center gap-3 text-sm">
                  <span className="w-20 font-medium text-zinc-700 dark:text-zinc-300">
                    {dayLabels[day] || day}
                  </span>
                  <div className="flex gap-1.5">
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
      </div>

      {/* Active missions */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Missions en cours
        </h2>

        {activeAssignments.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <Inbox className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-500" />
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Vous n&apos;avez aucune mission en cours pour le moment.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {activeAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        )}
      </div>

      {/* Completed missions */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Missions terminees
        </h2>

        {completedAssignments.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <Inbox className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-500" />
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Aucune mission terminee pour le moment.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {completedAssignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} completed />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AssignmentCard({
  assignment,
  completed = false,
}: {
  assignment: VolunteerAssignment;
  completed?: boolean;
}) {
  const title = assignment.event?.title || assignment.project?.name || 'Mission';
  const isEvent = !!assignment.event;

  return (
    <div
      className={`rounded-xl border p-4 ${
        completed
          ? 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50'
          : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            isEvent
              ? 'bg-blue-50 dark:bg-blue-950/50'
              : 'bg-violet-50 dark:bg-violet-950/50'
          }`}
        >
          {isEvent ? (
            <Calendar
              className={`h-4 w-4 ${
                completed
                  ? 'text-zinc-400 dark:text-zinc-500'
                  : 'text-blue-600 dark:text-blue-400'
              }`}
            />
          ) : (
            <FolderOpen
              className={`h-4 w-4 ${
                completed
                  ? 'text-zinc-400 dark:text-zinc-500'
                  : 'text-violet-600 dark:text-violet-400'
              }`}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium ${
              completed
                ? 'text-zinc-500 dark:text-zinc-400'
                : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {title}
          </p>
          {assignment.role && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Role : {assignment.role}
            </p>
          )}
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            {completed && assignment.completedAt
              ? `Termine le ${formatDate(assignment.completedAt)}`
              : `Assigne le ${formatDate(assignment.assignedAt)}`}
          </p>
          {assignment.notes && (
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              {assignment.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
