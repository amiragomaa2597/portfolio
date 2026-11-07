import type { Localized, PortfolioProject } from '../data/portfolio.data';

export type GithubRepoMeta = {
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  name: string;
};

/** Public case-study repos shown on the portfolio projects section. */
export const FEATURED_GITHUB_REPOS = [
  {
    id: 'jupiter-platform',
    repo: 'amiragomaa2597/Jupiter-Educational-Platform',
    live: 'https://www.jupitersoftware.net',
  },
  {
    id: 'kiddy-ranch',
    repo: 'amiragomaa2597/Kiddy-Ranch-Platform',
    live: 'https://www.kiddyranch.com',
  },
  {
    id: 'green-hub',
    repo: 'amiragomaa2597/green-hub',
    live: 'https://amiragomaa2597.github.io/green-hub/',
  },
  {
    id: 'portfolio-site',
    repo: 'amiragomaa2597/portfolio',
    live: 'https://amiragomaa2597.github.io/portfolio/',
  },
] as const;

function blankPair(en: string, ar = en): Localized {
  return { en, ar };
}

export async function fetchGithubRepo(repo: string): Promise<GithubRepoMeta> {
  const response = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) {
    throw new Error(`GitHub ${repo} failed (${response.status})`);
  }
  return (await response.json()) as GithubRepoMeta;
}

export async function syncFeaturedGithubProjects(
  existing: PortfolioProject[],
): Promise<PortfolioProject[]> {
  const next = structuredClone(existing);
  for (const featured of FEATURED_GITHUB_REPOS) {
    const meta = await fetchGithubRepo(featured.repo);
    const index = next.findIndex((project) => project.id === featured.id);
    const summaryEn = meta.description?.trim() || meta.name;
    const live = meta.homepage?.trim() || featured.live;
    const patch: PortfolioProject = {
      id: featured.id,
      name: meta.name.replace(/-/g, ' '),
      summary: blankPair(summaryEn),
      features: index >= 0 ? next[index].features : [],
      tags: index >= 0 ? next[index].tags : ['GitHub'],
      link: live || undefined,
      githubUrl: meta.html_url,
      githubRepo: featured.repo,
      note: index >= 0 ? next[index].note : undefined,
    };
    if (index >= 0) {
      next[index] = {
        ...next[index],
        name: next[index].name || patch.name,
        summary: next[index].summary.en ? next[index].summary : patch.summary,
        link: live || next[index].link,
        githubUrl: meta.html_url,
        githubRepo: featured.repo,
      };
    } else {
      next.unshift(patch);
    }
  }
  return next;
}
