import { Component, computed, inject, signal } from '@angular/core';
import {
  publishedContent,
  type ContactIcon,
  type ExperienceItem,
  type Localized,
  type PortfolioContent,
  type PortfolioProject,
  type SkillGroup,
} from '../../data/portfolio.data';
import { LanguageService } from '../../i18n/language.service';
import { syncFeaturedGithubProjects } from '../../projects/github-projects';
import { ContentStore } from '../../state/content.store';

type Section = 'profile' | 'skills' | 'projects' | 'experience' | 'education' | 'certificates' | 'contacts';

const ICONS: ContactIcon[] = ['whatsapp', 'linkedin', 'github', 'email', 'phone', 'cv'];

@Component({
  selector: 'app-edit',
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class EditPage {
  readonly i18n = inject(LanguageService);
  readonly store = inject(ContentStore);
  readonly icons = ICONS;
  readonly sections: Section[] = [
    'profile',
    'skills',
    'projects',
    'experience',
    'education',
    'certificates',
    'contacts',
  ];
  readonly section = signal<Section>('profile');
  readonly note = signal('');
  readonly syncing = signal(false);
  draft: PortfolioContent = structuredClone(this.store.content());
  readonly copy = computed(() => (this.i18n.lang() === 'ar' ? AR : EN));

  show(section: Section): void {
    this.section.set(section);
  }

  save(): void {
    this.store.save(this.draft);
    this.note.set(this.copy().saved);
  }

  reset(): void {
    this.store.reset();
    this.draft = structuredClone(publishedContent());
    this.note.set(this.copy().resetDone);
  }

  exportFile(): void {
    const blob = new Blob([JSON.stringify(this.draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'portfolio-content.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  onImport(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.readImport(String(reader.result ?? ''));
    reader.readAsText(file);
  }

  text(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  asIcon(value: string): ContactIcon {
    return this.icons.includes(value as ContactIcon) ? (value as ContactIcon) : 'email';
  }

  focusText(lang: 'en' | 'ar'): string {
    return this.draft.profile.focusItems[lang].join('\n');
  }

  setFocus(lang: 'en' | 'ar', value: string): void {
    this.draft.profile.focusItems[lang] = this.lines(value);
  }

  techText(group: SkillGroup): string {
    return group.techs.map((tech) => `${tech.name} | ${tech.slug}`).join('\n');
  }

  setTechs(group: SkillGroup, value: string): void {
    group.techs = this.lines(value).map((line) => {
      const [name, slug] = line.split('|');
      return { name: (name ?? '').trim(), slug: (slug ?? 'architecture').trim() || 'architecture' };
    });
  }

  featureText(project: PortfolioProject): string {
    return (project.features ?? []).map((feature) => `${feature.en} | ${feature.ar}`).join('\n');
  }

  setFeatures(project: PortfolioProject, value: string): void {
    project.features = this.lines(value).map((line) => this.pair(line));
  }

  tagText(project: PortfolioProject): string {
    return (project.tags ?? []).join(', ');
  }

  setTags(project: PortfolioProject, value: string): void {
    project.tags = value.split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  bulletText(job: ExperienceItem): string {
    return job.bullets.map((bullet) => `${bullet.en} | ${bullet.ar}`).join('\n');
  }

  setBullets(job: ExperienceItem, value: string): void {
    job.bullets = this.lines(value).map((line) => this.pair(line));
  }

  setProjectId(job: ExperienceItem, value: string): void {
    job.projectId = value || undefined;
  }

  addSkill(): void {
    this.draft.skills.push({ title: 'New group', titleAr: 'مجموعة', accent: '#c9a227', techs: [] });
  }

  addProject(): void {
    this.draft.projects.push({
      id: `project-${Date.now()}`,
      name: '',
      summary: blank(),
      features: [],
      tags: [],
    });
  }

  async syncGithub(): Promise<void> {
    this.syncing.set(true);
    this.note.set('');
    try {
      this.draft.projects = await syncFeaturedGithubProjects(this.draft.projects);
      this.note.set(this.copy().synced);
    } catch (error) {
      this.note.set(error instanceof Error ? error.message : this.copy().syncFailed);
    } finally {
      this.syncing.set(false);
    }
  }

  addJob(): void {
    this.draft.experience.push({
      company: '',
      companyUrl: '',
      role: blank(),
      period: blank(),
      bullets: [],
    });
  }

  addEducation(): void {
    this.draft.education.push({ title: blank(), subtitle: blank(), year: blank(), url: '', logo: '' });
  }

  addCertificate(): void {
    this.draft.certificates.push({ title: blank(), image: '', href: '' });
  }

  addContact(): void {
    this.draft.contacts.push({ label: '', labelAr: '', value: '', href: '', icon: 'email' });
  }

  removeAt<T>(list: T[], index: number): void {
    list.splice(index, 1);
  }

  private readImport(raw: string): void {
    try {
      if (!this.store.importJson(raw)) {
        this.note.set(this.copy().invalid);
        return;
      }
      this.draft = structuredClone(this.store.content());
      this.note.set(this.copy().imported);
    } catch {
      this.note.set(this.copy().invalid);
    }
  }

  private lines(value: string): string[] {
    return value.split('\n').map((line) => line.trim()).filter(Boolean);
  }

  private pair(line: string): Localized {
    const [en, ar] = line.split('|');
    const english = (en ?? '').trim();
    return { en: english, ar: (ar ?? english).trim() };
  }
}

function blank(): Localized {
  return { en: '', ar: '' };
}

const EN = {
  eyebrow: 'Editor',
  title: 'Edit this portfolio',
  lead: 'Changes stay in this browser. Export the file when you want them published.',
  save: 'Save draft',
  export: 'Export',
  import: 'Import',
  reset: 'Reset',
  saved: 'Draft saved on this browser.',
  imported: 'File imported into the draft.',
  invalid: 'That file is not portfolio content.',
  resetDone: 'Draft cleared. The published portfolio is showing again.',
  en: 'English',
  ar: 'Arabic',
  add: 'Add',
  remove: 'Remove',
  featuresHint: 'One feature per line: English | Arabic',
  tagsHint: 'Comma-separated tags',
  techHint: 'One technology per line: Name | icon-slug',
  focusHint: 'One line per focus item',
  link: 'Live link',
  github: 'GitHub link',
  githubRepo: 'GitHub repo (owner/name)',
  syncGithub: 'Sync featured GitHub projects',
  synced: 'GitHub projects synced into the draft. Save to keep them.',
  syncFailed: 'Could not sync from GitHub.',
  profile: 'Profile',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  education: 'Education',
  certificates: 'Certificates',
  contacts: 'Contacts',
};

const AR = {
  eyebrow: 'المحرر',
  title: 'تعديل هذا المعرض',
  lead: 'التعديلات تبقى في هذا المتصفح. صدّري الملف عندما تريدين نشرها.',
  save: 'حفظ المسودة',
  export: 'تصدير',
  import: 'استيراد',
  reset: 'إعادة ضبط',
  saved: 'حُفظت المسودة في هذا المتصفح.',
  imported: 'تم استيراد الملف إلى المسودة.',
  invalid: 'هذا الملف ليس محتوى المعرض.',
  resetDone: 'مُسحت المسودة. يظهر المحتوى المنشور من جديد.',
  en: 'الإنجليزية',
  ar: 'العربية',
  add: 'إضافة',
  remove: 'حذف',
  featuresHint: 'ميزة في كل سطر: English | العربية',
  tagsHint: 'الوسوم مفصولة بفاصلة',
  techHint: 'تقنية في كل سطر: الاسم | icon-slug',
  focusHint: 'عنصر في كل سطر',
  link: 'رابط مباشر',
  github: 'رابط GitHub',
  githubRepo: 'مستودع GitHub (owner/name)',
  syncGithub: 'مزامنة مشاريع GitHub المميزة',
  synced: 'تمت مزامنة مشاريع GitHub إلى المسودة. احفظي للاحتفاظ بها.',
  syncFailed: 'تعذّرت المزامنة من GitHub.',
  profile: 'نبذة',
  skills: 'المهارات',
  projects: 'المشاريع',
  experience: 'الخبرة',
  education: 'التعليم',
  certificates: 'الشهادات',
  contacts: 'التواصل',
};
