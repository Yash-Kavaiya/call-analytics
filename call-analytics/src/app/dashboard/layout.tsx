'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Phone, 
  Settings, 
  Users,
  BarChart2
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-neutral-50 pt-16"> {/* Added pt-16 for header space */}
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 top-16 z-40 bg-white border-r border-neutral-200"> {/* Added top-16 */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-1">
            <SidebarLink href="/dashboard" active={pathname === '/dashboard'} icon={<LayoutDashboard className="h-5 w-5" />}>
              Overview
            </SidebarLink>
            <SidebarLink href="/dashboard/calls" active={pathname === '/dashboard/calls'} icon={<Phone className="h-5 w-5" />}>
              Calls
            </SidebarLink>
            <SidebarLink href="/dashboard/analytics" active={pathname === '/dashboard/analytics'} icon={<BarChart2 className="h-5 w-5" />}>
              Analytics
            </SidebarLink>
            <SidebarLink href="/dashboard/users" active={pathname === '/dashboard/users'} icon={<Users className="h-5 w-5" />}>
              Users
            </SidebarLink>
            <SidebarLink href="/dashboard/settings" active={pathname === '/dashboard/settings'} icon={<Settings className="h-5 w-5" />}>
              Settings
            </SidebarLink>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        {children}
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, children, active }: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg group transition-colors
        ${active 
          ? 'bg-purple-50 text-purple-600' 
          : 'text-neutral-600 hover:bg-neutral-50 hover:text-purple-600'
        }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  );
}