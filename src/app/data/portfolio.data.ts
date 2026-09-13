export interface NavLink {
  label: string;
  href: string;
}

export interface SkillGroup {
  title: string;
  items: string;
  accent: string;
}

export interface ExperienceItem {
  company: string;
  companyUrl: string;
  role: string;
  period: string;
  note?: string;
  bullets: string[];
  tags: string[];
}

export interface EducationItem {
  title: string;
  subtitle: string;
  year: string;
  url: string;
  logo: string;
  logoClass?: string;
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export const SKILLS: SkillGroup[] = [
  { title: 'Backend', items: 'ASP.NET Core, .NET, C#, EF Core, Web API, REST APIs', accent: '#c9a227' },
  { title: 'Frontend', items: 'Angular, TypeScript, JavaScript, HTML, CSS, Bootstrap', accent: '#2f6fed' },
  { title: 'Mobile', items: 'Flutter, Android & iOS Deployment', accent: '#1bb8a8' },
  { title: 'Database', items: 'SQL Server', accent: '#cc3d3d' },
  { title: 'Architecture', items: 'Modular Monolith, Multi-Tenant, N-Tiers', accent: '#6b5b95' },
  { title: 'DevOps & Cloud', items: 'Docker, AWS S3, Git, CI/CD', accent: '#1f8a70' },
  { title: 'Methodologies', items: 'Agile Scrum', accent: '#b86b2b' },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: 'Bussma Solutions',
    companyUrl: 'https://bussmasolutions.com/en',
    role: 'Full Stack Developer',
    period: 'Mar 2025 – Present',
    note: 'Also known as Jadara in the Saudi market (Jadara ERP).',
    tags: ['.NET', 'Angular', 'Flutter', 'AWS S3', 'Docker', 'Multi-Tenant'],
    bullets: [
      'Contributed to a large-scale ERP platform for the Saudi market.',
      'Developed Angular web apps and ASP.NET Core backend services.',
      'Implemented Multi-Tenant architecture for multiple clients.',
      'Built Flutter mobile apps and managed App Store / Play Store releases.',
      'Integrated AWS S3 and participated in Docker deployments.',
    ],
  },
  {
    company: 'XLab Group',
    companyUrl: 'https://xlab-group.com/',
    role: 'Full Stack Developer',
    period: '2023 – Feb 2025',
    tags: ['Angular', '.NET', 'HR Systems', 'DevExpress', 'Realtime'],
    bullets: [
      'Developed HR management systems for web and mobile platforms.',
      'Built Angular modules and .NET backend APIs.',
      'Implemented real-time features and system enhancements.',
      'Improved application performance by approximately 20%.',
      'Integrated DevExpress reporting solutions.',
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    title: 'ITI Professional Web Development Track',
    subtitle: 'Information Technology Institute',
    year: '2023',
    url: 'https://iti.gov.eg/',
    logo: 'assets/logos/iti.png',
    logoClass: 'logo-dark',
  },
  {
    title: 'Alexandria University',
    subtitle: 'Faculty of Engineering — Communications',
    year: 'Engineering',
    url: 'https://eng.alexu.edu.eg/index.php/en',
    logo: 'assets/logos/alexu.png',
  },
];

export const CONTACTS: ContactChannel[] = [
  {
    label: 'WhatsApp',
    value: '+20 10 96825528',
    href: 'https://wa.me/201096825528',
    external: true,
  },
  {
    label: 'Phone',
    value: '+20 106 778 4941',
    href: 'tel:+201067784941',
  },
  {
    label: 'Email',
    value: 'amiragomaa2597@gmail.com',
    href: 'mailto:amiragomaa2597@gmail.com',
  },
  {
    label: 'LinkedIn',
    value: 'amira-gomaa-58b41a17a',
    href: 'https://linkedin.com/in/amira-gomaa-58b41a17a',
    external: true,
  },
  {
    label: 'GitHub',
    value: 'amiragomaa2597',
    href: 'https://github.com/amiragomaa2597',
    external: true,
  },
  {
    label: 'Resume',
    value: 'Download PDF',
    href: 'Amira_Gomaa_Full_Stack_Developer_CV.pdf',
  },
];
