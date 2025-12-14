import { GitHubRepo, GitHubFile } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error("Token validation failed", error);
    return false;
  }
};

export const fetchRepositories = async (token: string): Promise<GitHubRepo[]> => {
  try {
    // Fetch recently updated repos, sort by updated
    const response = await fetch(`${GITHUB_API_BASE}/user/repos?sort=updated&per_page=100&visibility=all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching repos", error);
    throw error;
  }
};

export const fetchRepoFiles = async (token: string, owner: string, repo: string): Promise<GitHubFile[]> => {
  try {
    console.log(`🔍 Fetching files for ${owner}/${repo}...`);

    // Add timeout wrapper
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout after 30s')), 30000)
    );

    // Get the default branch first with timeout
    const repoDetailsPromise = fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => {
      console.log(`✅ Got repo details, status: ${r.status}`);
      return r.json();
    });

    const repoDetails = await Promise.race([repoDetailsPromise, timeoutPromise]);
    const branch = repoDetails.default_branch || 'main';
    console.log(`📌 Using branch: ${branch}`);

    // Get the tree recursively with timeout
    const treeUrl = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    console.log(`🌳 Fetching tree from: ${treeUrl}`);

    const treePromise = fetch(treeUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }).then(async r => {
      console.log(`✅ Got tree response, status: ${r.status}`);
      if (!r.ok) {
        const text = await r.text();
        console.error(`❌ Tree fetch failed: ${r.status} - ${text}`);
        return null as any;
      }
      return r.json();
    });

    const response = await Promise.race([treePromise, timeoutPromise]);

    if (!response || !response.tree) {
      console.warn('⚠️ No tree data returned');
      return [];
    }

    console.log(`✅ Found ${response.tree.length} files`);
    return response.tree || [];
  } catch (error) {
    console.error("❌ Error fetching repo files:", error);
    return [];
  }
};

export const fetchFileContent = async (token: string, url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    // GitHub API returns content in base64
    if (data.content && data.encoding === 'base64') {
      return atob(data.content.replace(/\n/g, ''));
    }
    return '';
  } catch (error) {
    console.error("Error fetching file content", error);
    return '';
  }
};
