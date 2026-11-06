import { CV_HEADINGS, type CvDocument } from '../data/portfolio.data';

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 54;
const BODY = 10.5;
const WIDTH = PAGE_WIDTH - MARGIN * 2;

interface Row {
  size: number;
  font: 'F1' | 'F2';
  text: string;
  gap: number;
}

function pdfSafe(input: string): string {
  return input
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u00B7/g, '|')
    .replace(/[^\u0020-\u007E]/g, '');
}

function escapePdf(input: string): string {
  return input.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrap(text: string, size: number): string[] {
  const maxChars = Math.max(24, Math.floor(WIDTH / (size * 0.48)));
  const words = pdfSafe(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  return line ? [...lines, line] : [''];
}

function paginate(rows: Row[]): string[][] {
  const pages: string[][] = [];
  let commands: string[] = [];
  let y = PAGE_HEIGHT - MARGIN;

  const flush = (): void => {
    pages.push(commands);
    commands = [];
    y = PAGE_HEIGHT - MARGIN;
  };

  for (const row of rows) {
    const drop = row.size + row.gap;
    if (y - drop < MARGIN && commands.length) {
      flush();
    }
    const baseline = (y - row.size).toFixed(2);
    commands.push(`/${row.font} ${row.size} Tf`);
    commands.push(`1 0 0 1 ${MARGIN} ${baseline} Tm (${escapePdf(pdfSafe(row.text))}) Tj`);
    y -= drop;
  }
  if (commands.length) {
    pages.push(commands);
  }
  return pages.length ? pages : [['']];
}

function pdfBytes(pages: string[][]): Uint8Array {
  const objects: string[] = [];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
  const pageIds: number[] = [];
  let nextId = 5;
  for (const commands of pages) {
    const stream = `BT\n${commands.filter(Boolean).join('\n')}\nET\n`;
    const contentId = nextId++;
    const pageId = nextId++;
    objects[contentId] = `<< /Length ${stream.length} >>\nstream\n${stream}endstream`;
    objects[pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Contents ${contentId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>`;
    pageIds.push(pageId);
  }
  objects[2] =
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;

  let body = '%PDF-1.4\n';
  const offsets = [0];
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = body.length;
    body += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xref = body.length;
  body += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id += 1) {
    body += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(body);
}

function pushText(rows: Row[], text: string, size: number, font: Row['font']): void {
  for (const line of wrap(text, size)) {
    rows.push({ size, font, text: line, gap: 3 });
  }
}

export async function downloadCvPdf(cv: CvDocument): Promise<void> {
  const rows: Row[] = [];
  pushText(rows, cv.fullName, 16, 'F2');
  pushText(rows, cv.headline, BODY, 'F1');
  for (const contact of cv.contacts) {
    pushText(rows, `${contact.label}: ${contact.value}`, BODY, 'F1');
  }
  const section = (title: string): void => {
    rows.push({ size: 8, font: 'F1', text: ' ', gap: 6 });
    pushText(rows, title, 12, 'F2');
  };
  section(CV_HEADINGS[0]);
  pushText(rows, cv.summary, BODY, 'F1');
  section(CV_HEADINGS[1]);
  for (const group of cv.skills) {
    pushText(rows, `${group.title}: ${group.items.join(', ')}`, BODY, 'F1');
  }
  section(CV_HEADINGS[2]);
  for (const job of cv.experience) {
    pushText(rows, job.role, 11, 'F2');
    pushText(rows, `${job.company} | ${job.period}`, BODY, 'F1');
    pushText(rows, job.companyUrl, BODY, 'F1');
    if (job.product) {
      pushText(rows, job.product, BODY, 'F1');
    }
    if (job.note) {
      pushText(rows, job.note, BODY, 'F1');
    }
    for (const bullet of job.bullets) {
      pushText(rows, `- ${bullet}`, BODY, 'F1');
    }
  }
  section(CV_HEADINGS[3]);
  for (const project of cv.projects) {
    pushText(rows, project.name, 11, 'F2');
    pushText(rows, `${project.company} | ${project.period}`, BODY, 'F1');
    pushText(rows, project.summary, BODY, 'F1');
    if (project.note) {
      pushText(rows, project.note, BODY, 'F1');
    }
    pushText(rows, `Technologies: ${project.tags.join(', ')}`, BODY, 'F1');
  }
  section(CV_HEADINGS[4]);
  for (const item of cv.education) {
    pushText(rows, item.title, 11, 'F2');
    pushText(rows, item.detail, BODY, 'F1');
    pushText(rows, item.url, BODY, 'F1');
  }

  const bytes = pdfBytes(paginate(rows));
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob = new Blob([buffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = cv.fileName;
  link.click();
  URL.revokeObjectURL(url);
}
