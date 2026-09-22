import { Component, inject } from '@angular/core';
import { About } from './components/about/about';
import { Certificates } from './components/certificates/certificates';
import { Contact } from './components/contact/contact';
import { Education } from './components/education/education';
import { Experience } from './components/experience/experience';
import { Hero } from './components/hero/hero';
import { SiteFooter } from './components/site-footer/site-footer';
import { SiteHeader } from './components/site-header/site-header';
import { Skills } from './components/skills/skills';
import { LanguageService } from './i18n/language.service';

@Component({
  selector: 'app-root',
  imports: [SiteHeader, Hero, About, Skills, Experience, Education, Certificates, Contact, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly i18n = inject(LanguageService);
}
