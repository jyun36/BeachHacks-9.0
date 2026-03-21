import { Link } from 'react-router';
import { Camera, Leaf, BarChart3, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-100 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">CompostAI</h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 px-6 py-8 flex flex-col">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm text-gray-700">Powered by Google Gemini & Fetch.ai</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Know What's<br />Compostable
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Point your camera at any item and instantly discover if it belongs in your compost bin
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto w-full">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1749980556497-f49d84224746?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wb3N0JTIwcGlsZSUyMG9yZ2FuaWMlMjB3YXN0ZXxlbnwxfHx8fDE3NzQxMjY1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Compost pile"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <Link to="/scanner">
            <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform">
              <Camera className="w-6 h-6" />
              <span className="text-lg font-semibold">Scan an Item</span>
            </button>
          </Link>

          <Link to="/pile">
            <button className="w-full bg-white text-gray-900 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-md active:scale-95 transition-transform">
              <Leaf className="w-6 h-6 text-emerald-600" />
              <span className="text-lg font-semibold">My Compost Pile</span>
            </button>
          </Link>

          <Link to="/health">
            <button className="w-full bg-white text-gray-900 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-md active:scale-95 transition-transform">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              <span className="text-lg font-semibold">Pile Health</span>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}