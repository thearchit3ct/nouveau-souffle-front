'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Session from 'supertokens-auth-react/recipe/session';
import { Shield, LayoutDashboard, CreditCard, Heart, Calendar, Loader2 } from 'lucide-react';

const adminNav = [
  { name: 'Dashboard Admin', href: '/admin', icon: LayoutDashboard },
  { name: 'Adhesions', href: '/admin/memberships', icon: CreditCard },
  { name: 'Dons', href: '/admin/donations', icon: Heart },
  { name: 'Evenements', href: '/admin/events', icon: Calendar },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkRole() {
      try {
        const payload = (await Session.getAccessTokenPayloadSecurely()) as {
          role?: string;
        };
        if (payload?.role === 'ADMIN' || payload?.role === 'SUPER_ADMIN') {
          setAuthorized(true);
        } else {
          router.replace('/dashboard');
        }
      } catch {
        router.replace('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    checkRole();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div>
      {/* Admin sub-navigation */}
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-1.5 px-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <Shield className="h-4 w-4" />
          Admin
        </div>
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
        <nav className="flex flex-1 gap-1 overflow-x-auto">
          {adminNav.map((item) => {
            const isActive =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </div>
  );
}
