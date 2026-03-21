import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, Trash2, Leaf, Apple, Coffee, Newspaper, Calendar } from 'lucide-react';

const mockPileItems = [
  { id: 1, name: 'Banana Peels', type: 'green', amount: '3 peels', date: '2 days ago', icon: '🍌' },
  { id: 2, name: 'Coffee Grounds', type: 'green', amount: '1 cup', date: '3 days ago', icon: '☕' },
  { id: 3, name: 'Dried Leaves', type: 'brown', amount: 'Large handful', date: '4 days ago', icon: '🍂' },
  { id: 4, name: 'Apple Cores', type: 'green', amount: '2 cores', date: '5 days ago', icon: '🍎' },
  { id: 5, name: 'Newspaper', type: 'brown', amount: '5 sheets', date: '1 week ago', icon: '📰' },
  { id: 6, name: 'Vegetable Scraps', type: 'green', amount: 'Small bowl', date: '1 week ago', icon: '🥕' },
];

export function PileTracker() {
  const [items, setItems] = useState(mockPileItems);

  const greenCount = items.filter(item => item.type === 'green').length;
  const brownCount = items.filter(item => item.type === 'brown').length;

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
          <h1 className="text-lg font-semibold text-gray-900">My Compost Pile</h1>
        </div>
      </header>

      <main className="px-6 py-6 pb-24">
        {/* Pile Summary */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 shadow-xl mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Leaf className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{items.length} Items</h2>
              <p className="text-white/80 text-sm">In your compost pile</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-300 rounded-full" />
                <p className="text-white/80 text-sm">Green Materials</p>
              </div>
              <p className="text-2xl font-bold">{greenCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-amber-300 rounded-full" />
                <p className="text-white/80 text-sm">Brown Materials</p>
              </div>
              <p className="text-2xl font-bold">{brownCount}</p>
            </div>
          </div>
        </div>

        {/* Quick Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Quick Tip</p>
              <p className="text-sm text-blue-700">
                Ideal ratio is 3:1 brown to green materials. Your pile looks great!
              </p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Recent Items
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-0.5">{item.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{item.amount}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'green' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.type === 'green' ? '🌱 Nitrogen-rich' : '🍂 Carbon-rich'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setItems(items.filter(i => i.id !== item.id))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* View Health Button */}
        <Link to="/health">
          <button className="w-full bg-white text-gray-900 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-md active:scale-95 transition-transform border-2 border-emerald-200">
            <span className="text-lg font-semibold">View Pile Health Report</span>
          </button>
        </Link>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
        <Link to="/scanner">
          <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform">
            <span className="text-lg font-semibold">Scan New Item</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
