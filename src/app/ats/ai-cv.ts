import { buildCvDocument, type CvDocument, type PortfolioContent } from '../data/portfolio.data';
import { tailorCv } from './match-job';

const KEY_STORAGE = 'portfolio.groqKey';
const LEGACY_KEY_STORAGE = 'portfolio.openaiKey';
export const PORTFOLIO_URL = 'https://amiragomaa2597.github.io/portfolio/';

export function readGroqKey(): string {
  try {
    return localStorage.getItem(KEY_STORAGE) ?? localStorage.getItem(LEGACY_KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
}

export function writeGroqKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(KEY_STORAGE);
    }
    localStorage.removeItem(LEGACY_KEY_STORAGE);
  } catch {
    /* ignore */
  }
}

function sourceFacts(content: PortfolioContent): unknown {
  return {
    fullName: content.profile.fullName,
    title: content.profile.title.en,
    summary: content.profile.summary.en,
    skills: content.skills.map((group) => ({
      title: group.title,
      items: group.techs.map((tech) => tech.name),
    })),
    experience: content.experience.map((job) => {
      const project = content.projects.find((item) => item.id === job.projectId);
      return {
        role: job.role.en,
        company: job.company,
        companyUrl: job.companyUrl,
        period: job.period.en,
        product: project?.name,
        note: project?.note?.en,
        bullets: [
          ...(project ? [project.summary.en] : []),
          ...job.bullets.map((bullet) => bullet.en),
        ],
        tags: project?.tags ?? [],
      };
    }),
    projects: content.projects.map((project) => {
      const job = content.experience.find((item) => item.projectId === project.id);
      return {
        name: project.name,
        company: job?.company ?? '',
        period: job?.period.en ?? '',
        summary: project.summary.en,
        note: project.note?.en,
        features: (project.features ?? []).map((feature) => feature.en),
        tags: project.tags,
      };
    }),
    education: content.education.map((item) => ({
      title: item.title.en,
      detail: `${item.subtitle.en}${/\d/.test(item.year.en) ? ` | ${item.year.en}` : ''}`,
      url: item.url,
    })),
    contacts: content.contacts
      .filter((channel) => channel.icon !== 'cv')
      .map((channel) => ({
        label: channel.label,
        value: channel.icon === 'linkedin' || channel.icon === 'github' ? channel.href : channel.value,
        href: channel.href,
      })),
  };
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => asString(item)).filter(Boolean) : [];
}

function restoreLinks(ai: CvDocument, base: CvDocument): CvDocument {
  const byLabel = new Map(base.contacts.map((contact) => [contact.label.toLowerCase(), contact]));
  const byCompany = new Map(base.experience.map((job) => [job.company.toLowerCase(), job]));
  const byEducation = new Map(base.education.map((item) => [item.title.toLowerCase(), item]));
  const byProject = new Map(base.projects.map((project) => [project.name.toLowerCase(), project]));

  return {
    ...base,
    ...ai,
    fileName: base.fileName,
    fullName: asString(ai.fullName, base.fullName),
    headline: asString(ai.headline, base.headline),
    summary: asString(ai.summary, base.summary),
    contacts: (ai.contacts?.length ? ai.contacts : base.contacts).map((contact) => {
      const known = byLabel.get(contact.label.toLowerCase());
      return {
        label: asString(contact.label, known?.label ?? ''),
        value: asString(contact.value, known?.value ?? ''),
        href: asString(contact.href, known?.href ?? '') || known?.href,
      };
    }),
    skills: (ai.skills?.length ? ai.skills : base.skills).map((group) => ({
      title: asString(group.title),
      items: asStringList(group.items),
    })),
    experience: (ai.experience?.length ? ai.experience : base.experience).map((job) => {
      const known = byCompany.get(asString(job.company).toLowerCase());
      return {
        role: asString(job.role, known?.role ?? ''),
        company: asString(job.company, known?.company ?? ''),
        companyUrl: asString(job.companyUrl, known?.companyUrl ?? '') || known?.companyUrl || '',
        period: asString(job.period, known?.period ?? ''),
        product: asString(job.product, known?.product ?? '') || undefined,
        note: asString(job.note, known?.note ?? '') || undefined,
        bullets: asStringList(job.bullets),
      };
    }),
    projects: (ai.projects?.length ? ai.projects : base.projects).map((project) => {
      const known =
        byProject.get(asString(project.name).toLowerCase())
        ?? base.projects.find((item) =>
          asString(project.name).toLowerCase().includes(item.name.toLowerCase().slice(0, 18))
          || item.name.toLowerCase().includes(asString(project.name).toLowerCase().slice(0, 18)),
        );
      return {
        name: asString(project.name, known?.name ?? ''),
        company: asString(project.company, known?.company ?? ''),
        period: asString(project.period, known?.period ?? ''),
        summary: asString(project.summary, known?.summary ?? ''),
        note: asString(project.note, known?.note ?? '') || undefined,
        tags: asStringList(project.tags).length ? asStringList(project.tags) : (known?.tags ?? []),
        link: asString(project.link, known?.link ?? '') || known?.link,
        githubUrl: asString(project.githubUrl, known?.githubUrl ?? '') || known?.githubUrl,
        playStoreUrl: asString(project.playStoreUrl, known?.playStoreUrl ?? '') || known?.playStoreUrl,
        appStoreUrl: asString(project.appStoreUrl, known?.appStoreUrl ?? '') || known?.appStoreUrl,
      };
    }),
    education: (ai.education?.length ? ai.education : base.education).map((item) => {
      const known = byEducation.get(asString(item.title).toLowerCase());
      return {
        title: asString(item.title, known?.title ?? ''),
        detail: asString(item.detail, known?.detail ?? ''),
        url: asString(item.url, known?.url ?? '') || known?.url || '',
      };
    }),
  };
}

function parseAiJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced?.[1]?.trim() ?? trimmed;
  return JSON.parse(body);
}

function groqErrorMessage(status: number, detail: string): string {
  if (status === 401) {
    return 'Groq rejected the API key. Create a new key at console.groq.com/keys.';
  }
  if (status === 429) {
    return 'Groq free limit reached. Wait a minute and try again.';
  }
  return detail || `Groq request failed (${status})`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function jobMentions(jobPost: string, term: string): boolean {
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}([^a-z0-9]|$)`, 'i');
  return pattern.test(jobPost);
}

function matchedSkills(content: PortfolioContent, jobPost: string): string[] {
  const skills = content.skills.flatMap((group) => group.techs.map((tech) => tech.name));
  const aliases: Array<[string, string]> = [
    ['ASP.NET', 'ASP.NET Core'],
    ['.NET', '.NET'],
    ['C#', 'C#'],
    ['Angular', 'Angular'],
    ['Flutter', 'Flutter'],
    ['TypeScript', 'TypeScript'],
    ['SQL Server', 'SQL Server'],
    ['PostgreSQL', 'PostgreSQL'],
    ['Docker', 'Docker'],
    ['AWS S3', 'AWS'],
    ['Entity Framework', 'Entity Framework'],
    ['REST APIs', 'REST'],
  ];
  const found: string[] = [];
  for (const [skill, alias] of aliases) {
    if (skills.includes(skill) && (jobMentions(jobPost, skill) || jobMentions(jobPost, alias))) {
      found.push(skill);
    }
  }
  for (const skill of skills) {
    if (!found.includes(skill) && jobMentions(jobPost, skill)) {
      found.push(skill);
    }
  }
  return found.slice(0, 6);
}

function guessRoleTitle(jobPost: string): string {
  const lines = jobPost
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const roleLine =
    lines.find((line) =>
      /\b(developer|engineer|fullstack|full[- ]stack|\.net|angular|flutter|software)\b/i.test(line)
      && line.length < 90,
    ) ?? '';
  const cleaned = roleLine
    .replace(/^(job title|title|role|position)\s*[:\-]\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned && cleaned.length > 3) {
    return cleaned;
  }
  if (jobMentions(jobPost, 'Full Stack') || jobMentions(jobPost, 'Full-Stack')) {
    return 'Full Stack Developer';
  }
  if (jobMentions(jobPost, '.NET') || jobMentions(jobPost, 'ASP.NET')) {
    return '.NET Developer';
  }
  if (jobMentions(jobPost, 'Angular')) {
    return 'Angular Developer';
  }
  if (jobMentions(jobPost, 'Flutter')) {
    return 'Flutter Developer';
  }
  return 'Full Stack Developer';
}

/** Always rewrite title + opening paragraph so the CV visibly matches the job. */
export function rewriteIntro(
  content: PortfolioContent,
  jobPost: string,
  matched: string[],
): { headline: string; summary: string } {
  const skills = matched.length ? matched : matchedSkills(content, jobPost);
  const role = guessRoleTitle(jobPost);
  const skillPart = skills.length ? skills.join(', ') : 'C#, ASP.NET Core, Angular';
  const headline = `${role} | ${skillPart}`;
  const focus = skills.slice(0, 4).join(', ') || '.NET, Angular, and Flutter';
  const years = content.profile.yearsValue;
  const summary =
    `${role} with ${years} years building production web and mobile systems. ` +
    `Strong fit for this role through hands-on work with ${focus}. ` +
    `Experienced delivering ERP and HR platforms, REST APIs, multi-tenant SaaS, and store releases — ` +
    `ready to apply the same stack to the requirements in this posting.`;
  return { headline, summary };
}

function almostSame(a: string, b: string): boolean {
  const norm = (value: string) => value.toLowerCase().replace(/\s+/g, ' ').trim();
  return norm(a) === norm(b) || (norm(a).includes(norm(b).slice(0, 40)) && norm(b).length > 40);
}

/** Free-tier chat models after Llama was removed from developer accounts. */
const GROQ_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'] as const;

async function callGroq(apiKey: string, model: string, messages: Array<{ role: string; content: string }>): Promise<Response> {
  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      response_format: { type: 'json_object' },
      messages,
    }),
  });
}

export function buildApplicationMessage(
  content: PortfolioContent,
  jobPost: string,
  matched: string[],
  cv?: CvDocument,
): string {
  const role = guessRoleTitle(jobPost);
  const skills = (matched.length ? matched : matchedSkills(content, jobPost)).slice(0, 5).join(', ');
  const headline = cv?.headline || rewriteIntro(content, jobPost, matched).headline;
  const email =
    content.contacts.find((channel) => channel.icon === 'email')?.value
    ?? 'amiragomaa2597@gmail.com';
  return [
    `Dear Hiring Team,`,
    ``,
    `I am writing to apply for the ${role} role. I am a full-stack developer with hands-on experience that matches this posting, especially ${skills || '.NET, Angular, and SQL Server'}.`,
    ``,
    `My tailored profile for this role: ${headline}.`,
    `You can review my portfolio here: ${PORTFOLIO_URL}`,
    ``,
    `I would welcome the chance to discuss how I can contribute. Thank you for your time.`,
    ``,
    `Best regards,`,
    `Amira Gomaa Hassan`,
    email,
    PORTFOLIO_URL,
  ].join('\n');
}

export async function generateCvWithAi(
  content: PortfolioContent,
  jobPost: string,
  apiKey: string,
): Promise<{ cv: CvDocument; matched: string[]; missing: string[]; messageBody: string }> {
  const base = buildCvDocument(content, false);
  const local = tailorCv(content, jobPost);
  const matched = local.matched.length ? local.matched : matchedSkills(content, jobPost);
  const introHint = rewriteIntro(content, jobPost, matched);
  const messages = [
    {
      role: 'system',
      content:
        'You are rewriting Amira Gomaa\'s ATS resume for ONE specific job. English only. ' +
        'CRITICAL: You MUST rewrite "headline" (the CV title under her name) and "summary" (the first paragraph). ' +
        'They must NOT copy the original portfolio wording. Mirror the job title and lead with requirements she actually meets. ' +
        'Use ONLY facts from portfolio. Do not invent employers, dates, degrees, skills, projects, or numbers. ' +
        'Keep company names, periods, companyUrl, education urls, and contact hrefs exactly as given. ' +
        'Reorder skills and experience bullets so job-matching lines come first. ' +
        'Also write messageBody: a short professional email/application body (4-7 short paragraphs or spaced lines) ' +
        'that she can copy-paste with the CV. It MUST include the exact portfolio URL provided. ' +
        'Do not invent employers. Keep the tone confident and concise. Sign as Amira Gomaa Hassan. ' +
        'Return JSON with keys: fullName, headline, contacts[{label,value,href}], summary, ' +
        'skills[{title,items}], experience[{role,company,companyUrl,period,product,note,bullets}], ' +
        'projects[{name,company,period,summary,note,tags}], education[{title,detail,url}], ' +
        'matched[string], missing[string], messageBody[string].',
    },
    {
      role: 'user',
      content: JSON.stringify({
        instruction:
          'Write a new headline, a new opening summary, and a copy-ready application messageBody for this job. Example headline direction only: ' +
          introHint.headline,
        portfolioUrl: PORTFOLIO_URL,
        jobPost,
        portfolio: sourceFacts(content),
        mustChange: {
          originalHeadline: base.headline,
          originalSummary: base.summary,
          required: 'headline and summary must be different from originalHeadline and originalSummary',
          messageBodyMustInclude: PORTFOLIO_URL,
        },
      }),
    },
  ];

  let response: Response | null = null;
  let lastDetail = '';
  for (const model of GROQ_MODELS) {
    response = await callGroq(apiKey, model, messages);
    if (response.ok) {
      break;
    }
    lastDetail = await response.text();
    if (!/model_not_found|does not exist|do not have access/i.test(lastDetail)) {
      throw new Error(groqErrorMessage(response.status, lastDetail));
    }
  }

  if (!response?.ok) {
    throw new Error(groqErrorMessage(response?.status ?? 404, lastDetail));
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const contentText = payload.choices?.[0]?.message?.content;
  if (!contentText) {
    throw new Error('Groq returned an empty response.');
  }

  const parsed = parseAiJson(contentText) as CvDocument & {
    matched?: string[];
    missing?: string[];
    messageBody?: string;
  };
  const cv = restoreLinks(parsed, base);

  // Guarantee the title and first paragraph always change for the job.
  if (almostSame(cv.headline, base.headline) || !cv.headline.trim()) {
    cv.headline = introHint.headline;
  }
  if (almostSame(cv.summary, base.summary) || !cv.summary.trim()) {
    cv.summary = introHint.summary;
  }

  const finalMatched =
    Array.isArray(parsed.matched) && parsed.matched.length
      ? parsed.matched.map(String)
      : matched;
  let messageBody = asString(parsed.messageBody).trim();
  if (!messageBody || !messageBody.includes(PORTFOLIO_URL)) {
    messageBody = buildApplicationMessage(content, jobPost, finalMatched, cv);
  }

  return {
    cv,
    matched: finalMatched,
    missing: Array.isArray(parsed.missing) ? parsed.missing.map(String) : local.missing,
    messageBody,
  };
}
