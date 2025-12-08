'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserMenu } from '@/components/dashboard/UserMenu';
import {
  LayoutDashboard,
  Phone,
  Settings,
  Users,
  BarChart2,
  Menu,
  X,
  Bell,
  Search,
  Upload,
  FileAudio,
  CreditCard,
} from 'lucide-react';
import { UsageAlert } from '@/components/dashboard/UsageAlert';
import { Logo } from '@/components/Logo';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/40 to-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50/40 to-gray-50 overflow-hidden">
      {/* Header */}
      <header className={`fixed top-0 right-0 left-0 z-50 bg-white ${scrolled ? 'shadow-md' : 'shadow-sm'} transition-shadow duration-300`}>
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Left section */}
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 transition-all"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden md:flex items-center">
              <Link href="/dashboard" className="mr-6 hover:opacity-80 transition-opacity">
                <Logo size="lg" />
              </Link>
            </div>

            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search calls..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/files"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-indigo-500 hover:to-indigo-400 transition-all"
            >
              <Upload className="h-4 w-4" />
              Upload Call
            </Link>

            <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600 relative transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-indigo-500"></span>
            </button>

            <UserMenu />
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={`relative flex w-full max-w-xs flex-1 flex-col bg-white transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
              <Logo size="lg" />
            </Link>
            <button
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 px-4 py-6">
            <nav className="space-y-1.5">
              <SidebarLink href="/dashboard" active={pathname === '/dashboard'} icon={<LayoutDashboard className="h-5 w-5" />}>
                Overview
              </SidebarLink>
              <SidebarLink href="/dashboard/calls" active={pathname === '/dashboard/calls'} icon={<Phone className="h-5 w-5" />}>
                Calls
              </SidebarLink>
              <SidebarLink href="/dashboard/files" active={pathname === '/dashboard/files'} icon={<FileAudio className="h-5 w-5" />}>
                Upload
              </SidebarLink>
              <SidebarLink href="/dashboard/analytics" active={pathname === '/dashboard/analytics'} icon={<BarChart2 className="h-5 w-5" />}>
                Analytics
              </SidebarLink>
              <SidebarLink href="/dashboard/users" active={pathname === '/dashboard/users'} icon={<Users className="h-5 w-5" />}>
                Users
              </SidebarLink>
              <SidebarLink href="/dashboard/billing" active={pathname === '/dashboard/billing'} icon={<CreditCard className="h-5 w-5" />}>
                Billing
              </SidebarLink>
              <SidebarLink href="/dashboard/settings" active={pathname === '/dashboard/settings'} icon={<Settings className="h-5 w-5" />}>
                Settings
              </SidebarLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-40 pt-16">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-100 shadow-sm">
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            <nav className="flex-1 px-4 space-y-1.5">
              <SidebarLink href="/dashboard" active={pathname === '/dashboard'} icon={<LayoutDashboard className="h-5 w-5" />}>
                Overview
              </SidebarLink>
              <SidebarLink href="/dashboard/calls" active={pathname === '/dashboard/calls'} icon={<Phone className="h-5 w-5" />}>
                Calls
              </SidebarLink>
              <SidebarLink href="/dashboard/files" active={pathname === '/dashboard/files'} icon={<FileAudio className="h-5 w-5" />}>
                Upload
              </SidebarLink>
              <SidebarLink href="/dashboard/analytics" active={pathname === '/dashboard/analytics'} icon={<BarChart2 className="h-5 w-5" />}>
                Analytics
              </SidebarLink>
              <SidebarLink href="/dashboard/users" active={pathname === '/dashboard/users'} icon={<Users className="h-5 w-5" />}>
                Users
              </SidebarLink>
              <SidebarLink href="/dashboard/billing" active={pathname === '/dashboard/billing'} icon={<CreditCard className="h-5 w-5" />}>
                Billing
              </SidebarLink>
              <SidebarLink href="/dashboard/settings" active={pathname === '/dashboard/settings'} icon={<Settings className="h-5 w-5" />}>
                Settings
              </SidebarLink>
            </nav>
          </div>

          {/* Plan badge */}
          <div className="p-4">
            <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-400 p-0.5">
              <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">PRO</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Pro Plan</p>
                  <p className="text-xs text-gray-500">Premium Features</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64 pt-16">
        <main>
          <UsageAlert />
          {children}
        </main>
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
      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
        ${active
          ? 'bg-gradient-to-r from-indigo-50 to-indigo-100/80 text-indigo-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
        }`}
    >
      <span className={`mr-3 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      <span className="font-medium">{children}</span>
      {active && (
        <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600"></span>
      )}
    </Link>
  );
}
