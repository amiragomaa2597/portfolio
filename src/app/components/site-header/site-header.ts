import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CvActions } from '../../cv/cv-actions';
import { socialChannels } from '../../data/portfolio.data';
import { LanguageService } from '../../i18n/language.service';
import { ContentStore } from '../../state/content.store';
import { SocialIcon } from '../social-icon/social-icon';

@Component({
  selector: 'app-site-header',
  imports: [SocialIcon, RouterLink],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  readonly i18n = inject(LanguageService);
  private readonly content = inject(ContentStore);
  private readonly cv = inject(CvActions);
  readonly socials = computed(() =>
    socialChannels(this.content.content(), this.i18n.lang(), ['whatsapp', 'linkedin', 'github']),
  );
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  readonly nav = [
    { key: 'about' as const, fragment: 'about' },
    { key: 'skills' as const, fragment: 'skills' },
    { key: 'experience' as const, fragment: 'experience' },
    { key: 'projects' as const, fragment: 'projects' },
    { key: 'education' as const, fragment: 'education' },
    { key: 'certificates' as const, fragment: 'certificates' },
    { key: 'contact' as const, fragment: 'contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  setLang(lang: 'en' | 'ar'): void {
    this.i18n.setLang(lang);
    this.closeMenu();
  }

  downloadCv(): void {
    this.closeMenu();
    void this.cv.downloadCurrent();
  }
}
