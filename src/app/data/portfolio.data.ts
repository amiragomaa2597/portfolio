export interface NavLink {
  label: string;
  href: string;
}

export interface TechItem {
  name: string;
  slug: string;
}

export interface SkillGroup {
  title: string;
  accent: string;
  techs: TechItem[];
}

export interface ExperienceItem {
  company: string;
  companyUrl: string;
  role: string;
  period: string;
  product?: string;
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
  icon: 'whatsapp' | 'linkedin' | 'github' | 'email' | 'phone' | 'cv';
  external?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'SaaS', href: '#platforms' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export const SKILLS: SkillGroup[] = [
  {
    title: 'Backend',
    accent: '#c9a227',
    techs: [
      { name: '.NET', slug: 'dotnet' },
      { name: 'C#', slug: 'csharp' },
      { name: 'ASP.NET', slug: 'dotnet' },
      { name: 'Entity Framework', slug: 'dotnet' },
      { name: 'REST APIs', slug: 'openapiinitiative' },
    ],
  },
  {
    title: 'Frontend',
    accent: '#a8891d',
    techs: [
      { name: 'Angular', slug: 'angular' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'HTML5', slug: 'html5' },
      { name: 'CSS3', slug: 'css' },
      { name: 'Tailwind', slug: 'tailwindcss' },
    ],
  },
  {
    title: 'Mobile',
    accent: '#e0bc45',
    techs: [
      { name: 'Flutter', slug: 'flutter' },
      { name: 'Android', slug: 'android' },
      { name: 'iOS', slug: 'apple' },
    ],
  },
  {
    title: 'Database',
    accent: '#8a6f14',
    techs: [{ name: 'SQL Server', slug: 'microsoftsqlserver' }],
  },
  {
    title: 'Architecture',
    accent: '#b9972a',
    techs: [
      { name: 'Modular Monolith', slug: 'architecture' },
      { name: 'N-Tiers', slug: 'architecture' },
    ],
  },
  {
    title: 'DevOps & Cloud',
    accent: '#d4af37',
    techs: [
      { name: 'Docker', slug: 'docker' },
      { name: 'AWS S3', slug: 'amazonaws' },
      { name: 'Git', slug: 'git' },
      { name: 'CI/CD', slug: 'githubactions' },
    ],
  },
  {
    title: 'Methodologies',
    accent: '#9a7b1a',
    techs: [{ name: 'Agile Scrum', slug: 'scrumalliance' }],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: 'Bussma Solutions',
    companyUrl: 'https://bussmasolutions.com/en',
    role: 'Full Stack Developer',
    period: 'Mar 2025 – Present',
    product: 'Bussma ERP',
    note: 'Also known as Jadara in the Saudi market.',
    tags: ['.NET', 'Angular', 'Flutter', 'AWS S3', 'Docker', 'Multi-Tenant'],
    bullets: [
      'Contributed to Bussma ERP, a large-scale ERP platform for the Saudi market.',
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
    product: 'Vibes',
    tags: ['Angular', '.NET', 'HR Systems', 'DevExpress', 'Realtime'],
    bullets: [
      'Developed Vibes, an HR management system for web and mobile platforms.',
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
    subtitle: 'Information Technology Institute · 9 months',
    year: '2023',
    url: 'https://iti.gov.eg/',
    logo: 'assets/logos/iti.png',
    logoClass: 'logo-dark',
  },
  {
    title: 'Alexandria University',
    subtitle: 'Bachelor’s degree · Faculty of Engineering — Communications · Grade: Very Good',
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
    icon: 'whatsapp',
    external: true,
  },
  {
    label: 'Phone',
    value: '+20 106 778 4941',
    href: 'tel:+201067784941',
    icon: 'phone',
  },
  {
    label: 'Email',
    value: 'amiragomaa2597@gmail.com',
    href: 'mailto:amiragomaa2597@gmail.com',
    icon: 'email',
  },
  {
    label: 'LinkedIn',
    value: 'amira-gomaa-58b41a17a',
    href: 'https://linkedin.com/in/amira-gomaa-58b41a17a',
    icon: 'linkedin',
    external: true,
  },
  {
    label: 'GitHub',
    value: 'amiragomaa2597',
    href: 'https://github.com/amiragomaa2597',
    icon: 'github',
    external: true,
  },
  {
    label: 'Resume',
    value: 'Download PDF',
    href: 'Amira_Gomaa_Full_Stack_Developer_CV.pdf',
    icon: 'cv',
  },
];

export const SOCIAL_QUICK: ContactChannel[] = CONTACTS.filter((c) =>
  ['whatsapp', 'linkedin', 'github', 'email', 'phone'].includes(c.icon),
);

/** Simple Icons CDN helper */
export function techIconUrl(slug: string): string {
  if (slug === 'architecture') {
    return '';
  }
  return `https://cdn.simpleicons.org/${slug}`;
}
