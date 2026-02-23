import { ArrowDown } from 'lucide-react'

export default function Hero({ onGetStarted }) {
  return (
    <section id="home" className="relative bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
            <span className="text-gradient">AI-Powered</span>
            <br />
            <span className="text-gray-900">Plant Disease Detection</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload a photo of your plant and get instant diagnosis with expert agricultural advice powered by advanced AI
          </p>
          
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <ArrowDown className="w-5 h-5" />
            Start Analysis
          </button>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
        </div>
      </div>
    </section>
  )
}
