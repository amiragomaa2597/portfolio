import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { CONTACTS } from '../../data/portfolio.data';

@Component({
  selector: 'app-contact',
  imports: [RevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  readonly channels = CONTACTS;
}
