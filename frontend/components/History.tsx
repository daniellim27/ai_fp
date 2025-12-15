import React, { useEffect, useState } from 'react';
import { getScans, deleteScan, ScanRecord } from '../services/historyService';
import Button from './Button';

interface HistoryProps {
    onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ onBack }) => {
    const [scans, setScans] = useState<ScanRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedScan, setExpandedScan] = useState<string | null>(null);

    useEffect(() => {
        loadScans();
    }, []);

    const loadScans = async () => {
        setLoading(true);
        const data = await getScans();
        setScans(data);
        setLoading(false);
    };

    const handleDelete = async (scanId: string) => {
        if (confirm('Are you sure you want to delete this scan?')) {
            const success = await deleteScan(scanId);
            if (success) {
                setScans(scans.filter(s => s.id !== scanId));
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getScanTypeIcon = (type: string) => {
        if (type === 'github_repo') {
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
            );
        }
        return (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        );
    };

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Scan History</h1>
                    <p className="text-gray-400">View your past vulnerability scans</p>
                </div>
                <div className="flex gap-3">
                    <Button onClick={loadScans} variant="secondary">
                        Refresh
                    </Button>
                    <Button variant="ghost" onClick={onBack}>
                        ← Back
                    </Button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse border border-white/5"></div>
                    ))}
                </div>
            ) : scans.length === 0 ? (
                <div className="text-center py-20">
                    <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-xl text-gray-300 mb-2">No scans yet</h3>
                    <p className="text-gray-500">Run a Quick Scan or scan a GitHub repository to see your history here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {scans.map(scan => (
                        <div
                            key={scan.id}
                            className="glass-panel rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
                        >
                            {/* Main Row */}
                            <div
                                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                                onClick={() => setExpandedScan(expandedScan === scan.id ? null : scan.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${scan.scan_type === 'github_repo' ? 'bg-purple-500/10 text-purple-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                        {getScanTypeIcon(scan.scan_type)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{scan.target_name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {scan.scan_type === 'github_repo' ? 'GitHub Repo' : 'Quick Scan'}
                                            {scan.language && ` • ${scan.language.toUpperCase()}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className={`font-bold ${scan.vulnerabilities_count === 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {scan.vulnerabilities_count === 0 ? 'Safe' : `${scan.vulnerabilities_count} Issue${scan.vulnerabilities_count > 1 ? 's' : ''}`}
                                        </p>
                                        <p className="text-xs text-gray-500">{formatDate(scan.created_at)}</p>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(scan.id); }}
                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>

                                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedScan === scan.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedScan === scan.id && scan.vulnerabilities && scan.vulnerabilities.length > 0 && (
                                <div className="border-t border-gray-800 p-5 bg-black/20">
                                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Vulnerabilities Found:</h4>
                                    <div className="space-y-3">
                                        {scan.vulnerabilities.slice(0, 5).map((vuln, idx) => (
                                            <div key={idx} className="bg-gray-900/50 p-3 rounded-lg">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${vuln.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                                            vuln.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                                vuln.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                    'bg-blue-500/20 text-blue-400'
                                                        }`}>
                                                        {vuln.severity}
                                                    </span>
                                                    <span className="text-xs text-gray-500">Line {vuln.lineNumber}</span>
                                                </div>
                                                <p className="text-sm text-gray-300">{vuln.description}</p>
                                            </div>
                                        ))}
                                        {scan.vulnerabilities.length > 5 && (
                                            <p className="text-sm text-gray-500">+ {scan.vulnerabilities.length - 5} more issues</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
