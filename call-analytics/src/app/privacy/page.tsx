import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Call Analytics',
  description: 'Privacy Policy for Call Analytics SaaS platform',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: December 16, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Account information (name, email, password)</li>
                <li>Organization details</li>
                <li>Audio files you upload for analysis</li>
                <li>Usage data and analytics</li>
                <li>Payment information (processed securely via Razorpay)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process audio transcriptions and analytics</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Process payments and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Data Storage and Security</h2>
              <p className="text-gray-600">
                Your data is stored securely using Firebase infrastructure with encryption at rest and 
                in transit. Audio files are stored in Firebase Storage with access controls. We implement 
                industry-standard security measures to protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Retention</h2>
              <p className="text-gray-600">
                We retain your data based on your subscription plan:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Starter Plan: 30 days</li>
                <li>Professional Plan: 90 days</li>
                <li>Enterprise Plan: Unlimited</li>
              </ul>
              <p className="text-gray-600 mt-4">
                You can request deletion of your data at any time by contacting support.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                We use the following third-party services to provide our platform:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Firebase (Authentication, Database, Storage)</li>
                <li>ElevenLabs (Audio Transcription)</li>
                <li>NVIDIA AI (Call Analysis)</li>
                <li>Razorpay (Payment Processing)</li>
                <li>Vercel (Hosting)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your data</li>
                <li>Export your data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Cookies</h2>
              <p className="text-gray-600">
                We use essential cookies for authentication and session management. We do not use 
                tracking cookies or share data with advertisers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
              <p className="text-gray-600">
                For privacy-related questions or requests, please contact us at{' '}
                <a href="mailto:privacy@callanalytics.com" className="text-indigo-600 hover:text-indigo-500">
                  privacy@callanalytics.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
