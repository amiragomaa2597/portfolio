import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { SKILLS, techIconUrl } from '../../data/portfolio.data';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-skills',
  imports: [RevealDirective, DecimalPipe],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  readonly i18n = inject(LanguageService);
  readonly skills = SKILLS;
  readonly iconUrl = techIconUrl;
}
