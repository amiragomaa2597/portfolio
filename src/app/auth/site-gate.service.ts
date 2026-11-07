import { Injectable, signal } from '@angular/core';

const UNLOCK_KEY = 'portfolio.siteUnlocked';
/** SHA-256 of AmiraEdit2026 — casual privacy only; not real server auth. */
const PASSWORD_HASH =
  '621e425c5cf3131da2093e32dfc490084901ca4251952718f125e7dd294c8909';

@Injectable({ providedIn: 'root' })
export class SiteGateService {
  readonly unlocked = signal(this.readUnlocked());

  async unlock(password: string): Promise<boolean> {
    const hash = await sha256Hex(password.trim());
    if (hash !== PASSWORD_HASH) {
      return false;
    }
    sessionStorage.setItem(UNLOCK_KEY, '1');
    this.unlocked.set(true);
    return true;
  }

  lock(): void {
    sessionStorage.removeItem(UNLOCK_KEY);
    this.unlocked.set(false);
  }

  private readUnlocked(): boolean {
    try {
      return sessionStorage.getItem(UNLOCK_KEY) === '1';
    } catch {
      return false;
    }
  }
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
