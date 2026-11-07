import { Component, computed, inject, signal } from '@angular/core';
import {
  buildApplicationMessage,
  generateCvWithAi,
  PORTFOLIO_URL,
  readGroqKey,
  rewriteIntro,
  writeGroqKey,
} from '../../ats/ai-cv';
import { tailorCv } from '../../ats/match-job';
import { downloadCvPdf } from '../../cv/download-cv';
import {
  CV_HEADINGS,
  type CvDocument,
  type CvExperience,
  type CvProject,
  type CvSkillLine,
} from '../../data/portfolio.data';
import { LanguageService } from '../../i18n/language.service';
import { ContentStore } from '../../state/content.store';

@Component({
  selector: 'app-ats',
  templateUrl: './ats.html',
  styleUrl: './ats.scss',
})
export class AtsPage {
  readonly i18n = inject(LanguageService);
  private readonly content = inject(ContentStore);
  readonly headings = CV_HEADINGS;
  readonly portfolioUrl = PORTFOLIO_URL;
  readonly copy = computed(() => (this.i18n.lang() === 'ar' ? AR : EN));
  readonly jobPost = signal('');
  readonly apiKey = signal(readGroqKey());
  readonly draft = signal<CvDocument | null>(null);
  readonly messageBody = signal('');
  readonly matched = signal<string[]>([]);
  readonly missing = signal<string[]>([]);
  readonly error = signal('');
  readonly busy = signal(false);
  readonly copied = signal(false);

  setJob(event: Event): void {
    this.jobPost.set((event.target as HTMLTextAreaElement).value);
  }

  setKey(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.apiKey.set(value);
    writeGroqKey(value);
  }

  setMessage(event: Event): void {
    this.messageBody.set((event.target as HTMLTextAreaElement).value);
    this.copied.set(false);
  }

  text(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  patch(mutator: (cv: CvDocument) => void): void {
    const current = this.draft();
    if (!current) {
      return;
    }
    const next = structuredClone(current);
    mutator(next);
    this.draft.set(next);
  }

  setSkills(group: CvSkillLine, value: string): void {
    group.items = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  setBullets(job: CvExperience, value: string): void {
    job.bullets = value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  setTags(project: CvProject, value: string): void {
    project.tags = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async buildWithAi(): Promise<void> {
    const post = this.jobPost().trim();
    const key = this.apiKey().trim();
    if (!post) {
      this.error.set(this.copy().empty);
      return;
    }
    if (!key) {
      this.error.set(this.copy().needKey);
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.copied.set(false);
    try {
      const result = await generateCvWithAi(this.content.content(), post, key);
      this.draft.set(result.cv);
      this.matched.set(result.matched);
      this.missing.set(result.missing);
      this.messageBody.set(result.messageBody);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : this.copy().aiFailed);
    } finally {
      this.busy.set(false);
    }
  }

  buildLocal(): void {
    const post = this.jobPost().trim();
    if (!post) {
      this.error.set(this.copy().empty);
      return;
    }
    this.error.set('');
    this.copied.set(false);
    const portfolio = this.content.content();
    const result = tailorCv(portfolio, post);
    const intro = rewriteIntro(portfolio, post, result.matched);
    result.cv.headline = intro.headline;
    result.cv.summary = intro.summary;
    this.draft.set(result.cv);
    this.matched.set(result.matched);
    this.missing.set(result.missing);
    this.messageBody.set(buildApplicationMessage(portfolio, post, result.matched, result.cv));
  }

  download(): void {
    const current = this.draft();
    if (!current) {
      return;
    }
    void downloadCvPdf({
      ...current,
      fileName: tailoredCvFileName(current.fullName, current.headline),
    });
  }

  async copyMessage(): Promise<void> {
    const text = this.messageBody().trim();
    if (!text) {
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(true);
    } catch {
      this.error.set(this.copy().copyFailed);
    }
  }
}

function tailoredCvFileName(fullName: string, headline: string): string {
  const namePart = slugFilePart(fullName) || 'Amira_Gomaa';
  const titleSource = headline.split('|')[0]?.trim() || headline;
  const titlePart = slugFilePart(titleSource) || 'CV';
  return `${namePart}_${titlePart}.pdf`;
}

function slugFilePart(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[^\w\s-]+/g, ' ')
    .trim()
    .replace(/[\s_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

const EN = {
  eyebrow: 'ATS builder',
  title: 'Shape the CV to the role',
  lead: 'Paste the job post. AI rewrites the title and opening paragraph, builds a copy-ready message with your portfolio link, then you can edit and download.',
  placeholder: 'Paste the job requirements here',
  apiKey: 'Groq API key',
  apiHint: 'Free key from console.groq.com. Saved only in this browser.',
  buildAi: 'Generate with AI',
  buildLocal: 'Local match only',
  download: 'Download PDF',
  matched: 'Brought forward',
  missing: 'Left out',
  noneMissing: 'Nothing in the post was left out.',
  empty: 'Paste a job post first.',
  needKey: 'Add your Groq API key to generate with AI.',
  aiFailed: 'AI generation failed.',
  edit: 'Edit the preview before download',
  busy: 'Generating…',
  messageTitle: 'Application message',
  messageLead: 'Copy this body after the CV. It already includes your portfolio link.',
  copyMessage: 'Copy message',
  copied: 'Copied',
  copyFailed: 'Could not copy. Select the text and copy it manually.',
  portfolio: 'Portfolio',
};

const AR = {
  eyebrow: 'بناء السيرة',
  title: 'تهيئة السيرة للوظيفة',
  lead: 'الصقي إعلان الوظيفة. يعيد الذكاء الاصطناعي كتابة العنوان والفقرة الأولى، ويبني رسالة جاهزة للنسخ مع رابط معرضك، ثم عدّلي وحمّلي.',
  placeholder: 'الصقي متطلبات الوظيفة هنا',
  apiKey: 'مفتاح Groq',
  apiHint: 'مفتاح مجاني من console.groq.com. يُحفظ في هذا المتصفح فقط.',
  buildAi: 'توليد بالذكاء الاصطناعي',
  buildLocal: 'مطابقة محلية فقط',
  download: 'تحميل PDF',
  matched: 'قُدّم في السيرة',
  missing: 'تُرك خارج السيرة',
  noneMissing: 'لا يوجد في الإعلان ما تُرك خارج السيرة.',
  empty: 'الصقي إعلان الوظيفة أولاً.',
  needKey: 'أضيفي مفتاح Groq للتوليد بالذكاء الاصطناعي.',
  aiFailed: 'فشل التوليد بالذكاء الاصطناعي.',
  edit: 'عدّلي المعاينة قبل التحميل',
  busy: 'جارٍ التوليد…',
  messageTitle: 'رسالة التقديم',
  messageLead: 'انسخِ هذه الرسالة مع السيرة. رابط معرضك موجود داخلها.',
  copyMessage: 'نسخ الرسالة',
  copied: 'تم النسخ',
  copyFailed: 'تعذّر النسخ. حدّدي النص وانسخيه يدوياً.',
  portfolio: 'المعرض',
};
