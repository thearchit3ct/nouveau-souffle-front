'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { maraudeStatsApi } from '@/services/maraude-stats';
import type { MaraudeDashboardStats } from '@/types';

export default function AdminMaraudesPage() {
  const [stats, setStats] = useState<MaraudeDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    maraudeStatsApi.getDashboard().then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Maraudes - Tableau de bord</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Maraudes actives" value={stats.activeMaraudes} color="green" />
          <StatCard label="Ce mois" value={stats.maraudesThisMonth} color="blue" />
          <StatCard label="Rencontres (mois)" value={stats.encountersThisMonth} color="purple" />
          <StatCard label="Beneficiaires" value={stats.totalBeneficiaries} color="gray" />
          <StatCard label="Nouveaux (mois)" value={stats.newBeneficiariesThisMonth} color="teal" />
          <StatCard label="Orientations en attente" value={stats.pendingReferrals} color="yellow" />
          <StatCard label="Urgences (7j)" value={stats.criticalEncounters} color="red" />
          <StatCard label="Total maraudes" value={stats.totalMaraudes} color="gray" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/maraudes/zones" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
          <h3 className="font-semibold">Gestion des zones</h3>
          <p className="text-sm text-gray-500">Creer et gerer les secteurs geographiques</p>
        </Link>
        <Link href="/admin/maraudes/categories" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
          <h3 className="font-semibold">Referentiels</h3>
          <p className="text-sm text-gray-500">Categories de besoins et actions</p>
        </Link>
        <Link href="/admin/maraudes/structures" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
          <h3 className="font-semibold">Structures partenaires</h3>
          <p className="text-sm text-gray-500">Annuaire des structures d'orientation</p>
        </Link>
        <Link href="/admin/maraudes/stats" className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
          <h3 className="font-semibold">Statistiques detaillees</h3>
          <p className="text-sm text-gray-500">Rapports activite, besoins, territoire</p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    green: 'bg-green-50 text-green-700', blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700', gray: 'bg-gray-50 text-gray-700',
    teal: 'bg-teal-50 text-teal-700', yellow: 'bg-yellow-50 text-yellow-700',
    red: 'bg-red-50 text-red-700',
  };
  return (
    <div className={`p-4 rounded-lg ${colors[color] || colors.gray}`}>
      <p className="text-sm opacity-75">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
