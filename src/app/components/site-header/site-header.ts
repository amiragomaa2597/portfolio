import { Component, HostListener, signal } from '@angular/core';
import { NAV_LINKS, SOCIAL_QUICK } from '../../data/portfolio.data';
import { SocialIcon } from '../social-icon/social-icon';

@Component({
  selector: 'app-site-header',
  imports: [SocialIcon],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  readonly links = NAV_LINKS;
  readonly socials = SOCIAL_QUICK.filter((s) =>
    ['whatsapp', 'linkedin', 'github'].includes(s.icon),
  );
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);

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
}
