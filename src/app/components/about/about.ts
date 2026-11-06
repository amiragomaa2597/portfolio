import { Component, computed, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { socialChannels } from '../../data/portfolio.data';
import { LanguageService } from '../../i18n/language.service';
import { ContentStore } from '../../state/content.store';
import { SocialIcon } from '../social-icon/social-icon';

@Component({
  selector: 'app-about',
  imports: [RevealDirective, SocialIcon],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly i18n = inject(LanguageService);
  private readonly content = inject(ContentStore);
  readonly socials = computed(() =>
    socialChannels(this.content.content(), this.i18n.lang(), [
      'whatsapp',
      'linkedin',
      'github',
      'email',
      'phone',
    ]),
  );
}
