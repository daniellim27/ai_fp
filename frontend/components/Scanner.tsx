import React, { useEffect, useState, useRef } from 'react';
import { GitHubRepo, GitHubFile, FileScanResult, Vulnerability } from '../types';
import { fetchRepoFiles, fetchFileContent } from '../services/githubService';
import { analyzeCodeForVulnerabilities } from '../services/codebertService';
import { SUPPORTED_EXTENSIONS } from '../constants';
import Button from './Button';

interface ScannerProps {
  repo: GitHubRepo;
  token: string;
  onBack: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ repo, token, onBack }) => {
  const [status, setStatus] = useState<'fetching' | 'ready' | 'scanning' | 'complete'>('fetching');
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [scanResults, setScanResults] = useState<FileScanResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>('');

  // Use a ref to track if component is mounted to prevent state updates on unmount
  const mounted = useRef(true);
  const [selectedVuln, setSelectedVuln] = useState<Vulnerability | null>(null);

  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    mounted.current = true; // Reset on mount
    const init = async () => {
      setStatus('fetching');
      const allFiles = await fetchRepoFiles(token, repo.owner.login, repo.name);

      // Filter for code files, prioritizing JS and PHP
      const codeFiles = allFiles.filter(f =>
        f.type === 'blob' &&
        SUPPORTED_EXTENSIONS.some(ext => f.path.endsWith(ext)) &&
        !f.path.includes('node_modules') &&
        !f.path.includes('vendor') &&
        !f.path.includes('test') &&
        !f.path.includes('dist')
      );

      // Prioritize potential attack vectors (index, login, search, user controllers)
      const prioritizedFiles = codeFiles.sort((a, b) => {
        const scoreA = (a.path.includes('index') || a.path.includes('login') || a.path.includes('php')) ? 2 : 1;
        const scoreB = (b.path.includes('index') || b.path.includes('login') || b.path.includes('php')) ? 2 : 1;
        return scoreB - scoreA;
      });

      // Limit to 10 files for the demo to manage API usage effectively
      const limitedFiles = prioritizedFiles.slice(0, 50);

      if (mounted.current) {
        setFiles(limitedFiles);
        setStatus('ready');
      }
    };
    init();

    return () => {
      mounted.current = false;
    };
  }, [repo, token]);

  const startScan = async () => {
    setStatus('scanning');
    setScanResults([]);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (mounted.current) setCurrentFile(file.path);

      try {
        const content = await fetchFileContent(token, file.url);

        if (!content.trim()) {
          continue;
        }

        const vulnerabilities = await analyzeCodeForVulnerabilities(content, file.path);

        const result: FileScanResult = {
          fileName: file.path.split('/').pop() || file.path,
          filePath: file.path,
          vulnerabilities: vulnerabilities,
          status: vulnerabilities.length > 0 ? 'vulnerable' : 'safe',
          rawCode: content
        };

        if (mounted.current) {
          setScanResults(prev => [...prev, result]);
          setProgress(Math.round(((i + 1) / files.length) * 100));
        }

      } catch (error) {
        console.error(`Failed to scan ${file.path}`, error);
      }
    }

    if (mounted.current) {
      setStatus('complete');
      setCurrentFile('');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto flex flex-col h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 shrink-0 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <button onClick={onBack} className="hover:text-white transition-colors">Repositories</button>
            <span>/</span>
            <span>{repo.name}</span>
          </div>
          <h2 className="text-3xl font-bold">{status === 'complete' ? 'Scan Report' : 'XSS Vulnerability Scanner'}</h2>
        </div>
        {status !== 'scanning' && (
          <Button variant="secondary" onClick={onBack}>Exit</Button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">

        {/* Status Card */}
        {status !== 'complete' && (
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center py-20 shrink-0">
            {status === 'fetching' && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="text-gray-400">Fetching file structure...</div>
              </div>
            )}

            {status === 'ready' && (
              <div className="space-y-6 w-full max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4 relative">
                  <div className="absolute inset-0 rounded-full animate-ping bg-indigo-500/10"></div>
                  <svg className="w-10 h-10 text-indigo-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to Scan</h3>
                  <p className="text-gray-400 mb-6">
                    We found {files.length} relevant files to scan:
                  </p>

                  {/* File Preview List */}
                  <div className="bg-gray-900/50 rounded-xl border border-gray-800 text-left overflow-hidden mb-6">
                    <div className="p-3 bg-gray-800/50 border-b border-gray-800 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Files to Analyze
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-sm text-gray-300 font-mono">
                          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                          <span className="truncate">{file.path}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={startScan} className="shadow-lg shadow-indigo-500/20 w-full md:w-auto">
                  Run XSS Analysis
                </Button>
              </div>
            )}

            {status === 'scanning' && (
              <div className="w-full max-w-xl space-y-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Analyzing: <span className="text-indigo-400 font-mono">{currentFile}</span></span>
                  <span className="text-white">{progress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8 opacity-50 text-xs text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Parsing AST</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"></div>
                    <span>Detecting Injections</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150"></div>
                    <span>Validating Fixes</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results View */}
        {(status === 'scanning' || status === 'complete') && scanResults.length > 0 && (
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-10">
            {scanResults.map((result, idx) => (
              <div key={idx} className="glass-panel rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={`p-4 border-b border-white/5 flex justify-between items-center ${result.status === 'vulnerable' ? 'bg-red-500/5' : 'bg-green-500/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${result.status === 'vulnerable' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <h4 className="font-mono font-medium text-sm md:text-base">{result.filePath}</h4>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border ${result.status === 'vulnerable' ? 'border-red-500/30 text-red-400' : 'border-green-500/30 text-green-400'}`}>
                    {result.status === 'vulnerable' ? `${result.vulnerabilities.length} VULNERABILITIES` : 'SECURE'}
                  </span>
                </div>

                {result.vulnerabilities.length > 0 && (
                  <div className="p-4 space-y-3">
                    {result.vulnerabilities.map((vuln, vIdx) => (
                      <div key={vIdx} className="bg-black/20 rounded-lg p-4 border border-white/5 hover:bg-black/30 transition-colors">
                        <div className="flex flex-wrap gap-3 items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getSeverityColor(vuln.severity)}`}>
                              {vuln.severity}
                            </span>
                            <span className="text-sm font-semibold text-white">{vuln.type}</span>
                            <span className="text-xs text-gray-500 font-mono">Line {vuln.lineNumber}</span>
                          </div>

                          <Button
                            onClick={() => setSelectedVuln(vuln)}
                            className="text-xs py-1.5 px-3 h-auto bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          >
                            View Code Analysis
                          </Button>
                        </div>

                        <p className="text-gray-400 text-sm mt-3 line-clamp-2">{vuln.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {status === 'complete' && scanResults.length === 0 && (
          <div className="glass-panel p-12 rounded-2xl text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">?</div>
            <h3 className="text-xl font-bold mb-2">No files scanned</h3>
            <p className="text-gray-400">The repository might be empty or contains no supported JS/PHP files.</p>
          </div>
        )}
      </div>

      {/* Code Analysis Modal */}
      {selectedVuln && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getSeverityColor(selectedVuln.severity)}`}>
                    {selectedVuln.severity}
                  </span>
                  <h3 className="text-xl font-bold text-white">{selectedVuln.type}</h3>
                </div>
                <p className="text-gray-400 text-sm">Line {selectedVuln.lineNumber}</p>
              </div>
              <button
                onClick={() => setSelectedVuln(null)}
                className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300 uppercase tracking-wider">Description</h4>
                <p className="text-gray-400 leading-relaxed bg-gray-800/30 p-4 rounded-lg border border-gray-800">
                  {selectedVuln.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Vulnerable Code
                  </h4>
                </div>
                <div className="bg-red-950/10 border border-red-500/20 rounded-lg overflow-hidden">
                  <div className="p-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-red-200 whitespace-pre-wrap break-all">
                      {selectedVuln.codeSnippet}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedVuln(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;