import { Injectable, computed, signal } from '@angular/core';
import {
  isPortfolioContent,
  publishedContent,
  type PortfolioContent,
} from '../data/portfolio.data';

const STORAGE_KEY = 'portfolio.draft';

@Injectable({ providedIn: 'root' })
export class ContentStore {
  private readonly draft = signal<PortfolioContent | null>(this.readDraft());
  readonly content = computed(() => this.draft() ?? publishedContent());
  readonly hasDraft = computed(() => this.draft() !== null);

  save(next: PortfolioContent): void {
    const copy = structuredClone(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
    this.draft.set(copy);
  }

  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.draft.set(null);
  }

  importJson(raw: string): boolean {
    const parsed: unknown = JSON.parse(raw);
    if (!isPortfolioContent(parsed)) {
      return false;
    }
    this.save(parsed);
    return true;
  }

  private readDraft(): PortfolioContent | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed: unknown = JSON.parse(raw);
      return isPortfolioContent(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
}
