import React, { useState } from 'react';
import { analyzeCodeForVulnerabilities } from '../services/codebertService';
import { Vulnerability } from '../types';

interface QuickScanProps {
    onBack: () => void;
}

const QuickScan: React.FC<QuickScanProps> = ({ onBack }) => {
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
            case 'critical': return 'text-red-400 bg-red-500/10';
            case 'high': return 'text-orange-400 bg-orange-500/10';
            case 'medium': return 'text-yellow-400 bg-yellow-500/10';
            case 'low': return 'text-blue-400 bg-blue-500/10';
            default: return 'text-gray-400 bg-gray-500/10';
        }
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="text-gray-400 hover:text-white transition mb-4 flex items-center gap-2"
                    >
                        ← Back
                    </button>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        Quick XSS Scan
                    </h1>
                    <p className="text-gray-400 mt-2">Paste your code below to check for XSS vulnerabilities</p>
                </div>

                {/* Language Selector */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setLanguage('js')}
                            className={`px-6 py-2 rounded-lg transition ${language === 'js'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            JavaScript
                        </button>
                        <button
                            onClick={() => setLanguage('php')}
                            className={`px-6 py-2 rounded-lg transition ${language === 'php'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            PHP
                        </button>
                    </div>
                </div>

                {/* Code Editor */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Code</label>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder={language === 'php' ? '<?php\necho $_GET["name"];\n?>' : 'document.innerHTML = userInput;'}
                        className="w-full h-96 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 resize-none"
                    />
                </div>

                {/* Scan Button */}
                <button
                    onClick={handleScan}
                    disabled={!code.trim() || scanning}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition mb-8"
                >
                    {scanning ? 'Scanning...' : 'Scan for Vulnerabilities'}
                </button>

                {/* Results */}
                {results !== null && (
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            {results.length === 0 ? (
                                <>
                                    <span className="text-green-400">✓</span>
                                    <span>No Vulnerabilities Found</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-red-400">⚠</span>
                                    <span>{results.length} Vulnerabilit{results.length > 1 ? 'ies' : 'y'} Found</span>
                                </>
                            )}
                        </h2>

                        {results.length > 0 && (
                            <div className="space-y-4">
                                {results.map((vuln, idx) => (
                                    <div key={idx} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(vuln.severity)}`}>
                                                {vuln.severity}
                                            </span>
                                            <span className="text-gray-400 text-sm">Line {vuln.lineNumber}</span>
                                        </div>

                                        <p className="text-white mb-3">{vuln.description}</p>

                                        {vuln.codeSnippet && (
                                            <pre className="bg-gray-900 border border-gray-700 rounded p-3 text-sm text-gray-300 overflow-x-auto mb-3">
                                                <code>{vuln.codeSnippet}</code>
                                            </pre>
                                        )}

                                        {vuln.suggestion && (
                                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded p-3">
                                                <p className="text-sm text-indigo-300">
                                                    <strong>Suggestion:</strong> {vuln.suggestion}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickScan;
