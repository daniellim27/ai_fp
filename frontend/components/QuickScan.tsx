import React, { useState } from 'react';
import { analyzeCodeForVulnerabilities } from '../services/codebertService';
import { Vulnerability } from '../types';

interface QuickScanProps {
    onBack: () => void;
    onGoToGithub: () => void;
}

const QuickScan: React.FC<QuickScanProps> = ({ onBack, onGoToGithub }) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState<'php' | 'js'>('js');
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState<Vulnerability[] | null>(null);

    const handleScan = async () => {
        if (!code.trim()) return;

        setScanning(true);
        setResults(null);

        try {
            const fileName = language === 'php' ? 'code.php' : 'code.js';
            const vulnerabilities = await analyzeCodeForVulnerabilities(code, fileName);
            setResults(vulnerabilities);
        } catch (error) {
            console.error('Scan failed:', error);
            setResults([]);
        } finally {
            setScanning(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </button>
                        <h1 className="text-4xl font-bold text-white">
                            Quick <span className="text-white">XSS Scan</span>
                        </h1>
                        <p className="text-gray-400 mt-1">Paste your code snippet below to instantly check for vulnerabilities.</p>
                    </div>

                    {/* Language Toggle */}
                    <div className="bg-gray-900/50 backdrop-blur-sm p-1 rounded-lg border border-gray-800 flex">
                        <button
                            onClick={() => setLanguage('js')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'js'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            JavaScript
                        </button>
                        <button
                            onClick={() => setLanguage('php')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'php'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            PHP
                        </button>
                    </div>

                    <button
                        onClick={onGoToGithub}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors border border-gray-700"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        GitHub Scanner
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                            <div className="relative bg-[#0A0A0A] rounded-xl border border-gray-800 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-gray-800">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                    </div>
                                    <span className="text-xs text-gray-500 font-mono">
                                        {language === 'php' ? 'snippet.php' : 'snippet.js'}
                                    </span>
                                </div>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder={language === 'php' ? '<?php\n// Paste your PHP code here\necho $_GET["name"];\n?>' : '// Paste your JavaScript code here\ndocument.innerHTML = userInput;'}
                                    className="w-full h-[500px] bg-transparent p-4 text-gray-300 font-mono text-sm focus:outline-none resize-none placeholder-gray-700"
                                    spellCheck="false"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleScan}
                            disabled={!code.trim() || scanning}
                            className="w-full group relative flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-4 rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.4)]"
                        >
                            {scanning ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                                        <path d="M2 12h20" />
                                        <path d="M2 12l5-5" />
                                        <path d="M2 12l5 5" />
                                    </svg>
                                    Analyze Code
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-1">
                        {results === null ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-gray-800 border-dashed rounded-xl bg-gray-900/30 text-gray-500">
                                <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                        <line x1="12" y1="22.08" x2="12" y2="12" />
                                    </svg>
                                </div>
                                <p>Ready to scan.</p>
                                <p className="text-sm opacity-60">Results will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fade-in">
                                <div className={`p-4 rounded-xl border ${results.length === 0 ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${results.length === 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {results.length === 0 ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${results.length === 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {results.length === 0 ? 'Code is Safe' : `${results.length} Issue${results.length > 1 ? 's' : ''} Found`}
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                {results.length === 0 ? 'No XSS patterns detected.' : 'Potential vulnerabilities detected.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {results.map((vuln, idx) => (
                                        <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSeverityColor(vuln.severity)}`}>
                                                    {vuln.severity}
                                                </span>
                                                <span className="text-xs text-gray-500 font-mono">Line {vuln.lineNumber}</span>
                                            </div>

                                            <p className="text-sm text-gray-300 mb-3 font-medium">{vuln.description}</p>

                                            {vuln.codeSnippet && (
                                                <div className="bg-black/50 rounded-lg p-3 mb-3 border border-gray-800">
                                                    <code className="text-xs font-mono text-gray-400 block overflow-x-auto">
                                                        {vuln.codeSnippet}
                                                    </code>
                                                </div>
                                            )}

                                            {vuln.suggestion && (
                                                <div className="flex gap-2 items-start text-xs text-indigo-300 bg-indigo-500/5 p-2 rounded-lg border border-indigo-500/10">
                                                    <svg className="w-4 h-4 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                                    <span>{vuln.suggestion}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickScan;
