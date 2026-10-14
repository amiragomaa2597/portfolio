# Amira Gomaa — Portfolio

Personal portfolio for **Amira Gomaa Hassan**, Full Stack Developer (.NET | Angular | Flutter).

**Live site:** https://amiragomaa2597.github.io/portfolio/

## Local preview

```bash
npm install
npm start
```

`npm start` regenerates `public/Amira_Gomaa_CV.pdf` before the dev server starts. Production deploys run the same step from `npm run build`.

## Update the portfolio and CV

Profile, summary, skills, experience, projects, education, certificates, and contact live in [`src/app/data/portfolio.data.ts`](src/app/data/portfolio.data.ts). The site and the Download CV file both read that module, so editing it updates both.

The PDF is a single-column, text-based CV (`Amira_Gomaa_CV.pdf`) with the headings Summary, Skills, Experience, Projects, and Education. It is generated in the GitHub Pages workflow; do not replace it by hand.

Section labels and other interface copy stay in `src/app/i18n/language.service.ts`. Arabic wording for the facts themselves is next to the English in the data file.

## CV details still missing from the repo

These are omitted or only partly shown because they are not in the portfolio content. Add them to `portfolio.data.ts` when you have the real values:

- MBA completion year (the site only says “Master’s”).
- Alexandria University graduation year (the card badge says “Engineering”, not a year).
- A month for the XLab Group start (currently “2023”).
- City, country, or work location.
- Which phone number is primary. WhatsApp and Phone are two different numbers, and the CV lists both.
- Experience bullets for skills that are only in the skills list today: C#, Entity Framework, PostgreSQL, and Tailwind.
- Whether the Udemy Power Apps certificate should appear on the CV. It is on the site, and it is not in the PDF.
