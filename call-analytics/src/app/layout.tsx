// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Call Analytics Platform',
  description: 'AI-powered call analytics and insights platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-neutral-50">
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
                    <Link href="/analytics" className="text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-md text-sm font-medium">
                      Analytics
                    </Link>
                    <Link href="/dashboard" className="text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link href="/pricing" className="text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-md text-sm font-medium">
                      Pricing
                    </Link>
                    <Link href="/contact" className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main>{children}</main>
          <footer className="bg-neutral-900 text-neutral-400 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div>
                  <h3 className="text-white font-semibold mb-4">Product</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Company</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-4">Legal</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-neutral-800 mt-8 pt-8 text-sm">
                <p>&copy; 2024 CallAnalytics. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}