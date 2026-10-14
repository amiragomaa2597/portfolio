import { Injectable, computed, effect, signal } from '@angular/core';
import {
  localizedPortfolio,
  type LocalizedCertificate,
  type LocalizedContact,
  type LocalizedEducation,
  type LocalizedJob,
} from '../data/portfolio.data';

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
    yearsValue: string;
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
    jobs: LocalizedJob[];
  };
  education: {
    eyebrow: string;
    title: string;
    items: LocalizedEducation[];
  };
  certificates: {
    eyebrow: string;
    title: string;
    lead: string;
    view: string;
    items: LocalizedCertificate[];
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    channels: LocalizedContact[];
  };
  footer: {
    backToTop: string;
  };
}

interface Chrome {
  skip: string;
  nav: UiCopy['nav'];
  downloadCv: string;
  openMenu: string;
  closeMenu: string;
  hero: Omit<UiCopy['hero'], 'title' | 'lead' | 'focusItems' | 'yearsValue'>;
  about: Omit<UiCopy['about'], 'body'>;
  skills: Omit<UiCopy['skills'], 'groups'>;
  experience: Omit<UiCopy['experience'], 'jobs'>;
  education: Omit<UiCopy['education'], 'items'>;
  certificates: Omit<UiCopy['certificates'], 'items'>;
  contact: Omit<UiCopy['contact'], 'channels'>;
  footer: UiCopy['footer'];
}

const EN: Chrome = {
  skip: 'Skip to content',
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
    whatsapp: 'WhatsApp Me',
    seeExperience: 'See experience',
    downloadCv: 'Download CV',
    socialAria: 'Social links',
    focus: 'Focus',
    yearsLabel: 'years shipping production systems',
  },
  about: {
    eyebrow: 'About',
    title: 'Reliable software. Clear business value.',
    portraitAlt: 'Portrait of Amira Gomaa',
  },
  skills: {
    eyebrow: 'Technical Skills',
    title: 'Stack I ship with',
  },
  experience: {
    eyebrow: 'Experience',
    title: 'Where I\u2019ve made an impact',
    product: 'Product',
  },
  education: {
    eyebrow: 'Education',
    title: 'Learning that shaped the craft',
  },
  certificates: {
    eyebrow: 'Certificates',
    title: 'Credentials that back the craft',
    lead: 'Click any certificate to open the linked credential.',
    view: 'View credential',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Let\u2019s build something solid',
    lead: 'Every channel below is clickable — pick whatever is easiest.',
  },
  footer: {
    backToTop: 'Back to top',
  },
};

const AR: Chrome = {
  skip: 'تخطى إلى المحتوى',
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
    whatsapp: 'تواصلي عبر واتساب',
    seeExperience: 'شاهدي الخبرة',
    downloadCv: 'تحميل السيرة',
    socialAria: 'روابط التواصل',
    focus: 'التركيز',
    yearsLabel: 'سنوات في بناء أنظمة إنتاجية',
  },
  about: {
    eyebrow: 'نبذة',
    title: 'برمجيات موثوقة. قيمة واضحة للأعمال.',
    portraitAlt: 'صورة أميرة جمعة',
  },
  skills: {
    eyebrow: 'المهارات التقنية',
    title: 'التقنيات التي أعمل بها',
  },
  experience: {
    eyebrow: 'الخبرة',
    title: 'أين صنعت أثراً',
    product: 'المنتج',
  },
  education: {
    eyebrow: 'التعليم',
    title: 'تعليم شكّل المسيرة',
  },
  certificates: {
    eyebrow: 'الشهادات',
    title: 'شهادات تدعم المسيرة',
    lead: 'اضغطي على أي شهادة لفتح الرابط المرتبط بها.',
    view: 'عرض الشهادة',
  },
  contact: {
    eyebrow: 'تواصل',
    title: 'لنبنِ شيئاً متيناً',
    lead: 'كل وسيلة تواصل أدناه قابلة للضغط — اختاري الأسهل لك.',
  },
  footer: {
    backToTop: 'العودة للأعلى',
  },
};

const CHROME: Record<Lang, Chrome> = { en: EN, ar: AR };

export function copyFor(lang: Lang): UiCopy {
  const chrome = CHROME[lang];
  const facts = localizedPortfolio(lang);
  return {
    skip: chrome.skip,
    brand: facts.brand,
    nav: chrome.nav,
    downloadCv: chrome.downloadCv,
    openMenu: chrome.openMenu,
    closeMenu: chrome.closeMenu,
    hero: {
      ...chrome.hero,
      title: facts.title,
      lead: facts.lead,
      focusItems: facts.focusItems,
      yearsValue: facts.yearsValue,
    },
    about: {
      ...chrome.about,
      body: facts.summary,
    },
    skills: {
      ...chrome.skills,
      groups: facts.skillGroupLabels,
    },
    experience: {
      ...chrome.experience,
      jobs: facts.jobs,
    },
    education: {
      ...chrome.education,
      items: facts.education,
    },
    certificates: {
      ...chrome.certificates,
      items: facts.certificates,
    },
    contact: {
      ...chrome.contact,
      channels: facts.contacts,
    },
    footer: chrome.footer,
  };
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly storageKey = 'amira-portfolio-lang';
  readonly lang = signal<Lang>(this.readInitial());
  readonly t = computed(() => copyFor(this.lang()));
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
