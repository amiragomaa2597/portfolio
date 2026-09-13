import { Component } from '@angular/core';
import { SOCIAL_QUICK } from '../../data/portfolio.data';
import { SocialIcon } from '../social-icon/social-icon';

@Component({
  selector: 'app-hero',
  imports: [SocialIcon],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly socials = SOCIAL_QUICK;
}
