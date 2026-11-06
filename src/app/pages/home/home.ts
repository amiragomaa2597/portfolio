import { Component } from '@angular/core';
import { About } from '../../components/about/about';
import { Certificates } from '../../components/certificates/certificates';
import { Contact } from '../../components/contact/contact';
import { Education } from '../../components/education/education';
import { Experience } from '../../components/experience/experience';
import { Hero } from '../../components/hero/hero';
import { Projects } from '../../components/projects/projects';
import { Skills } from '../../components/skills/skills';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Skills, Experience, Projects, Education, Certificates, Contact],
  templateUrl: './home.html',
})
export class HomePage {}
