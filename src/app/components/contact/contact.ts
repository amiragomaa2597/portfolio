import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { CONTACTS } from '../../data/portfolio.data';
import { SocialIcon } from '../social-icon/social-icon';

@Component({
  selector: 'app-contact',
  imports: [RevealDirective, SocialIcon],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  readonly channels = CONTACTS;
}
