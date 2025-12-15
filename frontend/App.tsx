import React, { useState, useEffect } from 'react';
import { AppView, GitHubRepo } from './types';
import Hero from './components/Hero';
import TokenInput from './components/TokenInput';
import RepoList from './components/RepoList';
import Scanner from './components/Scanner';
import QuickScan from './components/QuickScan';

// Cookie helper functions
const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [token, setToken] = useState<string>('');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  // Load token from cookie on mount
  useEffect(() => {
    const savedToken = getCookie('github_token');
    if (savedToken) {
      setToken(savedToken);
      setView(AppView.REPO_LIST); // Skip to repo list if token exists
    }
  }, []);

  const handleStart = () => {
    // Check if token already exists in cookie
    const savedToken = getCookie('github_token');
    if (savedToken) {
      setToken(savedToken);
      setView(AppView.REPO_LIST);
    } else {
      setView(AppView.TOKEN_INPUT);
    }
  };

  const handleTokenSubmit = (newToken: string) => {
    setToken(newToken);
    setCookie('github_token', newToken, 30); // Save for 30 days
    setView(AppView.REPO_LIST);
  };

  const handleRepoSelect = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setView(AppView.SCANNING);
  };

  const handleBackToRepos = () => {
    setSelectedRepo(null);
    setView(AppView.REPO_LIST);
  };

  const handleLogout = () => {
    setToken('');
    deleteCookie('github_token'); // Clear saved token
    setSelectedRepo(null);
    setView(AppView.LANDING);
  };

  const handleQuickScan = () => {
    setView(AppView.QUICK_SCAN);
  };

  const handleGoToGithub = () => {
    const savedToken = getCookie('github_token');
    if (savedToken || token) {
      setView(AppView.REPO_LIST);
    } else {
      setView(AppView.TOKEN_INPUT);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

      <div className="relative z-10">
        {view === AppView.LANDING && (
          <Hero onStart={handleStart} onQuickScan={handleQuickScan} />
        )}

        {view === AppView.TOKEN_INPUT && (
          <TokenInput
            onTokenSubmit={handleTokenSubmit}
            onCancel={() => setView(AppView.LANDING)}
          />
        )}

        {view === AppView.REPO_LIST && (
          <RepoList
            token={token}
            onSelectRepo={handleRepoSelect}
            onBack={handleLogout}
            onQuickScan={handleQuickScan}
          />
        )}

        {view === AppView.SCANNING && selectedRepo && (
          <Scanner
            repo={selectedRepo}
            token={token}
            onBack={handleBackToRepos}
          />
        )}

        {view === AppView.QUICK_SCAN && (
          <QuickScan
            onBack={() => setView(AppView.LANDING)}
            onGoToGithub={handleGoToGithub}
          />
        )}
      </div>
    </div>
  );
};

export default App;