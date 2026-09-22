import { Injectable, computed, effect, signal } from '@angular/core';

export type Lang = 'en' | 'ar';

export interface UiCopy {
  skip: string;
  brand: string;
  nav: {
    about: string;
    skills: string;
    experience: string;
    education: string;
    certificates: string;
    contact: string;
  };
  downloadCv: string;
  openMenu: string;
  closeMenu: string;
  hero: {
    aria: string;
    kicker: string;
    title: string;
    lead: string;
    whatsapp: string;
    seeExperience: string;
    downloadCv: string;
    socialAria: string;
    focus: string;
    focusItems: string[];
    yearsLabel: string;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    portraitAlt: string;
  };
  skills: {
    eyebrow: string;
    title: string;
    groups: Record<string, string>;
  };
  experience: {
    eyebrow: string;
    title: string;
    product: string;
    jobs: Array<{
      company: string;
      role: string;
      period: string;
      product?: string;
      note?: string;
      bullets: string[];
      tags: string[];
      companyUrl: string;
    }>;
  };
  education: {
    eyebrow: string;
    title: string;
    items: Array<{
      title: string;
      subtitle: string;
      year: string;
      url: string;
      logo: string;
      logoClass?: string;
    }>;
  };
  certificates: {
    eyebrow: string;
    title: string;
    lead: string;
    view: string;
    items: Array<{
      title: string;
      subtitle?: string;
      image: string;
      href: string;
    }>;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    channels: Array<{
      label: string;
      value: string;
      href: string;
      icon: 'whatsapp' | 'linkedin' | 'github' | 'email' | 'phone' | 'cv';
      external?: boolean;
    }>;
  };
  footer: {
    backToTop: string;
  };
}

