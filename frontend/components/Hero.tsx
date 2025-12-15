import React from 'react';
import Button from './Button';

interface HeroProps {
  onStart: () => void;
  onQuickScan: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onQuickScan }) => {
  return (
    <div className="min-h-screen flex items-center px-6 md:px-12 relative overflow-hidden bg-[#050505]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 top-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Content */}
        <div className="space-y-8 animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] text-white">
            Secure your <br />
            <span className="text-gray-500">codebase.</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-lg leading-relaxed font-light">
            Instantly detect Cross-Site Scripting (XSS) vulnerabilities in PHP and JavaScript using our advanced CodeBERT model.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
            <Button onClick={onQuickScan} className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200 border-none">
              Quick Scan
            </Button>
            <Button variant="secondary" onClick={onStart} className="h-14 px-8 text-lg border-white/20 hover:bg-white/5">
              Connect GitHub
            </Button>
          </div>
        </div>

        {/* Right Visual - Minimalist Code Preview */}
        <div className="hidden lg:block relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
              </div>
              <div className="ml-4 text-xs text-gray-500 font-mono">vulnerability_scan.php</div>
            </div>

            <div className="space-y-2 font-mono text-sm">
              <div className="text-gray-500">// Scanning for XSS patterns...</div>
              <div className="text-purple-400">function <span className="text-blue-400">validateInput</span>($data) {`{`}</div>
              <div className="pl-4 text-gray-300">$input = <span className="text-yellow-400">$_GET</span>['user_input'];</div>
              <div className="pl-4 text-gray-500">// <span className="text-red-400">⚠ Potential XSS Detected</span></div>
              <div className="pl-4 text-gray-300">echo $input;</div>
              <div className="text-purple-400">{`}`}</div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
              <div className="text-xs text-gray-500">Status: <span className="text-red-400">Vulnerable</span></div>
              <div className="h-1 w-24 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;