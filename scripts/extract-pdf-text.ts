import { inflateSync } from 'node:zlib';

function unescapePdfString(raw: string): string {
  let out = '';
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (char !== '\\') {
      out += char;
      continue;
    }
    const next = raw[++i];
    if (next === undefined) {
      break;
    }
    if (next === 'n') out += '\n';
    else if (next === 'r') out += '\r';
    else if (next === 't') out += '\t';
    else if (next === '(' || next === ')' || next === '\\') out += next;
    else if (next >= '0' && next <= '7') {
      let octal = next;
      for (let extra = 0; extra < 2; extra++) {
        const digit = raw[i + 1];
        if (digit !== undefined && digit >= '0' && digit <= '7') {
          octal += digit;
          i++;
        } else {
          break;
        }
      }
      out += String.fromCharCode(parseInt(octal, 8));
    } else {
      out += next;
    }
  }
  return out;
}

function decodeHexString(hex: string): string {
  let out = '';
  for (let i = 0; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return out;
}

function stringsFromContent(content: string): string {
  const pieces: string[] = [];

  for (const match of content.matchAll(/\[(.*?)\]\s*TJ/gs)) {
    const inner = match[1] ?? '';
    let line = '';
    for (const part of inner.matchAll(/<([0-9A-Fa-f]+)>|\(((?:\\.|[^\\)])*)\)/g)) {
      if (part[1]) {
        line += decodeHexString(part[1]);
      } else {
        line += unescapePdfString(part[2] ?? '');
      }
    }
    if (line) {
      pieces.push(line);
    }
  }

  for (const match of content.matchAll(/\(((?:\\.|[^\\)])*)\)\s*(?:Tj|')/g)) {
    pieces.push(unescapePdfString(match[1] ?? ''));
  }

  return pieces.join('\n');
}

function inflateStream(bytes: Buffer): Buffer | null {
  try {
    return inflateSync(bytes);
  } catch {
    return null;
  }
}

/** Pull text-showing operators out of a PDFKit (or any Flate/plain) content stream. */
export function extractPdfText(pdf: Buffer): string {
  const latin = pdf.toString('latin1');
  const pieces: string[] = [];
  const streams = /\/Length\s+(\d+)([^>]*)>>\s*stream\r?\n/g;

  for (const match of latin.matchAll(streams)) {
    const length = Number(match[1]);
    const start = (match.index ?? 0) + match[0].length;
    const bytes = Buffer.from(latin.slice(start, start + length), 'latin1');
    const decoded = match[2]?.includes('FlateDecode') ? inflateStream(bytes) : bytes;
    if (!decoded) {
      continue;
    }
    const text = stringsFromContent(decoded.toString('latin1'));
    if (text.trim()) {
      pieces.push(text);
    }
  }

  return pieces.join('\n');
}
