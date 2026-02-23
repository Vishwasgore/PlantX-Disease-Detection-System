import { useState } from 'react'
import { Upload, X, Scan } from 'lucide-react'

export default function UploadSection({ selectedFile, previewUrl, onFileSelect, onRemoveFile, onAnalyze }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file)
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file)
    }
  }

  return (
    <section id="upload" className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
            Upload Plant Image
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Take a clear photo of the affected plant leaves for accurate diagnosis
          </p>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary-500 bg-primary-50 scale-105'
                : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            {!previewUrl ? (
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Upload className="w-16 h-16 mx-auto mb-4 text-primary-500" />
                <h3 className="text-xl font-semibold mb-2">Drop your image here</h3>
                <p className="text-gray-600 mb-4">or click to browse</p>
                <span className="inline-block px-4 py-2 bg-white rounded-lg text-sm text-gray-500 border border-gray-200">
                  Supports: JPG, PNG, JPEG
                </span>
              </label>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-96 mx-auto rounded-xl object-contain"
                />
                <button
                  onClick={onRemoveFile}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onAnalyze}
            disabled={!selectedFile}
            className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-200 ${
              selectedFile
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Scan className="w-5 h-5" />
            Analyze Plant
          </button>
        </div>
      </div>
    </section>
  )
}
