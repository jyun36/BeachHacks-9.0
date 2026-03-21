import { Link } from 'react-router';
import { ChevronLeft, TrendingUp, Droplets, Wind, Clock, Sparkles, AlertTriangle } from 'lucide-react';

export function PileHealth() {
  const healthScore = 87;
  const cnRatio = '28:1';
  const methaneLevel = 'Low';
  const avgDecompTime = '3-4 weeks';
  const moisture = 'Optimal';

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-100">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center gap-3">
          <Link to="/">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-95 transition-all">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Pile Health</h1>
        </div>
      </header>

      <main className="px-6 py-6 pb-24">
        {/* Health Score */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 shadow-xl mb-6 text-white text-center">
          <div className="mb-4">
            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="w-10 h-10" />
            </div>
            <h2 className="text-lg text-white/80 mb-2">Overall Health Score</h2>
            <div className="text-7xl font-bold mb-2">{healthScore}</div>
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-semibold">Excellent Condition</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-1000"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
              <Droplets className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Moisture Level</p>
            <p className="text-xl font-bold text-gray-900">{moisture}</p>
            <div className="mt-2 flex items-center gap-1">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <Wind className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">C:N Ratio</p>
            <p className="text-xl font-bold text-gray-900">{cnRatio}</p>
            <div className="mt-2">
              <span className="text-xs text-green-600 font-medium">✓ Ideal range</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <Wind className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Methane Output</p>
            <p className="text-xl font-bold text-gray-900">{methaneLevel}</p>
            <div className="mt-2">
              <span className="text-xs text-green-600 font-medium">✓ Eco-friendly</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Decomp. Time</p>
            <p className="text-xl font-bold text-gray-900">{avgDecompTime}</p>
            <div className="mt-2">
              <span className="text-xs text-gray-500 font-medium">Average</span>
            </div>
          </div>
        </div>

        {/* AI Agent Suggestions */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Fetch.ai Agent Suggestions</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Perfect Balance</h4>
                  <p className="text-sm text-gray-700">
                    Your C:N ratio is excellent! Keep adding materials at your current pace.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💧</span>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Moisture Check</h4>
                  <p className="text-sm text-gray-700">
                    Turn your pile every 3-4 days to maintain optimal moisture and aeration.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Speed Boost</h4>
                  <p className="text-sm text-gray-700">
                    Chop larger items into smaller pieces to accelerate decomposition by 30%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Health Breakdown</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Material Balance</span>
                <span className="text-sm font-semibold text-emerald-600">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Decomposition Rate</span>
                <span className="text-sm font-semibold text-emerald-600">88%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Environmental Impact</span>
                <span className="text-sm font-semibold text-emerald-600">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-700">Nutrient Quality</span>
                <span className="text-sm font-semibold text-amber-600">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Warning/Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-1">Maintenance Reminder</p>
              <p className="text-sm text-amber-700">
                It's been 3 days since your last turn. Consider turning your pile to improve aeration.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        <Link to="/pile">
          <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform">
            <span className="text-lg font-semibold">View My Pile</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
