import { AlertCircle, CheckCircle, Star, RefreshCw } from 'lucide-react'

export default function ResultsSection({ result, previewUrl, onReset }) {
  const confidence = Math.round(result.confidence * 100)
  const isHealthy = result.diagnosis.toLowerCase().includes('healthy')

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Diagnosis Card */}
        <div className={`rounded-3xl shadow-2xl p-8 lg:p-12 mb-8 ${
          isHealthy
            ? 'bg-gradient-to-br from-primary-500 to-primary-600'
            : 'bg-gradient-to-br from-amber-500 to-orange-600'
        }`}>
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-white text-2xl font-bold">Diagnosis Result</h3>
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold">
              {confidence}% Confident
            </span>
          </div>

          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              {isHealthy ? (
                <CheckCircle className="w-12 h-12 text-white" />
              ) : (
                <AlertCircle className="w-12 h-12 text-white" />
              )}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2">
              {result.diagnosis}
            </h2>
            <p className="text-white/90">{result.source}</p>
          </div>

          {previewUrl && (
            <div className="rounded-2xl overflow-hidden max-h-80">
              <img
                src={previewUrl}
                alt="Analyzed plant"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Predictions */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Top Predictions</h3>
            <div className="space-y-4">
              {result.cnn_predictions?.top_3_predictions?.map((pred, index) => {
                const predConfidence = Math.round(pred.confidence * 100)
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold mb-2 truncate">{pred.disease}</div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                          style={{ width: `${predConfidence}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-primary-600 font-bold text-lg flex-shrink-0">
                      {predConfidence}%
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Advice */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Star className="w-6 h-6 text-primary-500 fill-primary-500" />
                AI Agricultural Advice
              </h3>
              <span className="bg-gradient-to-r from-primary-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Powered by TinyLlama
              </span>
            </div>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
              {result.advice?.full_advice || 'No advice available'}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5" />
            Analyze Another Plant
          </button>
        </div>
      </div>
    </section>
  )
}
