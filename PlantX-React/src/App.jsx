import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import UploadSection from './components/UploadSection'
import LoadingSection from './components/LoadingSection'
import ResultsSection from './components/ResultsSection'
import HowItWorks from './components/HowItWorks'
import Footer from './components/Footer'

// Update this to your Hugging Face Space URL
const API_URL = import.meta.env.VITE_API_URL || 'https://hbssqwskqjw-plantx-disease-detection-system.hf.space'

function App() {
  const [appState, setAppState] = useState('idle') // idle, analyzing, results
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [result, setResult] = useState(null)
  const [loadingStep, setLoadingStep] = useState(0)

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setAppState('analyzing')
    setLoadingStep(0)

    // Animate loading steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < 2) return prev + 1
        clearInterval(stepInterval)
        return prev
      })
    }, 1500)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      clearInterval(stepInterval)
      setResult(data)
      setAppState('results')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to analyze image. Please try again.')
      clearInterval(stepInterval)
      handleReset()
    }
  }

  const handleReset = () => {
    handleRemoveFile()
    setAppState('idle')
    setResult(null)
    setLoadingStep(0)
  }

  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Hero onGetStarted={scrollToUpload} />
      
      {appState === 'idle' && (
        <UploadSection
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
          onAnalyze={handleAnalyze}
        />
      )}

      {appState === 'analyzing' && (
        <LoadingSection currentStep={loadingStep} />
      )}

      {appState === 'results' && result && (
        <ResultsSection
          result={result}
          previewUrl={previewUrl}
          onReset={handleReset}
        />
      )}

      <HowItWorks />
      <Footer />
    </div>
  )
}

export default App
