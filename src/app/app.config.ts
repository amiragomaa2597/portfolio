import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { DefaultUrlSerializer, provideRouter, UrlSerializer, UrlTree, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

/** GitHub Pages serves /ats/ for the folder. The route is registered as ats. */
class PagesUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    const splitAt = url.search(/[?#]/);
    const path = splitAt === -1 ? url : url.slice(0, splitAt);
    const rest = splitAt === -1 ? '' : url.slice(splitAt);
    const trimmed = path.length > 1 ? path.replace(/\/+$/, '') : path;
    return super.parse(`${trimmed}${rest}`);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    { provide: UrlSerializer, useClass: PagesUrlSerializer },
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })),
  ]
};
