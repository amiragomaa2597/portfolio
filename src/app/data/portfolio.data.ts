/**
 * Single source of truth for the portfolio and the PDF CV.
 * LanguageService renders this for the site. scripts/generate-cv.ts renders the English CV.
 * Edit facts here, then run `npm start` or `npm run build` to regenerate public/Amira_Gomaa_CV.pdf.
 */

export interface Localized {
  en: string;
  ar: string;
}

export interface TechItem {
  name: string;
  slug: string;
}

export interface SkillGroup {
  /** English label. Also the key used by the skills section. */
  title: string;
  titleAr: string;
  accent: string;
  techs: TechItem[];
}

export interface PortfolioProject {
  id: string;
  name: string;
  /** First experience bullet for this product. Shown on the site and in the CV Projects section. */
  summary: Localized;
  note?: Localized;
  tags: string[];
}

export interface ExperienceItem {
  company: string;
  companyUrl: string;
  role: Localized;
  period: Localized;
  projectId?: string;
  /** Accomplishments after the linked project's summary bullet. */
  bullets: Localized[];
}

export interface EducationItem {
  title: Localized;
  subtitle: Localized;
  /** Card badge. Not always a calendar year — see the README gaps list. */
  year: Localized;
  url: string;
  logo: string;
  logoClass?: string;
}

export interface CertificateItem {
  title: Localized;
  subtitle?: Localized;
  image: string;
  href: string;
}

export type ContactIcon = 'whatsapp' | 'linkedin' | 'github' | 'email' | 'phone' | 'cv';

export interface ContactChannel {
  label: string;
  labelAr: string;
  value: string;
  valueAr?: string;
  href: string;
  icon: ContactIcon;
  external?: boolean;
  downloadName?: string;
}

export interface LocalizedJob {
  company: string;
  companyUrl: string;
  role: string;
  period: string;
  product?: string;
  note?: string;
  bullets: string[];
  tags: string[];
}

export interface LocalizedEducation {
  title: string;
  subtitle: string;
  year: string;
  url: string;
  logo: string;
  logoClass?: string;
}

export interface LocalizedCertificate {
  title: string;
  subtitle?: string;
  image: string;
  href: string;
}

export interface LocalizedContact {
  label: string;
  value: string;
  href: string;
  icon: ContactIcon;
  external?: boolean;
  downloadName?: string;
}

export interface LocalizedPortfolio {
  brand: string;
  title: string;
  lead: string;
  focusItems: string[];
  yearsValue: string;
  summary: string;
  skillGroupLabels: Record<string, string>;
  jobs: LocalizedJob[];
  education: LocalizedEducation[];
  certificates: LocalizedCertificate[];
  contacts: LocalizedContact[];
}

export interface CvContactLine {
  label: string;
  value: string;
}

export interface CvSkillLine {
  title: string;
  items: string[];
}

export interface CvExperience {
  role: string;
  company: string;
  companyUrl: string;
  period: string;
  product?: string;
  note?: string;
  bullets: string[];
}

export interface CvProject {
  name: string;
  company: string;
  period: string;
  summary: string;
  note?: string;
  tags: string[];
}

export interface CvEducation {
  title: string;
  detail: string;
  url: string;
}

export interface CvDocument {
  fileName: string;
  fullName: string;
  headline: string;
  contacts: CvContactLine[];
  summary: string;
  skills: CvSkillLine[];
  experience: CvExperience[];
  projects: CvProject[];
  education: CvEducation[];
}

export const CV_FILENAME = 'Amira_Gomaa_CV.pdf';

export const CV_HEADINGS = ['Summary', 'Skills', 'Experience', 'Projects', 'Education'] as const;

const text = (en: string, ar: string): Localized => ({ en, ar });

export const PROFILE = {
  /** README and the page description. The visible brand below stays the shorter name. */
  fullName: 'Amira Gomaa Hassan',
  brand: text('Amira Gomaa', 'أميرة جمعة'),
  title: text('Full Stack Developer', 'مطورة برمجيات كاملة'),
  lead: text(
    'Designing scalable web & mobile products with .NET, Angular, and Flutter — from multi-tenant ERP platforms to polished store releases.',
    'أصمم وأبني منتجات ويب وموبايل قابلة للتوسع باستخدام .NET وAngular وFlutter — من منصات ERP متعددة المستأجرين إلى إصدارات متاجر التطبيقات.',
  ),
  summary: text(
    '.NET / full-stack developer with 3+ years of experience designing and delivering scalable web and mobile applications using .NET, Angular, Flutter, and SQL Server. Experienced in ERP and HR solutions, RESTful APIs, Multi-Tenant SaaS platforms, AWS integrations, and mobile application deployment. Targeting remote roles.',
    'مطورة .NET وبرمجيات كاملة بخبرة 3+ سنوات في تصميم وتطوير تطبيقات ويب وموبايل قابلة للتوسع باستخدام .NET وAngular وFlutter وSQL Server. خبرة في حلول ERP وHR وواجهات REST ومنصات SaaS متعددة المستأجرين وتكاملات AWS ونشر تطبيقات الموبايل. أستهدف فرص العمل عن بُعد.',
  ),
  focusItems: {
    en: ['.NET APIs', 'Angular apps', 'Flutter mobile', 'Multi-tenant SaaS'],
    ar: ['واجهات .NET', 'تطبيقات Angular', 'موبايل Flutter', 'SaaS متعدد المستأجرين'],
  },
  yearsValue: '3+',
};

