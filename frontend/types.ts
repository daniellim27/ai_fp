export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubFile {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size: number;
  url: string;
}

export interface Vulnerability {
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  lineNumber: number;
  description: string;
  codeSnippet: string;
  suggestion: string;
}

export interface FileScanResult {
  fileName: string;
  filePath: string;
  vulnerabilities: Vulnerability[];
  status: 'safe' | 'vulnerable' | 'error';
  rawCode?: string;
}

export enum AppView {
  LANDING = 'LANDING',
  TOKEN_INPUT = 'TOKEN_INPUT',
  REPO_LIST = 'REPO_LIST',
  SCANNING = 'SCANNING',
}
