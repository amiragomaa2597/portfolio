import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCvDocument, CV_FILENAME, CV_HEADINGS } from '../src/app/data/portfolio.data';
import { extractPdfText } from './extract-pdf-text';
import { pdfSafe } from './pdf-safe';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pdfPath = path.join(root, 'public', CV_FILENAME);
const cv = buildCvDocument();
const pdf = readFileSync(pdfPath);
const raw = pdf.toString('latin1');
const extracted = extractPdfText(pdf);
const flat = extracted.replace(/\s+/g, ' ').trim();

const failures: string[] = [];

function fail(message: string): void {
  failures.push(message);
}

function mustInclude(label: string, value: string): void {
  const needle = pdfSafe(value).replace(/\s+/g, ' ').trim();
  if (!needle) {
    return;
  }
  if (!flat.includes(needle)) {
    fail(`${label} is missing from the PDF text: ${needle}`);
  }
}

if (path.basename(pdfPath) !== 'Amira_Gomaa_CV.pdf') {
  fail(`Unexpected CV file name: ${path.basename(pdfPath)}`);
}
if (!raw.startsWith('%PDF-')) {
  fail('Output is not a PDF.');
}
if (/\/Subtype\s*\/Image/.test(raw)) {
  fail('PDF contains an image XObject. ATS output must be real text.');
}
if (!raw.includes('/Helvetica')) {
  fail('PDF is not using a standard Helvetica font.');
}
if (flat.length < 800) {
  fail(`Extracted text is too short (${flat.length} characters).`);
}

let cursor = 0;
for (const heading of CV_HEADINGS) {
  const at = flat.indexOf(heading, cursor);
  if (at < 0) {
    fail(`Missing section heading "${heading}".`);
    continue;
  }
  cursor = at + heading.length;
}

mustInclude('name', cv.fullName);
mustInclude('headline', cv.headline);
mustInclude('summary', cv.summary);
for (const contact of cv.contacts) {
  mustInclude(contact.label, contact.value);
}
for (const group of cv.skills) {
  mustInclude(`skill group ${group.title}`, group.title);
  for (const item of group.items) {
    mustInclude(`skill ${item}`, item);
  }
}
for (const job of cv.experience) {
  mustInclude('role', job.role);
  mustInclude('company', job.company);
  mustInclude('period', job.period);
  mustInclude('company url', job.companyUrl);
  if (job.product) mustInclude('product', job.product);
  if (job.note) mustInclude('note', job.note);
  for (const bullet of job.bullets) {
    mustInclude('bullet', bullet);
  }
}
for (const project of cv.projects) {
  mustInclude('project', project.name);
  mustInclude('project summary', project.summary);
  for (const tag of project.tags) {
    mustInclude(`project tag ${tag}`, tag);
  }
}
for (const item of cv.education) {
  mustInclude('education', item.title);
  mustInclude('education detail', item.detail);
  mustInclude('education url', item.url);
}

if (/bootstrap/i.test(flat)) {
  fail('PDF mentions Bootstrap, which is not in the portfolio data.');
}

const staleName = 'Amira_Gomaa_Full_Stack_' + 'Developer_CV.pdf';
function scan(dir: string): void {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      scan(full);
      continue;
    }
    if (!/\.(ts|html|scss|json|yml|md)$/.test(entry)) {
      continue;
    }
    const source = readFileSync(full, 'utf8');
    if (source.includes(staleName)) {
      fail(`${path.relative(root, full)} still references ${staleName}`);
    }
  }
}
for (const dir of ['src', 'scripts', '.github']) {
  scan(path.join(root, dir));
}

const oldPdf = path.join(root, 'public', staleName);
try {
  statSync(oldPdf);
  fail('The stale static CV is still in public/.');
} catch {
  /* removed */
}

if (failures.length > 0) {
  console.error(extracted);
  for (const message of failures) {
    console.error(`- ${message}`);
  }
  process.exit(1);
}

console.log(`CV text OK (${flat.length} characters, headings: ${CV_HEADINGS.join(', ')}).`);
