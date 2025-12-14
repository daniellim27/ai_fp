import { Vulnerability } from '../types';

// Separate API endpoints for PHP and JS scanners on HuggingFace Spaces
const PHP_API_URL = import.meta.env.VITE_PHP_API_URL || 'https://mekbus-xss-php.hf.space/api/v1';
const JS_API_URL = import.meta.env.VITE_JS_API_URL || 'https://mekbus-xss-js.hf.space/api/v1';

// For local development
const LOCAL_API_URL = 'http://localhost:8080/api/v1';
const USE_LOCAL = typeof window !== 'undefined' && window.location.hostname === 'localhost';

function getApiUrl(language: string): string {
    if (USE_LOCAL) return LOCAL_API_URL;
    return language === 'php' ? PHP_API_URL : JS_API_URL;
}

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

        const apiUrl = getApiUrl(language);
        console.log(`Scanning ${filePath} using ${apiUrl}`);

        const response = await fetch(`${apiUrl}/scan`, {
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
    // Process files in parallel, routing to correct API
    const results = await Promise.all(
        files.map(f => analyzeCodeForVulnerabilities(f.code, f.filePath))
    );
    return results;
};

/**
 * Check API health (checks PHP API by default)
 */
export const checkHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${PHP_API_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
};
