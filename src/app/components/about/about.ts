import { Component, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { SOCIAL_QUICK } from '../../data/portfolio.data';
import { LanguageService } from '../../i18n/language.service';
import { SocialIcon } from '../social-icon/social-icon';

@Component({
  selector: 'app-about',
  imports: [RevealDirective, SocialIcon],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly i18n = inject(LanguageService);
  readonly socials = SOCIAL_QUICK;
}
