import React, { useState, useEffect } from 'react';
import { AppView, GitHubRepo } from './types';
import Hero from './components/Hero';
import LoginModal from './components/LoginModal';
import RepoList from './components/RepoList';
import Scanner from './components/Scanner';
import QuickScan from './components/QuickScan';
import History from './components/History';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [token, setToken] = useState<string>('');
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.provider_token) {
        setToken(session.provider_token);
        // If already logged in on mount, go to repo list
        setView(AppView.REPO_LIST);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session?.provider_token) {
        setToken(session.provider_token);
      }

      // Handle sign in - redirect to repo list and close modal
      if (event === 'SIGNED_IN' && session) {
        setView(AppView.REPO_LIST);
        setShowLoginModal(false);
      }

      // Handle sign out - go back to landing
      if (event === 'SIGNED_OUT') {
        setToken('');
        setView(AppView.LANDING);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStart = () => {
    if (session) {
      setView(AppView.REPO_LIST);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleRepoSelect = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setView(AppView.SCANNING);
  };

  const handleBackToRepos = () => {
    setSelectedRepo(null);
    setView(AppView.REPO_LIST);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setToken('');
    setSelectedRepo(null);
    setView(AppView.LANDING);
  };

  const handleQuickScan = () => {
    setView(AppView.QUICK_SCAN);
  };

  const handleGoToGithub = () => {
    if (session) {
      setView(AppView.REPO_LIST);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleHistory = () => {
    setView(AppView.HISTORY);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

      <div className="relative z-10">
        {view === AppView.LANDING && (
          <Hero onStart={handleStart} onQuickScan={handleQuickScan} />
        )}

        {/* Login Modal */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

        {view === AppView.REPO_LIST && (
          <RepoList
            token={token}
            onSelectRepo={handleRepoSelect}
            onBack={handleLogout}
            onQuickScan={handleQuickScan}
            onHistory={handleHistory}
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

        {view === AppView.HISTORY && (
          <History onBack={() => setView(AppView.REPO_LIST)} />
        )}
      </div>
    </div>
  );
};

export default App;