const EN: UiCopy = {
  skip: 'Skip to content',
  brand: 'Amira Gomaa',
  nav: {
    about: 'About',
    skills: 'Skills',
    experience: 'Experience',
    education: 'Education',
    certificates: 'Certificates',
    contact: 'Contact',
  },
  downloadCv: 'Download CV',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  hero: {
    aria: 'Introduction',
    kicker: 'Portfolio · CV · Full Stack',
    title: 'Full Stack Developer',
    lead:
      'Designing scalable web & mobile products with .NET, Angular, and Flutter — from multi-tenant ERP platforms to polished store releases.',
    whatsapp: 'WhatsApp Me',
    seeExperience: 'See experience',
    downloadCv: 'Download CV',
    socialAria: 'Social links',
    focus: 'Focus',
    focusItems: ['.NET APIs', 'Angular apps', 'Flutter mobile', 'Multi-tenant SaaS'],
    yearsLabel: 'years shipping production systems',
  },
  about: {
    eyebrow: 'About',
    title: 'Reliable software. Clear business value.',
    body:
      'Full Stack Developer with over 3 years of experience designing and delivering scalable web and mobile applications using .NET, Angular, Flutter, and SQL Server. Experienced in ERP and HR solutions, RESTful APIs, Multi-Tenant SaaS platforms, AWS integrations, and mobile application deployment.',
    portraitAlt: 'Portrait of Amira Gomaa',
  },
  skills: {
    eyebrow: 'Technical Skills',
    title: 'Stack I ship with',
    groups: {
      Backend: 'Backend',
      Frontend: 'Frontend',
      Mobile: 'Mobile',
      Database: 'Database',
      Architecture: 'Architecture',
      'Multi-Tenant & SaaS': 'Multi-Tenant & SaaS',
      'DevOps & Cloud': 'DevOps & Cloud',
      Methodologies: 'Methodologies',
    },
  },
  experience: {
    eyebrow: 'Experience',
    title: 'Where I’ve made an impact',
    product: 'Product',
    jobs: [
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
    ],
  },
  education: {
    eyebrow: 'Education',
    title: 'Learning that shaped the craft',
    items: [
      {
        title: 'MBA — Master of Business Administration',
        subtitle: 'RB College (Royale Business College)',
        year: 'Master’s',
        url: 'https://www.rb-college.co.uk/',
        logo: 'assets/logos/rb-college.png',
        logoClass: 'logo-light',
      },
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
    ],
  },
  certificates: {
    eyebrow: 'Certificates',
    title: 'Credentials that back the craft',
    lead: 'Click any certificate to open the linked credential.',
    view: 'View credential',
    items: [
      {
        title: 'Udemy Certificate',
        subtitle: 'Verified course completion',
        image: 'assets/certificates/udemy-certificate.jpg',
        href: 'https://lnkd.in/e4kqbQzm',
      },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Let’s build something solid',
    lead: 'Every channel below is clickable — pick whatever is easiest.',
    channels: [
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
    ],
  },
  footer: {
    backToTop: 'Back to top',
  },
};

const AR: UiCopy = {
  skip: 'تخطى إلى المحتوى',
  brand: 'أميرة جمعة',
  nav: {
    about: 'نبذة',
    skills: 'المهارات',
    experience: 'الخبرة',
    education: 'التعليم',
    certificates: 'الشهادات',
    contact: 'تواصل',
  },
  downloadCv: 'تحميل السيرة',
  openMenu: 'فتح القائمة',
  closeMenu: 'إغلاق القائمة',
  hero: {
    aria: 'مقدمة',
    kicker: 'معرض أعمال · سيرة · مطورة كاملة',
    title: 'مطورة برمجيات كاملة',
    lead:
      'أصمم وأبني منتجات ويب وموبايل قابلة للتوسع باستخدام .NET وAngular وFlutter — من منصات ERP متعددة المستأجرين إلى إصدارات متاجر التطبيقات.',
    whatsapp: 'تواصلي عبر واتساب',
    seeExperience: 'شاهدي الخبرة',
    downloadCv: 'تحميل السيرة',
    socialAria: 'روابط التواصل',
    focus: 'التركيز',
    focusItems: ['واجهات .NET', 'تطبيقات Angular', 'موبايل Flutter', 'SaaS متعدد المستأجرين'],
    yearsLabel: 'سنوات في بناء أنظمة إنتاجية',
  },
  about: {
    eyebrow: 'نبذة',
    title: 'برمجيات موثوقة. قيمة واضحة للأعمال.',
    body:
      'مطورة برمجيات كاملة بخبرة أكثر من 3 سنوات في تصميم وتطوير تطبيقات ويب وموبايل قابلة للتوسع باستخدام .NET وAngular وFlutter وSQL Server. خبرة في حلول ERP وHR وواجهات REST ومنصات SaaS متعددة المستأجرين وتكاملات AWS ونشر تطبيقات الموبايل.',
    portraitAlt: 'صورة أميرة جمعة',
  },
  skills: {
    eyebrow: 'المهارات التقنية',
    title: 'التقنيات التي أعمل بها',
    groups: {
      Backend: 'الواجهة الخلفية',
      Frontend: 'الواجهة الأمامية',
      Mobile: 'الموبايل',
      Database: 'قواعد البيانات',
      Architecture: 'الهندسة المعمارية',
      'Multi-Tenant & SaaS': 'متعدد المستأجرين وSaaS',
      'DevOps & Cloud': 'DevOps والسحابة',
      Methodologies: 'المنهجيات',
    },
  },
  experience: {
    eyebrow: 'الخبرة',
    title: 'أين صنعت أثراً',
    product: 'المنتج',
    jobs: [
      {
        company: 'Bussma Solutions',
        companyUrl: 'https://bussmasolutions.com/en',
        role: 'مطورة برمجيات كاملة',
        period: 'مارس 2025 – حتى الآن',
        product: 'Bussma ERP',
        note: 'تُعرف أيضاً باسم Jadara في السوق السعودي.',
        tags: ['.NET', 'Angular', 'Flutter', 'AWS S3', 'Docker', 'Multi-Tenant'],
        bullets: [
          'ساهمت في تطوير Bussma ERP، منصة ERP واسعة النطاق للسوق السعودي.',
          'طورت تطبيقات Angular وخدمات ASP.NET Core.',
          'نفذت بنية متعددة المستأجرين لدعم عدة عملاء.',
          'بنيت تطبيقات Flutter وأدرت إصدارات App Store وPlay Store.',
          'دمجت خدمات AWS S3 وشاركت في نشر Docker.',
        ],
      },
      {
        company: 'XLab Group',
        companyUrl: 'https://xlab-group.com/',
        role: 'مطورة برمجيات كاملة',
        period: '2023 – فبراير 2025',
        product: 'Vibes',
        tags: ['Angular', '.NET', 'HR Systems', 'DevExpress', 'Realtime'],
        bullets: [
          'طورت Vibes، نظام إدارة موارد بشرية للويب والموبايل.',
          'بنيت وحدات Angular وواجهات .NET.',
          'نفذت ميزات فورية وتحسينات للنظام.',
          'حسّنت أداء التطبيق بنحو 20%.',
          'دمجت حلول تقارير DevExpress.',
        ],
      },
    ],
  },
  education: {
    eyebrow: 'التعليم',
    title: 'تعليم شكّل المسيرة',
    items: [
      {
        title: 'ماجستير إدارة الأعمال — MBA',
        subtitle: 'كلية RB (Royale Business College)',
        year: 'ماجستير',
        url: 'https://www.rb-college.co.uk/',
        logo: 'assets/logos/rb-college.png',
        logoClass: 'logo-light',
      },
      {
        title: 'مسار تطوير الويب الاحترافي — ITI',
        subtitle: 'معهد تكنولوجيا المعلومات · 9 أشهر',
        year: '2023',
        url: 'https://iti.gov.eg/',
        logo: 'assets/logos/iti.png',
        logoClass: 'logo-dark',
      },
      {
        title: 'جامعة الإسكندرية',
        subtitle: 'بكالوريوس · كلية الهندسة — اتصالات · التقدير: جيد جداً',
        year: 'هندسة',
        url: 'https://eng.alexu.edu.eg/index.php/en',
        logo: 'assets/logos/alexu.png',
      },
    ],
  },
  certificates: {
    eyebrow: 'الشهادات',
    title: 'شهادات تدعم المسيرة',
    lead: 'اضغطي على أي شهادة لفتح الرابط المرتبط بها.',
    view: 'عرض الشهادة',
    items: [
      {
        title: 'شهادة Udemy',
        subtitle: 'إتمام دورة معتمد',
        image: 'assets/certificates/udemy-certificate.jpg',
        href: 'https://lnkd.in/e4kqbQzm',
      },
    ],
  },
  contact: {
    eyebrow: 'تواصل',
    title: 'لنبنِ شيئاً متيناً',
    lead: 'كل وسيلة تواصل أدناه قابلة للضغط — اختاري الأسهل لك.',
    channels: [
      {
        label: 'واتساب',
        value: '+20 10 96825528',
        href: 'https://wa.me/201096825528',
        icon: 'whatsapp',
        external: true,
      },
      {
        label: 'هاتف',
        value: '+20 106 778 4941',
        href: 'tel:+201067784941',
        icon: 'phone',
      },
      {
        label: 'بريد',
        value: 'amiragomaa2597@gmail.com',
        href: 'mailto:amiragomaa2597@gmail.com',
        icon: 'email',
      },
      {
        label: 'لينكدإن',
        value: 'amira-gomaa-58b41a17a',
        href: 'https://linkedin.com/in/amira-gomaa-58b41a17a',
        icon: 'linkedin',
        external: true,
      },
      {
        label: 'جيت هب',
        value: 'amiragomaa2597',
        href: 'https://github.com/amiragomaa2597',
        icon: 'github',
        external: true,
      },
      {
        label: 'السيرة',
        value: 'تحميل PDF',
        href: 'Amira_Gomaa_Full_Stack_Developer_CV.pdf',
        icon: 'cv',
      },
    ],
  },
  footer: {
    backToTop: 'العودة للأعلى',
  },
};

const DICTS: Record<Lang, UiCopy> = { en: EN, ar: AR };

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'amira-portfolio-lang';
  readonly lang = signal<Lang>(this.readInitial());
  readonly t = computed(() => DICTS[this.lang()]);
  readonly isRtl = computed(() => this.lang() === 'ar');

  constructor() {
    effect(() => {
      const lang = this.lang();
      const root = document.documentElement;
      root.lang = lang;
      root.dir = lang === 'ar' ? 'rtl' : 'ltr';
      root.classList.toggle('lang-ar', lang === 'ar');
      localStorage.setItem(this.storageKey, lang);
    });
  }

  setLang(lang: Lang): void {
    this.lang.set(lang);
  }

  toggle(): void {
    this.setLang(this.lang() === 'en' ? 'ar' : 'en');
  }

  private readInitial(): Lang {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved === 'ar' || saved === 'en') return saved;
    } catch {
      /* ignore */
    }
    return 'en';
  }
}
