import { Link, useParams } from 'react-router';
import { CheckCircle2, XCircle, Leaf, Clock, TrendingDown, AlertCircle, ChevronLeft, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const mockResults: Record<string, any> = {
  'banana-peel': {
    name: 'Banana Peel',
    compostable: true,
    image: 'https://images.unsplash.com/photo-1729368629976-95d8a93c0dfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5hbmElMjBwZWVsJTIwZnJ1aXQlMjB3YXN0ZXxlbnwxfHx8fDE3NzQxMjY1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Fruit Waste',
    carbonRatio: 'High in nitrogen',
    decompositionTime: '2-5 weeks',
    methaneOutput: 'Low',
    tips: [
      'Cut into smaller pieces for faster decomposition',
      'Great for adding moisture to dry piles',
      'Attracts beneficial microorganisms'
    ],
    reasoning: 'Banana peels are rich in potassium and nitrogen, making them excellent for composting. They decompose relatively quickly and add valuable nutrients to your pile.'
  },
  'coffee-grounds': {
    name: 'Coffee Grounds',
    compostable: true,
    image: 'https://images.unsplash.com/photo-1616759011158-407a06b5c5fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBncm91bmRzfGVufDF8fHx8MTc3NDEyNjU1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Kitchen Waste',
    carbonRatio: 'Nitrogen-rich (green)',
    decompositionTime: '1-2 weeks',
    methaneOutput: 'Very Low',
    tips: [
      'Add coffee filters too - they\'re compostable',
      'Balance with brown materials like leaves',
      'Great for worm composting'
    ],
    reasoning: 'Coffee grounds are considered "green" compost material despite their brown color. They\'re nitrogen-rich and help activate the composting process.'
  },
  'plastic-bottle': {
    name: 'Plastic Bottle',
    compostable: false,
    image: 'https://images.unsplash.com/photo-1670327369066-ddb54c205a0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwYm90dGxlJTIwd2FzdGV8ZW58MXx8fHwxNzc0MTI2NTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Plastic',
    reasoning: 'Plastic is a synthetic polymer that does not biodegrade. It can take hundreds of years to break down and releases harmful microplastics into the environment.',
    disposalTips: [
      'Rinse and recycle in your local recycling program',
      'Check the recycling number (usually #1 PETE)',
      'Consider reusable alternatives',
      'Look for bottle deposit programs in your area'
    ]
  }
};

export function ScanResult() {
  const { itemType } = useParams();
  const result = mockResults[itemType || 'banana-peel'] || mockResults['banana-peel'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-100">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center gap-3">
          <Link to="/scanner">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Scan Result</h1>
        </div>
      </header>

      <main className="px-6 py-6 pb-24">
        {/* Item Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl mb-6">
          <ImageWithFallback
            src={result.image}
            alt={result.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4">
            {result.compostable ? (
              <div className="bg-emerald-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Compostable</span>
              </div>
            ) : (
              <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Not Compostable</span>
              </div>
            )}
          </div>
        </div>

        {/* Item Info */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.name}</h2>
          <div className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
            {result.category}
          </div>
        </div>

        {result.compostable ? (
          <>
            {/* Compost Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <Leaf className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Carbon Ratio</p>
                <p className="text-sm font-semibold text-gray-900">{result.carbonRatio}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Decomposes In</p>
                <p className="text-sm font-semibold text-gray-900">{result.decompositionTime}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md text-center">
                <TrendingDown className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-1">Methane</p>
                <p className="text-sm font-semibold text-gray-900">{result.methaneOutput}</p>
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 shadow-lg mb-4 text-white">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🧠</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Analysis</h3>
                  <p className="text-sm text-white/90 leading-relaxed">{result.reasoning}</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-md mb-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-emerald-600" />
                Composting Tips
              </h3>
              <ul className="space-y-3">
                {result.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-600 text-xs font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Not Compostable Info */}
            <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-6 shadow-lg mb-4 text-white">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">⚠️</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Why Not Compostable?</h3>
                  <p className="text-sm text-white/90 leading-relaxed">{result.reasoning}</p>
                </div>
              </div>
            </div>

            {/* Disposal Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-md mb-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Proper Disposal
              </h3>
              <ul className="space-y-3">
                {result.disposalTips.map((tip: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>

      {/* Bottom Action */}
      {result.compostable && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
          <Link to="/pile">
            <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform">
              <Plus className="w-6 h-6" />
              <span className="text-lg font-semibold">Add to My Pile</span>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
