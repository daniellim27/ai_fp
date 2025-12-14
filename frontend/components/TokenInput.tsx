import React, { useState } from 'react';
import Button from './Button';
import { validateToken } from '../services/githubService';

interface TokenInputProps {
  onTokenSubmit: (token: string) => void;
  onCancel: () => void;
}

const TokenInput: React.FC<TokenInputProps> = ({ onTokenSubmit, onCancel }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!token.trim()) {
      setError('Please enter a valid token');
      return;
    }

    setIsValidating(true);
    try {
      const isValid = await validateToken(token);
      if (isValid) {
        onTokenSubmit(token);
      } else {
        setError('Invalid token. Ensure it has "repo" scope access.');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel border-gray-800 bg-[#0A0A0A] shadow-2xl">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Connect GitHub</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            To scan your repositories, we need a standard GitHub Personal Access Token. This runs entirely in your browser.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Access Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxx"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-gray-600 transition-all font-mono text-sm"
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
                type="button" 
                variant="ghost" 
                onClick={onCancel}
                className="flex-1"
            >
              Cancel
            </Button>
            <Button 
                type="submit" 
                isLoading={isValidating}
                className="flex-1"
            >
              Connect
            </Button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <a 
                href="https://github.com/settings/tokens/new?scopes=repo&description=VulnScanAI" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
                <span>Generate token automatically</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
        </div>
      </div>
    </div>
  );
};

export default TokenInput;