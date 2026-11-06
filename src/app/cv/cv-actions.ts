import { Injectable, inject } from '@angular/core';
import { CV_FILENAME, buildCvDocument } from '../data/portfolio.data';
import { ContentStore } from '../state/content.store';
import { downloadCvPdf } from './download-cv';

@Injectable({ providedIn: 'root' })
export class CvActions {
  private readonly content = inject(ContentStore);

  async downloadCurrent(): Promise<void> {
    if (!this.content.hasDraft()) {
      const link = document.createElement('a');
      link.href = CV_FILENAME;
      link.download = CV_FILENAME;
      link.click();
      return;
    }
    await downloadCvPdf(buildCvDocument(this.content.content(), false));
  }
}
