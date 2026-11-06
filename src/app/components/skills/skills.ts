import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { techIconUrl } from '../../data/portfolio.data';
import { LanguageService } from '../../i18n/language.service';
import { ContentStore } from '../../state/content.store';

@Component({
  selector: 'app-skills',
  imports: [RevealDirective, DecimalPipe],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  readonly i18n = inject(LanguageService);
  private readonly content = inject(ContentStore);
  readonly skills = computed(() => this.content.content().skills);
  readonly iconUrl = techIconUrl;

  onIconError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.remove();
  }
}
