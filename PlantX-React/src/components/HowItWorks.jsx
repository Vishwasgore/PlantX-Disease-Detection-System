export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Upload Image',
      description: 'Take a clear photo of your plant\'s leaves showing any symptoms or abnormalities',
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our CNN model analyzes the image, with BLIP providing visual insights for uncertain cases',
    },
    {
      number: '03',
      title: 'Get Diagnosis',
      description: 'Receive instant disease identification with confidence scores and detailed predictions',
    },
    {
      number: '04',
      title: 'Expert Advice',
      description: 'Get personalized treatment recommendations and preventive measures from our AI advisor',
    },
  ]

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-primary-50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-6xl font-extrabold text-primary-200 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
