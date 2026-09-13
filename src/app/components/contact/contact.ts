import { Component, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { LanguageService } from '../../i18n/language.service';
import { SocialIcon } from '../social-icon/social-icon';

@Component({
  selector: 'app-contact',
  imports: [RevealDirective, SocialIcon],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  readonly i18n = inject(LanguageService);
}
