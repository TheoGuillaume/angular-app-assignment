import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authCommunGuard } from './auth-commun.guard';

describe('authCommunGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authCommunGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
