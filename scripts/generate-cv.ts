import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';
import { buildCvDocument, CV_HEADINGS } from '../src/app/data/portfolio.data';
import { pdfSafe } from './pdf-safe';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cv = buildCvDocument();
const outPath = path.join(root, 'public', cv.fileName);

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 54, bottom: 54, left: 54, right: 54 },
  pdfVersion: '1.4',
  lang: 'en-US',
  info: {
    Title: `${cv.fullName} CV`,
    Author: cv.fullName,
    Subject: 'Full Stack Developer CV',
    Keywords: 'C#, ASP.NET Core, Entity Framework, REST APIs, Angular, .NET',
    CreationDate: new Date('2026-01-01T00:00:00.000Z'),
  },
});

const bodySize = 10.5;
const bottom = () => doc.page.height - doc.page.margins.bottom;

function ensure(minHeight: number): void {
  if (doc.y + minHeight > bottom()) {
    doc.addPage();
  }
}

function section(title: string): void {
  ensure(72);
  if (doc.y > doc.page.margins.top + 8) {
    doc.moveDown(0.85);
  }
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#000000').text(title, { lineGap: 0 });
  doc.moveDown(0.28);
}

function body(text: string, options?: PDFKit.Mixins.TextOptions): void {
  doc
    .font('Helvetica')
    .fontSize(bodySize)
    .fillColor('#000000')
    .text(pdfSafe(text), {
      align: 'left',
      lineGap: 2,
      ...options,
    });
}

function labelLine(label: string, value: string): void {
  doc
    .font('Helvetica-Bold')
    .fontSize(bodySize)
    .fillColor('#000000')
    .text(`${label}: `, { continued: true, lineGap: 1 });
  doc.font('Helvetica').text(pdfSafe(value), { lineGap: 1 });
}

doc
  .font('Helvetica-Bold')
  .fontSize(16)
  .fillColor('#000000')
  .text(pdfSafe(cv.fullName), { lineGap: 1 });
doc.moveDown(0.15);
body(cv.headline);
doc.moveDown(0.35);
for (const contact of cv.contacts) {
  labelLine(contact.label, contact.value);
}

section(CV_HEADINGS[0]);
body(cv.summary);

section(CV_HEADINGS[1]);
for (const group of cv.skills) {
  labelLine(group.title, group.items.join(', '));
}

section(CV_HEADINGS[2]);
cv.experience.forEach((job, index) => {
  if (index > 0) {
    doc.moveDown(0.45);
  }
  ensure(78);
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#000000')
    .text(pdfSafe(job.role), { lineGap: 1 });
  body(`${job.company} | ${job.period}`);
  body(job.companyUrl);
  if (job.product) {
    body(job.product);
  }
  if (job.note) {
    body(job.note);
  }
  for (const bullet of job.bullets) {
    body(`- ${bullet}`, { indent: 12 });
  }
});

section(CV_HEADINGS[3]);
cv.projects.forEach((project, index) => {
  if (index > 0) {
    doc.moveDown(0.45);
  }
  ensure(64);
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#000000')
    .text(pdfSafe(project.name), { lineGap: 1 });
  body(`${project.company} | ${project.period}`);
  body(project.summary);
  if (project.note) {
    body(project.note);
  }
  labelLine('Technologies', project.tags.join(', '));
});

section(CV_HEADINGS[4]);
cv.education.forEach((item, index) => {
  if (index > 0) {
    doc.moveDown(0.4);
  }
  ensure(48);
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#000000')
    .text(pdfSafe(item.title), { lineGap: 1 });
  body(item.detail);
  body(item.url);
});

const stream = createWriteStream(outPath);
doc.pipe(stream);
doc.end();

stream.on('finish', () => {
  console.log(`Wrote ${outPath}`);
});
stream.on('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
