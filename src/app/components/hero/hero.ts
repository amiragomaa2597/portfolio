import { Component, computed, inject } from '@angular/core';
import { CvActions } from '../../cv/cv-actions';
import { socialChannels } from '../../data/portfolio.data';
import { LanguageService } from '../../i18n/language.service';
import { ContentStore } from '../../state/content.store';
import { SocialIcon } from '../social-icon/social-icon';

@Component({
  selector: 'app-hero',
  imports: [SocialIcon],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly i18n = inject(LanguageService);
  private readonly content = inject(ContentStore);
  private readonly cv = inject(CvActions);
  readonly socials = computed(() =>
    socialChannels(this.content.content(), this.i18n.lang(), [
      'whatsapp',
      'linkedin',
      'github',
      'email',
      'phone',
    ]),
  );
  readonly whatsappHref = computed(
    () => this.content.content().contacts.find((channel) => channel.icon === 'whatsapp')?.href ?? '#',
  );

  downloadCv(): void {
    void this.cv.downloadCurrent();
  }
}
