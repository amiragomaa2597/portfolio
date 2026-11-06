import { Component, computed, inject, signal } from '@angular/core';
import { tailorCv, type AtsResult } from '../../ats/match-job';
import { downloadCvPdf } from '../../cv/download-cv';
import { CV_HEADINGS } from '../../data/portfolio.data';
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
  readonly copy = computed(() => (this.i18n.lang() === 'ar' ? AR : EN));
  readonly jobPost = signal('');
  readonly result = signal<AtsResult | null>(null);
  readonly error = signal('');

  setJob(event: Event): void {
    this.jobPost.set((event.target as HTMLTextAreaElement).value);
  }

  build(): void {
    const post = this.jobPost().trim();
    if (!post) {
      this.result.set(null);
      this.error.set(this.copy().empty);
      return;
    }
    this.error.set('');
    this.result.set(tailorCv(this.content.content(), post));
  }

  download(): void {
    const current = this.result();
    if (!current) {
      return;
    }
    void downloadCvPdf({ ...current.cv, fileName: 'Amira_Gomaa_ATS.pdf' });
  }
}

const EN = {
  eyebrow: 'ATS builder',
  title: 'Shape the CV to the role',
  lead: 'Paste the job post. The preview uses only facts already in this portfolio, and it leaves out anything you have not done.',
  placeholder: 'Paste the job requirements here',
  build: 'Preview CV',
  download: 'Download PDF',
  matched: 'Brought forward',
  missing: 'Left out',
  noneMissing: 'Nothing in the post was left out.',
  empty: 'Paste a job post first.',
};

const AR = {
  eyebrow: 'بناء السيرة',
  title: 'تهيئة السيرة للوظيفة',
  lead: 'الصقي إعلان الوظيفة. المعاينة تستخدم فقط ما هو موجود في هذا المعرض، وتترك ما لم تقومي به.',
  placeholder: 'الصقي متطلبات الوظيفة هنا',
  build: 'معاينة السيرة',
  download: 'تحميل PDF',
  matched: 'قُدّم في السيرة',
  missing: 'تُرك خارج السيرة',
  noneMissing: 'لا يوجد في الإعلان ما تُرك خارج السيرة.',
  empty: 'الصقي إعلان الوظيفة أولاً.',
};
