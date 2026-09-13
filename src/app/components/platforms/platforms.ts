import { Component, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-platforms',
  imports: [RevealDirective],
  templateUrl: './platforms.html',
  styleUrl: './platforms.scss',
})
export class Platforms {
  readonly i18n = inject(LanguageService);
}
