import { supabase } from './supabaseClient';
import { Vulnerability } from '../types';

export interface ScanRecord {
    id: string;
    user_id: string;
    scan_type: 'quick_scan' | 'github_repo';
    target_name: string;
    language: string | null;
    vulnerabilities_count: number;
    vulnerabilities: Vulnerability[];
    code_snippet: string | null;
    created_at: string;
}

export async function saveScan(
    scanType: 'quick_scan' | 'github_repo',
    targetName: string,
    vulnerabilities: Vulnerability[],
    language?: string,
    codeSnippet?: string
): Promise<ScanRecord | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log('No user logged in, scan not saved');
        return null;
    }

    const { data, error } = await supabase
        .from('scans')
        .insert({
            user_id: user.id,
            scan_type: scanType,
            target_name: targetName,
            language: language || null,
            vulnerabilities_count: vulnerabilities.length,
            vulnerabilities: vulnerabilities,
            code_snippet: codeSnippet ? codeSnippet.substring(0, 1000) : null // Limit size
        })
        .select()
        .single();

    if (error) {
        console.error('Error saving scan:', error);
        return null;
    }

    return data;
}

export async function getScans(): Promise<ScanRecord[]> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return [];
    }

    const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching scans:', error);
        return [];
    }

    return data || [];
}

export async function deleteScan(scanId: string): Promise<boolean> {
    const { error } = await supabase
        .from('scans')
        .delete()
        .eq('id', scanId);

    if (error) {
        console.error('Error deleting scan:', error);
        return false;
    }

    return true;
}