export const SKILLS: SkillGroup[] = [
  {
    title: 'Backend',
    titleAr: 'الواجهة الخلفية',
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
    titleAr: 'الواجهة الأمامية',
    accent: '#a8891d',
    techs: [
      { name: 'Angular', slug: 'angular' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'HTML5', slug: 'html5' },
      { name: 'CSS3', slug: 'css3' },
      { name: 'Tailwind', slug: 'tailwindcss' },
    ],
  },
  {
    title: 'Mobile',
    titleAr: 'الموبايل',
    accent: '#e0bc45',
    techs: [
      { name: 'Flutter', slug: 'flutter' },
      { name: 'Android', slug: 'android' },
      { name: 'iOS', slug: 'apple' },
    ],
  },
  {
    title: 'Database',
    titleAr: 'قواعد البيانات',
    accent: '#8a6f14',
    techs: [
      { name: 'SQL Server', slug: 'microsoftsqlserver' },
      { name: 'PostgreSQL', slug: 'postgresql' },
    ],
  },
  {
    title: 'Architecture',
    titleAr: 'الهندسة المعمارية',
    accent: '#b9972a',
    techs: [
      { name: 'Modular Monolith', slug: 'architecture' },
      { name: 'N-Tiers', slug: 'architecture' },
    ],
  },
  {
    title: 'Multi-Tenant & SaaS',
    titleAr: 'متعدد المستأجرين وSaaS',
    accent: '#c4a035',
    techs: [
      { name: 'Multi-Tenant', slug: 'architecture' },
      { name: 'SaaS', slug: 'architecture' },
    ],
  },
  {
    title: 'DevOps & Cloud',
    titleAr: 'DevOps والسحابة',
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
    titleAr: 'المنهجيات',
    accent: '#9a7b1a',
    techs: [{ name: 'Agile Scrum', slug: 'scrumalliance' }],
  },
];

