import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Camera, X, Zap, RefreshCw } from 'lucide-react';

export function Scanner() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      // Navigate to a mock result
      navigate('/result/banana-peel');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6 flex items-center justify-between">
        <Link to="/">
          <button className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center active:scale-95 transition-transform">
            <X className="w-6 h-6 text-white" />
          </button>
        </Link>
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-white font-medium">AI Ready</span>
        </div>
      </header>

      {/* Camera Viewfinder */}
      <main className="flex-1 relative">
        {/* Mock Camera Feed */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-24 h-24 text-white/30 mx-auto mb-4" />
              <p className="text-white/50 text-lg">Point camera at an item</p>
            </div>
          </div>
        </div>

        {/* Scanning Animation */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
            <div className="text-center">
              <div className="relative">
                <RefreshCw className="w-16 h-16 text-emerald-400 animate-spin mx-auto mb-4" />
                <div className="absolute inset-0 bg-emerald-400/20 blur-2xl" />
              </div>
              <p className="text-white text-lg font-medium">Analyzing with Gemini AI...</p>
              <p className="text-white/60 text-sm mt-2">Identifying object</p>
            </div>
          </div>
        )}

        {/* Scan Frame Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-72 h-72">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-emerald-400 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-emerald-400 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-emerald-400 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-emerald-400 rounded-br-2xl" />
            
            {/* Center crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-0.5 bg-emerald-400/50" />
              <div className="w-0.5 h-8 bg-emerald-400/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-32 left-0 right-0 px-6 text-center">
          <p className="text-white/80 text-sm">
            Position the item within the frame
          </p>
        </div>
      </main>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full mx-auto flex items-center justify-center shadow-2xl active:scale-95 transition-transform disabled:opacity-50 disabled:scale-95"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-emerald-600" />
          </div>
        </button>
        <p className="text-white/60 text-sm text-center mt-4">Tap to scan</p>
      </div>
    </div>
  );
}
