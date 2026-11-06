import { Component, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-projects',
  imports: [RevealDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  readonly i18n = inject(LanguageService);
}