export const PROJECTS: PortfolioProject[] = [
  {
    id: 'bussma-erp',
    name: 'Bussma ERP',
    summary: text(
      'Contributed to Bussma ERP, a large-scale ERP platform for the Saudi market.',
      'ساهمت في تطوير Bussma ERP، منصة ERP واسعة النطاق للسوق السعودي.',
    ),
    note: text(
      'Also known as Jadara in the Saudi market.',
      'تُعرف أيضاً باسم Jadara في السوق السعودي.',
    ),
    tags: ['.NET', 'Angular', 'Flutter', 'AWS S3', 'Docker', 'Multi-Tenant'],
  },
  {
    id: 'vibes',
    name: 'Vibes',
    summary: text(
      'Developed Vibes, an HR management system for web and mobile platforms.',
      'طورت Vibes، نظام إدارة موارد بشرية للويب والموبايل.',
    ),
    tags: ['Angular', '.NET', 'HR Systems', 'DevExpress', 'Realtime'],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: 'Bussma Solutions',
    companyUrl: 'https://bussmasolutions.com/en',
    role: text('Full Stack Developer', 'مطورة برمجيات كاملة'),
    period: text('Mar 2025 – Present', 'مارس 2025 – حتى الآن'),
    projectId: 'bussma-erp',
    bullets: [
      text(
        'Developed Angular web apps and ASP.NET Core backend services.',
        'طورت تطبيقات Angular وخدمات ASP.NET Core.',
      ),
      text(
        'Implemented Multi-Tenant architecture for multiple clients.',
        'نفذت بنية متعددة المستأجرين لدعم عدة عملاء.',
      ),
      text(
        'Built Flutter mobile apps and managed App Store / Play Store releases.',
        'بنيت تطبيقات Flutter وأدرت إصدارات App Store وPlay Store.',
      ),
      text(
        'Integrated AWS S3 and participated in Docker deployments.',
        'دمجت خدمات AWS S3 وشاركت في نشر Docker.',
      ),
    ],
  },
  {
    company: 'XLab Group',
    companyUrl: 'https://xlab-group.com/',
    role: text('Full Stack Developer', 'مطورة برمجيات كاملة'),
    period: text('2023 – Feb 2025', '2023 – فبراير 2025'),
    projectId: 'vibes',
    bullets: [
      text('Built Angular modules and .NET backend APIs.', 'بنيت وحدات Angular وواجهات .NET.'),
      text(
        'Implemented real-time features and system enhancements.',
        'نفذت ميزات فورية وتحسينات للنظام.',
      ),
      text(
        'Improved application performance by approximately 20%.',
        'حسّنت أداء التطبيق بنحو 20%.',
      ),
      text('Integrated DevExpress reporting solutions.', 'دمجت حلول تقارير DevExpress.'),
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    title: text('MBA — Master of Business Administration', 'ماجستير إدارة الأعمال — MBA'),
    subtitle: text('RB College (Royale Business College)', 'كلية RB (Royale Business College)'),
    year: text('Master\u2019s', 'ماجستير'),
    url: 'https://www.rb-college.co.uk/',
    logo: 'assets/logos/rb-college.png',
    logoClass: 'logo-light',
  },
  {
    title: text('ITI Professional Web Development Track', 'مسار تطوير الويب الاحترافي — ITI'),
    subtitle: text(
      'Information Technology Institute · 9 months',
      'معهد تكنولوجيا المعلومات · 9 أشهر',
    ),
    year: text('2023', '2023'),
    url: 'https://iti.gov.eg/',
    logo: 'assets/logos/iti.png',
    logoClass: 'logo-dark',
  },
  {
    title: text('Alexandria University', 'جامعة الإسكندرية'),
    subtitle: text(
      'Bachelor\u2019s degree · Faculty of Engineering — Communications · Grade: Very Good',
      'بكالوريوس · كلية الهندسة — اتصالات · التقدير: جيد جداً',
    ),
    year: text('Engineering', 'هندسة'),
    url: 'https://eng.alexu.edu.eg/index.php/en',
    logo: 'assets/logos/alexu.png',
  },
];

export const CERTIFICATES: CertificateItem[] = [
  {
    title: text('Mastering MS Power Apps', 'إتقان Microsoft Power Apps'),
    subtitle: text('Udemy · Verified course completion', 'Udemy · إتمام دورة معتمد'),
    image: 'assets/certificates/udemy-certificate.jpg',
    href: 'https://www.udemy.com/certificate/UC-5c2de856-641f-43d1-94f1-a43cf449afc8/',
  },
];

export const CONTACTS: ContactChannel[] = [
  {
    label: 'WhatsApp',
    labelAr: 'واتساب',
    value: '+20 10 96825528',
    href: 'https://wa.me/201096825528',
    icon: 'whatsapp',
    external: true,
  },
  {
    label: 'Phone',
    labelAr: 'هاتف',
    value: '+20 106 778 4941',
    href: 'tel:+201067784941',
    icon: 'phone',
  },
  {
    label: 'Email',
    labelAr: 'بريد',
    value: 'amiragomaa2597@gmail.com',
    href: 'mailto:amiragomaa2597@gmail.com',
    icon: 'email',
  },
  {
    label: 'LinkedIn',
    labelAr: 'لينكدإن',
    value: 'amira-gomaa-58b41a17a',
    href: 'https://linkedin.com/in/amira-gomaa-58b41a17a',
    icon: 'linkedin',
    external: true,
  },
  {
    label: 'GitHub',
    labelAr: 'جيت هب',
    value: 'amiragomaa2597',
    href: 'https://github.com/amiragomaa2597',
    icon: 'github',
    external: true,
  },
  {
    label: 'Resume',
    labelAr: 'السيرة',
    value: 'Download PDF',
    valueAr: 'تحميل PDF',
    href: CV_FILENAME,
    icon: 'cv',
    downloadName: CV_FILENAME,
  },
];

export const SOCIAL_QUICK: ContactChannel[] = CONTACTS.filter((channel) =>
  ['whatsapp', 'linkedin', 'github', 'email', 'phone'].includes(channel.icon),
);

/** Reliable Simple Icons via jsDelivr */
export function techIconUrl(slug: string): string {
  if (slug === 'architecture') {
    return '';
  }
  return `https://cdn.jsdelivr.net/npm/simple-icons@11/icons/${slug}.svg`;
}

function projectById(id: string): PortfolioProject {
  const project = PROJECTS.find((item) => item.id === id);
  if (!project) {
    throw new Error(`Unknown project id "${id}" in portfolio data.`);
  }
  return project;
}

function jobBullets(job: ExperienceItem, lang: 'en' | 'ar'): string[] {
  const project = job.projectId ? projectById(job.projectId) : undefined;
  return [
    ...(project ? [project.summary[lang]] : []),
    ...job.bullets.map((bullet) => bullet[lang]),
  ];
}

export function localizedPortfolio(lang: 'en' | 'ar'): LocalizedPortfolio {
  return {
    brand: PROFILE.brand[lang],
    title: PROFILE.title[lang],
    lead: PROFILE.lead[lang],
    focusItems: PROFILE.focusItems[lang],
    yearsValue: PROFILE.yearsValue,
    summary: PROFILE.summary[lang],
    skillGroupLabels: Object.fromEntries(
      SKILLS.map((group) => [group.title, lang === 'ar' ? group.titleAr : group.title]),
    ),
    jobs: EXPERIENCE.map((job) => {
      const project = job.projectId ? projectById(job.projectId) : undefined;
      return {
        company: job.company,
        companyUrl: job.companyUrl,
        role: job.role[lang],
        period: job.period[lang],
        product: project?.name,
        note: project?.note?.[lang],
        bullets: jobBullets(job, lang),
        tags: project?.tags ?? [],
      };
    }),
    education: EDUCATION.map((item) => ({
      title: item.title[lang],
      subtitle: item.subtitle[lang],
      year: item.year[lang],
      url: item.url,
      logo: item.logo,
      logoClass: item.logoClass,
    })),
    certificates: CERTIFICATES.map((item) => ({
      title: item.title[lang],
      subtitle: item.subtitle?.[lang],
      image: item.image,
      href: item.href,
    })),
    contacts: CONTACTS.map((channel) => ({
      label: lang === 'ar' ? channel.labelAr : channel.label,
      value: lang === 'ar' && channel.valueAr ? channel.valueAr : channel.value,
      href: channel.href,
      icon: channel.icon,
      external: channel.external,
      downloadName: channel.downloadName,
    })),
  };
}

const CV_CONTACT_ORDER = ['email', 'phone', 'whatsapp', 'linkedin', 'github'] as const;

/**
 * Header technologies for a .NET / full-stack CV aimed at remote roles.
 * C#, Entity Framework, REST APIs, and Angular are skill chips.
 * ASP.NET Core is named in the Bussma experience bullets (the chip says ASP.NET).
 * "Remote" is the owner's target, not a skill chip.
 */
const CV_HEADLINE_PARTS = [
  'C#',
  'ASP.NET Core',
  'Entity Framework',
  'REST APIs',
  'Angular',
] as const;

function educationDetail(item: EducationItem): string {
  if (/\d/.test(item.year.en)) {
    return `${item.subtitle.en} | ${item.year.en}`;
  }
  return item.subtitle.en;
}

export function buildCvDocument(): CvDocument {
  const skillNames = new Set(SKILLS.flatMap((group) => group.techs.map((tech) => tech.name)));
  for (const part of CV_HEADLINE_PARTS) {
    if (part === 'ASP.NET Core') {
      const mentioned = EXPERIENCE.some((job) =>
        job.bullets.some((bullet) => bullet.en.includes('ASP.NET Core')),
      );
      if (!mentioned) {
        throw new Error('CV headline mentions ASP.NET Core, but no experience bullet does.');
      }
      continue;
    }
    if (!skillNames.has(part)) {
      throw new Error(`CV headline skill "${part}" is not listed in SKILLS.`);
    }
  }

  const contacts = CV_CONTACT_ORDER.map((icon) => {
    const channel = CONTACTS.find((item) => item.icon === icon);
    if (!channel) {
      throw new Error(`Missing ${icon} contact in portfolio data.`);
    }
    const value = icon === 'linkedin' || icon === 'github' ? channel.href : channel.value;
    return { label: channel.label, value };
  });

  return {
    fileName: CV_FILENAME,
    fullName: PROFILE.fullName,
    headline: `${PROFILE.title.en} | Remote | ${CV_HEADLINE_PARTS.join(', ')}`,
    contacts,
    summary: PROFILE.summary.en,
    skills: SKILLS.map((group) => ({
      title: group.title,
      items: group.techs.map((tech) => tech.name),
    })),
    experience: EXPERIENCE.map((job) => {
      const project = job.projectId ? projectById(job.projectId) : undefined;
      return {
        role: job.role.en,
        company: job.company,
        companyUrl: job.companyUrl,
        period: job.period.en,
        product: project?.name,
        note: project?.note?.en,
        bullets: jobBullets(job, 'en'),
      };
    }),
    projects: EXPERIENCE.flatMap((job) => {
      if (!job.projectId) {
        return [];
      }
      const project = projectById(job.projectId);
      return [
        {
          name: project.name,
          company: job.company,
          period: job.period.en,
          summary: project.summary.en,
          note: project.note?.en,
          tags: project.tags,
        },
      ];
    }),
    education: EDUCATION.map((item) => ({
      title: item.title.en,
      detail: educationDetail(item),
      url: item.url,
    })),
  };
}
