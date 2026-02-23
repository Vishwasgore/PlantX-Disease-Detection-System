import { Loader2 } from 'lucide-react'

export default function LoadingSection({ currentStep }) {
  const steps = [
    { id: 0, label: 'Image Processing' },
    { id: 1, label: 'Disease Detection' },
    { id: 2, label: 'AI Analysis' },
  ]

  const messages = [
    'Processing image with AI models',
    'Detecting disease patterns',
    'Generating AI advice with TinyLlama',
  ]

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <Loader2 className="w-20 h-20 text-primary-500 animate-spin" />
          </div>

          <h3 className="text-2xl font-bold mb-2">Analyzing Your Plant...</h3>
          <p className="text-gray-600 mb-12">{messages[currentStep]}</p>

          <div className="flex justify-between gap-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex-1 transition-all duration-500 ${
                  step.id <= currentStep ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-lg mb-3 transition-all duration-500 ${
                    step.id <= currentStep
                      ? 'bg-primary-500 text-white scale-110'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step.id + 1}
                </div>
                <span className="text-sm text-gray-600">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
