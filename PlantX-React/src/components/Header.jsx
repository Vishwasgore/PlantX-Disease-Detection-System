import { Leaf } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">PlantX</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Home
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              About
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
