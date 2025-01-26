// app/page.tsx
import { BarChart } from 'lucide-react'

export default function Home() {
  return (
    <>
      <section className="pt-32 pb-16 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Transform Your Call Data
              </span>
              <br />
              <span className="text-white">Into Actionable Insights</span>
            </h1>
            <p className="mt-6 text-xl text-neutral-300 max-w-3xl mx-auto">
              Powerful AI-driven analytics platform that helps you understand customer conversations,
              improve service quality, and boost conversion rates.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <a href="#contact" className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all">
                Start Free Trial
              </a>
              <a href="/analytics" className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-all">
                Try Analytics
              </a>
              <a href="#features" className="px-8 py-3 bg-neutral-700 text-white font-medium rounded-lg hover:bg-neutral-600 transition-all">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Everything you need to analyze and optimize your calls
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-neutral-50 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="h-12 w-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add more sections as needed */}
    </>
  )
}

const features = [
  {
    title: 'Real-time Analytics',
    description: 'Get instant insights into call performance and customer sentiment.'
  },
  {
    title: 'AI Transcription',
    description: 'Accurate speech-to-text with support for multiple languages.'
  },
  {
    title: 'Smart Insights',
    description: 'AI-powered analysis of customer interactions and trends.'
  },
  // Add more features
]