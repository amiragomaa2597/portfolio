import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SiteGateService } from './site-gate.service';

export const siteGateGuard: CanActivateFn = (_route, state) => {
  const gate = inject(SiteGateService);
  if (gate.unlocked()) {
    return true;
  }
  return inject(Router).createUrlTree(['/gate'], {
    queryParams: { next: state.url },
  });
};
