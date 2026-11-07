import { buildCvDocument, type CvDocument, type PortfolioContent } from '../data/portfolio.data';
import { tailorCv } from './match-job';

const KEY_STORAGE = 'portfolio.groqKey';
const LEGACY_KEY_STORAGE = 'portfolio.openaiKey';

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
    projects: (ai.projects?.length ? ai.projects : base.projects).map((project) => ({
      name: asString(project.name),
      company: asString(project.company),
      period: asString(project.period),
      summary: asString(project.summary),
      note: asString(project.note) || undefined,
      tags: asStringList(project.tags),
    })),
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

export async function generateCvWithAi(
  content: PortfolioContent,
  jobPost: string,
  apiKey: string,
): Promise<{ cv: CvDocument; matched: string[]; missing: string[] }> {
  const base = buildCvDocument(content, false);
  const local = tailorCv(content, jobPost);
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You tailor an ATS resume for Amira Gomaa. Use ONLY facts from the provided portfolio JSON. ' +
            'Do not invent employers, dates, degrees, skills, projects, or numbers. ' +
            'You may rewrite and reorder summary, skills, experience bullets, and project text to match the job. ' +
            'Keep company names, periods, companyUrl, education urls, and contact hrefs exactly as given. ' +
            'Return JSON with keys: fullName, headline, contacts[{label,value,href}], summary, ' +
            'skills[{title,items}], experience[{role,company,companyUrl,period,product,note,bullets}], ' +
            'projects[{name,company,period,summary,note,tags}], education[{title,detail,url}], ' +
            'matched[string], missing[string]. matched = portfolio skills that fit the job. ' +
            'missing = job requirements not covered by the portfolio. English only.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            jobPost,
            portfolio: sourceFacts(content),
            baseCv: base,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(groqErrorMessage(response.status, detail));
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
  };
  const cv = restoreLinks(parsed, base);
  return {
    cv,
    matched: Array.isArray(parsed.matched) ? parsed.matched.map(String) : local.matched,
    missing: Array.isArray(parsed.missing) ? parsed.missing.map(String) : local.missing,
  };
}
