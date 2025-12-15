import React from 'react';
import Button from './Button';

interface HeroProps {
  onStart: () => void;
  onQuickScan: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onQuickScan }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Detect XSS in your <br />
          <span className="gradient-text">JS & PHP Code</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Connect your GitHub repository or paste code directly to scan for Cross-Site Scripting (XSS) and injection vulnerabilities instantly.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={onQuickScan} className="w-full sm:w-auto h-12 px-8 text-base shadow-indigo-500/20">
            Quick Scan
          </Button>
          <Button variant="secondary" onClick={onStart} className="w-full sm:w-auto h-12 px-8 text-base">
            Connect GitHub
          </Button>
        </div>

        {/* Floating cards for visual flair */}
        <div className="mt-20 relative w-full max-w-3xl mx-auto h-64 hidden md:block">
          <div className="absolute top-0 left-0 p-4 rounded-xl glass-panel w-72 transform -rotate-6 hover:-rotate-3 transition-transform duration-500 border-l-4 border-l-yellow-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="text-xs text-gray-400 font-mono">index.php</div>
            </div>
            <div className="space-y-2 font-mono text-[10px] text-gray-500">
              <div className="text-gray-400">echo $_GET['search'];</div>
              <div className="h-2 bg-yellow-500/30 rounded w-full animate-pulse"></div>
              <div className="text-yellow-500">⚠ Reflected XSS Detected</div>
            </div>
          </div>

          <div className="absolute top-8 right-0 p-4 rounded-xl glass-panel w-72 transform rotate-6 hover:rotate-3 transition-transform duration-500 z-10 border-l-4 border-l-green-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="text-xs text-gray-400 font-mono">Analysis Report</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Files Scanned</span>
                <span>12</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Vulnerabilities</span>
                <span className="text-red-400">3 Found</span>
              </div>
              <div className="h-1 bg-white/10 rounded w-full mt-2">
                <div className="h-1 bg-green-500 w-2/3 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;