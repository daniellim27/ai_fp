import React, { useEffect, useState } from 'react';
import { GitHubRepo } from '../types';
import { fetchRepositories } from '../services/githubService';
import Button from './Button';

interface RepoListProps {
  token: string;
  onSelectRepo: (repo: GitHubRepo) => void;
  onBack: () => void;
}

const RepoList: React.FC<RepoListProps> = ({ token, onSelectRepo, onBack }) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLang, setFilterLang] = useState('All');

  useEffect(() => {
    const loadRepos = async () => {
        try {
            const data = await fetchRepositories(token);
            setRepos(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadRepos();
  }, [token]);

  const filteredRepos = repos.filter(repo => {
    const matchesSearch = repo.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = filterLang === 'All' || (repo.language && repo.language.toLowerCase() === filterLang.toLowerCase());
    return matchesSearch && matchesLang;
  });

  const uniqueLanguages = ['All', ...Array.from(new Set(repos.map(r => r.language).filter(Boolean)))];

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
            <h2 className="text-3xl font-bold mb-2">Select Repository</h2>
            <p className="text-gray-400">Choose a project to scan for vulnerabilities.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative">
                <select 
                    value={filterLang}
                    onChange={(e) => setFilterLang(e.target.value)}
                    className="w-full sm:w-32 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                    {uniqueLanguages.slice(0, 8).map(lang => (
                        <option key={String(lang)} value={String(lang)} className="bg-gray-900">{lang}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            <input 
                type="text" 
                placeholder="Search repositories..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-gray-500"
            />
            <Button variant="ghost" onClick={onBack} className="shrink-0">
                Log Out
            </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse border border-white/5"></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map(repo => (
            <div 
                key={repo.id}
                onClick={() => onSelectRepo(repo)}
                className="group p-6 rounded-xl glass-panel hover:bg-white/10 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] hover:border-indigo-500/30 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
                <div className="flex items-center gap-3 mb-4">
                    <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-10 h-10 rounded-full border border-white/10" />
                    <div className="overflow-hidden">
                        <span className="block text-xs text-gray-400 mb-0.5">{repo.owner.login}</span>
                        <h3 className="text-lg font-bold leading-tight truncate w-full" title={repo.name}>{repo.name}</h3>
                    </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-6">
                    {repo.description || 'No description provided.'}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/10 pt-4 mt-auto">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5">
                        <span className={`w-2 h-2 rounded-full ${repo.language === 'JavaScript' || repo.language === 'TypeScript' ? 'bg-yellow-400' : repo.language === 'PHP' ? 'bg-purple-400' : 'bg-gray-400'}`}></span>
                        {repo.language || 'Unknown'}
                    </span>
                    <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
          ))}
          {filteredRepos.length === 0 && (
              <div className="col-span-full py-20 text-center">
                  <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                     <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                  <h3 className="text-xl text-gray-300 mb-2">No repositories found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters.</p>
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RepoList;