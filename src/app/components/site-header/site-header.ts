import { Component, HostListener, inject, signal } from '@angular/core';
import { SOCIAL_QUICK } from '../../data/portfolio.data';
import { LanguageService } from '../../i18n/language.service';
import { SocialIcon } from '../social-icon/social-icon';

@Component({
  selector: 'app-site-header',
  imports: [SocialIcon],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  readonly i18n = inject(LanguageService);
  readonly socials = SOCIAL_QUICK.filter((s) =>
    ['whatsapp', 'linkedin', 'github'].includes(s.icon),
  );
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

  readonly nav = [
    { key: 'about' as const, href: '#about' },
    { key: 'skills' as const, href: '#skills' },
    { key: 'platforms' as const, href: '#platforms' },
    { key: 'experience' as const, href: '#experience' },
    { key: 'education' as const, href: '#education' },
    { key: 'contact' as const, href: '#contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  setLang(lang: 'en' | 'ar'): void {
    this.i18n.setLang(lang);
    this.closeMenu();
  }
}
