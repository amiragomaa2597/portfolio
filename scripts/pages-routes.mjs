import { cpSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'dist/amira-portfolio-ng/browser');
const index = path.join(site, 'index.html');

cpSync(index, path.join(site, '404.html'));
for (const route of ['ats', 'edit']) {
  const dir = path.join(site, route);
  mkdirSync(dir, { recursive: true });
  cpSync(index, path.join(dir, 'index.html'));
}
