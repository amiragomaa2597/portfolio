import { buildCvDocument, type CvDocument, type PortfolioContent } from '../data/portfolio.data';

export interface AtsResult {
  cv: CvDocument;
  matched: string[];
  missing: string[];
}

const STOP = new Set(
  `a an the and or of to for in on with at from by as is are was were be been being
  this that these those it its we you your our their they he she i
  will can may should would could about into over under than then
  job role position candidate team company experience years year
  strong ability skills skill required requirements requirement
  including include work working worked using use used
  plus good great excellent preferred knowledge familiar
  responsibilities responsibility responsible looking seeking
  must have has had more other such per via etc
  full time part remote hybrid onsite`.split(/\s+/),
);

const TECH_HINTS = [
  'react', 'vue', 'next.js', 'node', 'node.js', 'python', 'java', 'kotlin', 'swift',
  'go', 'golang', 'rust', 'php', 'laravel', 'django', 'spring', 'rails',
  'kubernetes', 'k8s', 'terraform', 'jenkins', 'azure', 'gcp', 'redis', 'mongodb',
  'graphql', 'kafka', 'microservices', 'mysql', 'oracle', 'nosql', 'figma', 'jira',
  'redux', 'nestjs', 'express', 'aws lambda', 'elasticsearch', 'rabbitmq',
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsTerm(haystack: string, term: string): boolean {
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}([^a-z0-9]|$)`, 'i');
  return pattern.test(haystack);
}

function glossary(content: PortfolioContent): string[] {
  const terms = new Set<string>();
  for (const group of content.skills) {
    for (const tech of group.techs) {
      terms.add(tech.name);
    }
  }
  for (const project of content.projects) {
    terms.add(project.name);
    for (const tag of project.tags ?? []) {
      terms.add(tag);
    }
  }
  return [...terms].filter((term) => term.trim().length > 1);
}

function scoreText(text: string, terms: string[]): number {
  return terms.reduce((total, term) => total + (containsTerm(text, term) ? term.length : 0), 0);
}

function byScore<T>(items: T[], text: (item: T) => string, terms: string[]): T[] {
  return items
    .map((item, index) => ({ item, index, score: scoreText(text(item), terms) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((row) => row.item);
}

function portfolioText(content: PortfolioContent): string {
  const chunks = [
    content.profile.summary.en,
    content.profile.title.en,
    ...content.skills.flatMap((group) => group.techs.map((tech) => tech.name)),
    ...content.projects.flatMap((project) => [
      project.name,
      project.summary.en,
      ...(project.tags ?? []),
      ...(project.features ?? []).map((feature) => feature.en),
    ]),
    ...content.experience.flatMap((job) => [job.role.en, ...job.bullets.map((bullet) => bullet.en)]),
  ];
  return chunks.join('\n');
}

function missingTerms(jobPost: string, corpus: string): string[] {
  const found = new Map<string, string>();
  const add = (label: string): void => {
    const key = label.toLowerCase();
    if (key.length < 2 || STOP.has(key) || containsTerm(corpus, label)) {
      return;
    }
    if (!found.has(key)) {
      found.set(key, label);
    }
  };

  for (const hint of TECH_HINTS) {
    if (containsTerm(jobPost, hint)) {
      add(hint);
    }
  }

  for (const token of jobPost.match(/[A-Za-z][A-Za-z0-9+#./-]{1,}/g) ?? []) {
    const technical = /[0-9+#./]/.test(token) || (token.length <= 6 && token === token.toUpperCase() && token.length >= 2);
    if (technical) {
      add(token);
    }
  }

  return [...found.values()].slice(0, 16);
}

export function tailorCv(content: PortfolioContent, jobPost: string): AtsResult {
  const terms = glossary(content).filter((term) => containsTerm(jobPost, term));
  const cv = buildCvDocument(content, false);
  cv.skills = cv.skills.map((group) => ({
    ...group,
    items: byScore(group.items, (item) => item, terms),
  }));
  cv.experience = byScore(cv.experience, (job) => [job.role, job.product ?? '', ...job.bullets].join(' '), terms)
    .map((job) => ({
      ...job,
      bullets: byScore(job.bullets, (bullet) => bullet, terms),
    }));
  cv.projects = byScore(
    cv.projects,
    (project) => [project.name, project.summary, ...project.tags].join(' '),
    terms,
  );
  return {
    cv,
    matched: terms,
    missing: missingTerms(jobPost, portfolioText(content)),
  };
}
