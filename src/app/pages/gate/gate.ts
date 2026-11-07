import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SiteGateService } from '../../auth/site-gate.service';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-gate',
  templateUrl: './gate.html',
  styleUrl: './gate.scss',
})
export class GatePage {
  private readonly gate = inject(SiteGateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly i18n = inject(LanguageService);
  readonly copy = computed(() => (this.i18n.lang() === 'ar' ? AR : EN));
  readonly password = signal('');
  readonly error = signal('');
  readonly busy = signal(false);

  setPassword(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
    this.error.set('');
  }

  async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.busy()) {
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      const ok = await this.gate.unlock(this.password());
      if (!ok) {
        this.error.set(this.copy().wrong);
        return;
      }
      const next = this.safeNext(this.route.snapshot.queryParamMap.get('next'));
      await this.router.navigateByUrl(next);
    } finally {
      this.busy.set(false);
    }
  }

  private safeNext(raw: string | null): string {
    if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.includes('://')) {
      return '/edit';
    }
    if (raw === '/gate' || raw.startsWith('/gate?')) {
      return '/edit';
    }
    return raw;
  }
}

const EN = {
  eyebrow: 'Private tools',
  title: 'Enter the site password',
  lead: 'Edit and ATS stay behind a simple shared password for this browser session.',
  password: 'Password',
  unlock: 'Unlock',
  wrong: 'Wrong password.',
};

const AR = {
  eyebrow: 'أدوات خاصة',
  title: 'أدخلي كلمة مرور الموقع',
  lead: 'التعديل وبناء السيرة خلف كلمة مرور بسيطة لهذه الجلسة في المتصفح.',
  password: 'كلمة المرور',
  unlock: 'فتح',
  wrong: 'كلمة المرور غير صحيحة.',
};
