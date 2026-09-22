import { Component, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-certificates',
  imports: [RevealDirective],
  templateUrl: './certificates.html',
  styleUrl: './certificates.scss',
})
export class Certificates {
  readonly i18n = inject(LanguageService);
}
