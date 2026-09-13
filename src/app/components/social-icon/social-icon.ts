import { Component, input } from '@angular/core';

export type SocialIconName =
  | 'whatsapp'
  | 'linkedin'
  | 'github'
  | 'email'
  | 'phone'
  | 'cv';

@Component({
  selector: 'app-social-icon',
  templateUrl: './social-icon.html',
  styleUrl: './social-icon.scss',
})
export class SocialIcon {
  readonly name = input.required<SocialIconName>();
  readonly label = input('');
}
