import React, { useState, useEffect } from 'react';
import { AppView, GitHubRepo } from './types';
import Hero from './components/Hero';
import Login from './components/Login';
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

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.provider_token) {
        setToken(session.provider_token);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.provider_token) {
        setToken(session.provider_token);
        // If we just logged in, go to repo list
        if (view === AppView.TOKEN_INPUT) {
          setView(AppView.REPO_LIST);
        }
      } else if (!session) {
        setToken('');
        setView(AppView.LANDING);
      }
    });

    return () => subscription.unsubscribe();
  }, [view]);

  const handleStart = () => {
    if (session) {
      setView(AppView.REPO_LIST);
    } else {
      setView(AppView.TOKEN_INPUT); // Redirect to Login
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
      setView(AppView.TOKEN_INPUT);
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

        {view === AppView.TOKEN_INPUT && (
          <Login onCancel={() => setView(AppView.LANDING)} />
        )}

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