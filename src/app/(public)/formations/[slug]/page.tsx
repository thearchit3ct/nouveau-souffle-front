'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { GraduationCap, Clock, BookOpen, CheckCircle, Circle, Play, FileText, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/services/api';

interface Module {
  id: string;
  title: string;
  type: string;
  content?: string;
  fileUrl?: string;
  duration?: number;
  sortOrder: number;
}

interface Training {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  duration?: number;
  difficulty: string;
  tags: string[];
  modules?: Module[];
  _count?: { enrollments: number };
}

interface Enrollment {
  id: string;
  status: string;
  progress: number;
  completions?: { moduleId: string }[];
}

const MODULE_ICONS: Record<string, any> = {
  VIDEO: Play,
  PDF: FileText,
  TEXT: BookOpen,
  QUIZ: CheckCircle,
};

export default function TrainingDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [training, setTraining] = useState<Training | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [completingModule, setCompletingModule] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch<{ data: Training }>(`/api/v1/trainings/${slug}`);
        setTraining(res.data);
        // Try to get enrollment (will fail if not logged in or not enrolled)
        try {
          const enrollRes = await apiFetch<{ data: Enrollment }>(`/api/v1/trainings/${res.data.id}/enrollment`);
          setEnrollment(enrollRes.data);
        } catch { /* not enrolled or not logged in */ }
      } catch { /* training not found */ }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  const handleEnroll = async () => {
    if (!training) return;
    setEnrolling(true);
    try {
      const res = await apiFetch<{ data: Enrollment }>(`/api/v1/trainings/${training.id}/enroll`, { method: 'POST' });
      setEnrollment(res.data);
    } catch { alert('Veuillez vous connecter pour vous inscrire.'); }
    setEnrolling(false);
  };

  const handleCompleteModule = async (moduleId: string) => {
    if (!enrollment) return;
    setCompletingModule(moduleId);
    try {
      const res = await apiFetch<{ data: Enrollment }>(
        `/api/v1/trainings/enrollments/${enrollment.id}/modules/${moduleId}/complete`,
        { method: 'POST' },
      );
      setEnrollment(res.data);
    } catch { /* already completed */ }
    setCompletingModule(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!training) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-zinc-500">
        Formation non trouvee.
      </div>
    );
  }

  const completedModules = new Set(enrollment?.completions?.map(c => c.moduleId) ?? []);
  const modules = (training.modules ?? []).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/formations" className="mb-6 flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700">
        <ArrowLeft className="h-4 w-4" />
        Retour aux formations
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{training.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
            {training.difficulty}
          </span>
          {training.duration && (
            <span className="flex items-center gap-1 text-sm text-zinc-500">
              <Clock className="h-4 w-4" />
              {training.duration} min
            </span>
          )}
          <span className="text-sm text-zinc-500">{modules.length} modules</span>
        </div>
        {training.description && (
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">{training.description}</p>
        )}
      </div>

      {/* Enrollment status / Enroll button */}
      {enrollment ? (
        <div className="mb-8 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {enrollment.status === 'COMPLETED' ? 'Formation terminee !' : 'En cours'}
            </span>
            <span className="text-sm text-emerald-600">{enrollment.progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-emerald-200 dark:bg-emerald-900">
            <div
              className="h-2 rounded-full bg-emerald-600 transition-all"
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={handleEnroll}
          disabled={enrolling}
          className="mb-8 flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {enrolling ? <Loader2 className="h-4 w-4 animate-spin" /> : <GraduationCap className="h-4 w-4" />}
          S&apos;inscrire a cette formation
        </button>
      )}

      {/* Modules list */}
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Modules</h2>
      <div className="space-y-3">
        {modules.map((mod, idx) => {
          const Icon = MODULE_ICONS[mod.type] || BookOpen;
          const isCompleted = completedModules.has(mod.id);

          return (
            <div
              key={mod.id}
              className={`flex items-center gap-4 rounded-lg border p-4 ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20'
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-500 dark:bg-zinc-800">
                {idx + 1}
              </div>
              <Icon className={`h-5 w-5 ${isCompleted ? 'text-emerald-600' : 'text-zinc-400'}`} />
              <div className="flex-1">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{mod.title}</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <span>{mod.type}</span>
                  {mod.duration && <span>{mod.duration} min</span>}
                </div>
              </div>
              {enrollment && !isCompleted && (
                <button
                  onClick={() => handleCompleteModule(mod.id)}
                  disabled={completingModule === mod.id}
                  className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {completingModule === mod.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Terminer'}
                </button>
              )}
              {isCompleted && (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
