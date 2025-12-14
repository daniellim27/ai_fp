import { Vulnerability } from '../types';

// API URL: Use env variable or fallback to production/localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    || (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? 'https://YOUR_HF_SPACE_URL.hf.space/api/v1'  // TODO: Replace with actual HF Space URL
        : 'http://localhost:8080/api/v1');

interface ScanResponse {
    is_vulnerable: boolean;
    confidence: number;
    label: string;
    vulnerabilities: Array<{
        type: string;
        severity: string;
        line_number: number | null;
        description: string;
        code_snippet: string;
        suggestion: string;
    }>;
    processing_time_ms: number;
    cached: boolean;
}

/**
 * Normalize severity from API to match frontend type
 */
function normalizeSeverity(severity: string): 'Critical' | 'High' | 'Medium' | 'Low' | 'Info' {
    const normalized = severity.toLowerCase();

    if (normalized === 'critical') return 'Critical';
    if (normalized === 'high') return 'High';
    if (normalized === 'medium') return 'Medium';
    if (normalized === 'low') return 'Low';

    return 'Info';
}

/**
 * Determine language from file path
 */
function getLanguageFromPath(filePath: string): 'php' | 'js' | null {
    const ext = filePath.toLowerCase().split('.').pop();

    if (ext === 'php') return 'php';
    if (['js', 'jsx', 'ts', 'tsx'].includes(ext || '')) return 'js';

    return null;
}

/**
 * Analyze code for XSS vulnerabilities using CodeBERT API
 */
export const analyzeCodeForVulnerabilities = async (
    code: string,
    filePath: string
): Promise<Vulnerability[]> => {
    try {
        // Determine language from file extension
        const language = getLanguageFromPath(filePath);

        if (!language) {
            console.warn(`Unsupported file type: ${filePath}`);
            return [];
        }

        const response = await fetch(`${API_BASE_URL}/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                language,
                file_path: filePath,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data: ScanResponse = await response.json();

        // Convert API response to frontend Vulnerability format
        return data.vulnerabilities.map(v => ({
            type: v.type,
            severity: normalizeSeverity(v.severity),
            lineNumber: v.line_number || 1,
            description: v.description,
            codeSnippet: v.code_snippet,
            suggestion: v.suggestion,
        }));
    } catch (error) {
        console.error('CodeBERT API error:', error);
        // Return empty array on error instead of throwing
        return [];
    }
};

/**
 * Batch analyze multiple files
 */
export const analyzeBatch = async (
    files: Array<{ code: string; filePath: string }>
): Promise<Array<Vulnerability[]>> => {
    try {
        const requests = files.map(f => ({
            code: f.code,
            language: getLanguageFromPath(f.filePath) || 'js',
            file_path: f.filePath,
        }));

        const response = await fetch(`${API_BASE_URL}/scan/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ files: requests }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        return data.results.map((result: ScanResponse) =>
            result.vulnerabilities.map(v => ({
                type: v.type,
                severity: normalizeSeverity(v.severity),
                lineNumber: v.line_number || 1,
                description: v.description,
                codeSnippet: v.code_snippet,
                suggestion: v.suggestion,
            }))
        );
    } catch (error) {
        console.error('CodeBERT batch API error:', error);
        return files.map(() => []);
    }
};

/**
 * Check API health
 */
export const checkHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
};
