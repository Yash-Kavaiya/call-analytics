// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from './components/Navigation'
import { AuthProvider } from '@/components/providers/AuthProvider'

export const metadata: Metadata = {
  title: 'Prism - Call Analytics Platform',
  description: 'AI-powered call analytics and insights platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased font-sans">
        <AuthProvider>
          <div className="min-h-screen bg-neutral-50">
            <Navigation />
            <main>{children}</main>
            <footer className="bg-neutral-900 text-neutral-400 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                  <div>
                    <h3 className="text-white font-semibold mb-4">Prism</h3>
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
                  <p>&copy; 2024 Prism. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}