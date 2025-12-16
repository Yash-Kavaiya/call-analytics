import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Call Analytics',
  description: 'Terms of Service for Call Analytics SaaS platform',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: December 16, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using Call Analytics (&quot;the Service&quot;), you accept and agree to be bound by 
                the terms and provisions of this agreement. If you do not agree to these terms, please do 
                not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-600">
                Call Analytics provides AI-powered call analytics services including audio transcription, 
                sentiment analysis, and performance insights for customer service calls. The Service is 
                provided &quot;as is&quot; and we reserve the right to modify, suspend, or discontinue any part 
                of the Service at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-600 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Upload content that infringes on intellectual property rights</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Transmit malicious software or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with other users&apos; use of the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
              <p className="text-gray-600">
                Paid subscriptions are billed in advance on a monthly basis. All payments are non-refundable 
                except as required by law. We reserve the right to change our pricing with 30 days notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Privacy</h2>
              <p className="text-gray-600">
                Your privacy is important to us. Please review our Privacy Policy to understand how we 
                collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-600">
                To the maximum extent permitted by law, Call Analytics shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages resulting from your use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-600">
                For questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:support@callanalytics.com" className="text-indigo-600 hover:text-indigo-500">
                  support@callanalytics.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
