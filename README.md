# Amira Gomaa — Portfolio (Angular 22)

Personal CV / portfolio site for **Amira Gomaa Hassan**, Full Stack Developer (.NET | Angular | Flutter).

**Live site:** https://amiragomaa2597.github.io/portfolio/

## Stack

- Angular 22 (standalone components)
- SCSS + scroll reveal animations
- GitHub Pages via GitHub Actions

## Local development

```bash
npm install
npm start
```

Open http://localhost:4200/

## Production build

```bash
npm run build -- --configuration=production
```

Output: `dist/amira-portfolio-ng/browser` (base href `/portfolio/`)

## Updating content

- Experience / education / skills / contacts: `src/app/data/portfolio.data.ts`
- Photos & logos: `public/assets/`
- CV PDF: `public/Amira_Gomaa_Full_Stack_Developer_CV.pdf`
