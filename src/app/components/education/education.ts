import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { EDUCATION } from '../../data/portfolio.data';

@Component({
  selector: 'app-education',
  imports: [RevealDirective],
  templateUrl: './education.html',
  styleUrl: './education.scss',
})
export class Education {
  readonly items = EDUCATION;
}
