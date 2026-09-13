import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { SKILLS, techIconUrl } from '../../data/portfolio.data';

@Component({
  selector: 'app-skills',
  imports: [RevealDirective, DecimalPipe],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  readonly skills = SKILLS;
  readonly iconUrl = techIconUrl;
}
