'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              CallAnalytics
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link 
                href="/analytics" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath('/analytics') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Analytics
              </Link>
              <Link 
                href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath('/dashboard') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/pricing" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath('/pricing') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Pricing
              </Link>
              <Link 
                href="/contact" 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
